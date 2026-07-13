import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { supabaseAdmin } from "./supabase/admin";

const BUCKET = "images";

// Extracts the object path from a Supabase Storage public URL, e.g.
// https://xyz.supabase.co/storage/v1/object/public/images/abc.webp -> abc.webp
function storagePathFromUrl(url: string): string | null {
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);
}

export async function uploadImage(file: File): Promise<string | null> {
    if (!file || !(file instanceof File) || file.size === 0) {
        return null;
    }
    if (file.size > 5 * 1024 * 1024) {
        console.warn("Upload rejected: file exceeds 5 MB limit");
        return null;
    }

    try {
        const bytes = await file.arrayBuffer();
        let buffer: Buffer = Buffer.from(bytes as ArrayBuffer);
        let contentType = file.type || "application/octet-stream";
        let extension = "bin";

        // Compress the image using sharp
        try {
            buffer = (await sharp(buffer)
                .rotate()
                .withMetadata()
                .webp({ quality: 80, effort: 6 })
                .toBuffer()) as Buffer;
            contentType = "image/webp";
            extension = "webp";
        } catch (error) {
            console.warn("Image compression failed, using original:", error);
            extension = file.name?.split(".").pop() || "jpg";
        }

        const path = `${uuidv4()}.${extension}`;
        const supabase = supabaseAdmin();

        const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
            contentType,
            upsert: false,
        });

        if (error) {
            console.error("Supabase Storage upload failed:", error);
            return null;
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return data.publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

export async function deleteImage(filenameOrUrl: string): Promise<boolean> {
    try {
        const path = filenameOrUrl.startsWith("http")
            ? storagePathFromUrl(filenameOrUrl)
            : filenameOrUrl;

        // Not one of ours (external URL, legacy ImgBB/local path) — nothing to delete.
        if (!path) {
            console.warn(`Remote deletion not supported for URL: ${filenameOrUrl}`);
            return false;
        }

        const supabase = supabaseAdmin();
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (error) {
            console.error("Error deleting image:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
}

export async function updateImage(oldFilename: string, newFile: File): Promise<string | null> {
    try {
        // Attempt to delete the old image; external/legacy URLs are skipped.
        await deleteImage(oldFilename);

        return uploadImage(newFile);
    } catch (error) {
        console.error("Error updating image:", error);
        return null;
    }
}
