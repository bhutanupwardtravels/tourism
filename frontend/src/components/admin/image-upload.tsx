"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
    name?: string;
    label?: string;
    defaultPreview?: string | null;
    required?: boolean;
    onFileSelect?: (file: File | null) => void;
    className?: string;
    readOnly?: boolean;
}

export function ImageUpload({
    name = "image",
    label = "Cover Image",
    defaultPreview = null,
    required = false,
    onFileSelect,
    className,
    readOnly = false,
}: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(defaultPreview);
    const [dragActive, setDragActive] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Update preview if defaultPreview changes (e.g. data fetched asynchronously)
    React.useEffect(() => {
        if (defaultPreview) {
            setPreviewUrl(defaultPreview);
        }
    }, [defaultPreview]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                handleFile(file);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith("image/")) {
                handleFile(file);
            }
        }
    };

    const handleFile = (file: File) => {
        setPreviewUrl(URL.createObjectURL(file));
        if (fileInputRef.current && fileInputRef.current.files !== undefined) {
            // Create a new DataTransfer to update the file input files
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
        }
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (onFileSelect) {
            onFileSelect(null);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="text-black">{label} {required && "*"}</Label>
            <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed transition-colors ${dragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-200"
                    } ${previewUrl ? "aspect-video p-1 overflow-hidden rounded-md" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {previewUrl ? (
                    <div className="group relative w-full h-full">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                        {!readOnly && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="flex gap-4">
                                    <label
                                        htmlFor={name}
                                        className="bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                        Change
                                    </label>
                                    {/* Optional remove button can be added here */}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <label
                        htmlFor={readOnly ? undefined : name}
                        className={`flex h-full w-full ${readOnly ? 'cursor-default' : 'cursor-pointer'} flex-col items-center justify-center p-12 text-center space-y-3 bg-gray-50/50`}
                    >
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-900">
                                {readOnly ? 'No image' : 'Click to upload'}
                            </h4>
                            {!readOnly && (
                                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                    Drag and drop or click to select a file (PNG, JPG, up to 5MB)
                                </p>
                            )}
                        </div>
                    </label>
                )}
                <input
                    ref={fileInputRef}
                    id={name}
                    name={name}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*"
                    required={required && !previewUrl}
                />
            </div>
        </div>
    );
}
