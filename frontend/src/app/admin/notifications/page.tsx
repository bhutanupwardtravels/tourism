"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Save, Mail, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getOperatorEmailsAction, updateOperatorEmailsAction } from "./actions";
import { OperatorEmailsContent } from "@/lib/data/operator-emails";

export default function NotificationsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [emails, setEmails] = useState<string[]>([""]);
    const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data: OperatorEmailsContent = await getOperatorEmailsAction();
                setEmails(data.emails.length > 0 ? data.emails : [""]);
                setUpdatedAt(data.updatedAt);
            } catch {
                toast.error("Failed to load notification emails");
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const setEmail = (index: number, value: string) =>
        setEmails((prev) => prev.map((e, i) => (i === index ? value : e)));

    const addEmail = () => setEmails((prev) => [...prev, ""]);

    const removeEmail = (index: number) =>
        setEmails((prev) => prev.filter((_, i) => i !== index));

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const cleaned = emails.map((e) => e.trim()).filter(Boolean);
            const result = await updateOperatorEmailsAction({ emails: cleaned });
            if (result.success) {
                toast.success(result.message);
                setEmails(cleaned.length > 0 ? cleaned : [""]);
                setUpdatedAt(new Date().toISOString());
            } else {
                toast.error(result.message);
            }
        } catch {
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
                <Skeleton className="h-64 w-full max-w-2xl rounded-none bg-gray-200" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-black">
                        Notification Emails
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Manage who receives an email for every new trip request.
                        {updatedAt && (
                            <span className="block sm:inline sm:ml-2 text-xs text-neutral-400">
                                Last updated {format(new Date(updatedAt), "MMM d, yyyy 'at' HH:mm")}
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

            <Card className="rounded-none max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-black">Operator Notification Emails</CardTitle>
                    <CardDescription>
                        Every address here receives the new-request notification, and reply-to on
                        approval/rejection emails routes here too. Leave empty to fall back to the
                        OPERATOR_EMAIL environment variable.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {emails.map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(index, e.target.value)}
                                    placeholder="operator@bhutanupwardtravels.com"
                                    className="rounded-none text-black pl-10"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeEmail(index)}
                                disabled={emails.length <= 1}
                                className="rounded-none shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addEmail} className="rounded-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Add another email
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
