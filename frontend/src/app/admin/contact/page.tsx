"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Loader2,
    Save,
    Mail,
    Phone,
    MessageCircle,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getContactContentAction, updateContactContentAction } from "./actions";
import { ContactContent } from "@/lib/data/contact";

const emptyContent: ContactContent = {
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    socials: { facebook: "", instagram: "", twitter: "", youtube: "" },
};

const contactFields = [
    {
        key: "email" as const,
        label: "Email",
        icon: Mail,
        type: "email",
        placeholder: "hello@bhutanupward.com",
        hint: "Shown in the footer and the site menu",
    },
    {
        key: "phone" as const,
        label: "Phone",
        icon: Phone,
        type: "text",
        placeholder: "+975 17 000 000",
        hint: "Rendered as a tap-to-call link",
    },
    {
        key: "whatsapp" as const,
        label: "WhatsApp",
        icon: MessageCircle,
        type: "text",
        placeholder: "+975 17 000 000",
        hint: "Opens a wa.me chat from the site menu",
    },
];

const socialFields = [
    { key: "facebook" as const, label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
    { key: "instagram" as const, label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
    { key: "twitter" as const, label: "Twitter / X", icon: Twitter, placeholder: "https://x.com/..." },
    { key: "youtube" as const, label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/..." },
];

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<ContactContent>(emptyContent);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getContactContentAction();
                setFormData(data);
            } catch (error) {
                toast.error("Failed to load contact details");
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const setField = (key: keyof Omit<ContactContent, "socials" | "updatedAt">, value: string) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const setSocial = (key: keyof ContactContent["socials"], value: string) =>
        setFormData((prev) => ({
            ...prev,
            socials: { ...prev.socials, [key]: value },
        }));

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const result = await updateContactContentAction(formData);
            if (result.success) {
                toast.success(result.message);
                setFormData((prev) => ({ ...prev, updatedAt: new Date().toISOString() }));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64 rounded-none bg-gray-200" />
                    <Skeleton className="h-4 w-96 rounded-none bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Skeleton className="h-96 w-full rounded-none bg-gray-200" />
                    <Skeleton className="h-96 w-full rounded-none bg-gray-200" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-black">
                        Contact & Socials
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Manage the contact details and social media links shown on the website.
                        {formData.updatedAt && (
                            <span className="block sm:inline sm:ml-2 text-xs text-neutral-400">
                                Last updated {format(new Date(formData.updatedAt), "MMM d, yyyy 'at' HH:mm")}
                            </span>
                        )}
                    </p>
                </div>
                <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-none bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle className="text-black">Contact Details</CardTitle>
                        <CardDescription>
                            How travelers can reach you — shown in the footer and the site menu.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {contactFields.map(({ key, label, icon: Icon, type, placeholder, hint }) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="text-black">
                                    {label}
                                </Label>
                                <div className="relative">
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                    <Input
                                        id={key}
                                        type={type}
                                        value={formData[key]}
                                        onChange={(e) => setField(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="rounded-none text-black pl-10"
                                    />
                                </div>
                                <p className="text-xs text-neutral-400">{hint}</p>
                            </div>
                        ))}
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-black">
                                Address
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setField("address", e.target.value)}
                                    placeholder={"Street\nCity, Bhutan"}
                                    rows={3}
                                    className="rounded-none text-black pl-10"
                                />
                            </div>
                            <p className="text-xs text-neutral-400">
                                Line breaks are kept when displayed in the footer
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle className="text-black">Social Media Links</CardTitle>
                        <CardDescription>
                            Full profile URLs. Leave a field empty to hide that icon on the website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="text-black">
                                    {label}
                                </Label>
                                <div className="relative">
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                    <Input
                                        id={key}
                                        type="url"
                                        value={formData.socials[key]}
                                        onChange={(e) => setSocial(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="rounded-none text-black pl-10"
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
