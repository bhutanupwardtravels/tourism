export function generateSlug(text: string): string {
    if (!text) return "";

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .trim()
        .replace(/\s+/g, "-"); // Replace spaces with -
}
