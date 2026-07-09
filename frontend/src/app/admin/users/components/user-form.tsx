"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedArrowLeft, AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { userSchema, User } from "../schema";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

interface UserFormProps {
    initialData?: User;
    action: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
}

export function UserForm({ initialData, action, title: pageTitle }: UserFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    const form = useForm<User>({
        resolver: zodResolver(userSchema) as any,
        defaultValues: initialData || {
            username: "",
            email: "",
            role: "admin",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: User) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("role", data.role);
        if (data.password) formData.append("password", data.password);
        if (data.confirmPassword) formData.append("confirmPassword", data.confirmPassword);

        startTransition(async () => {
            try {
                const result = await action(null, formData);
                if (result.success) {
                    toast.success(result.message);
                    router.push("/admin/users");
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("An error occurred while saving user");
            }
        });
    };

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-6 md:p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Link href="/admin/users" className="mb-4">
                    <Button
                        variant="outline"
                        onMouseEnter={() => iconRef.current?.startAnimation()}
                        onMouseLeave={() => iconRef.current?.stopAnimation()}
                        className="text-black"
                    >
                        <AnimatedArrowLeft ref={iconRef} className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    {pageTitle}
                </h2>
                <p className="text-muted-foreground">Manage administrative access and user permissions for the portal.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* User Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Username *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. administrator"
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Email Address *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="admin@bhutan.luxury"
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-semibold">
                                            Access Level *
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={true}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full bg-zinc-50 border-gray-200 text-zinc-500 cursor-not-allowed">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="border-gray-200">
                                                <SelectItem value="admin" className="focus:bg-zinc-50 focus:text-black cursor-pointer">Administrator (Full Access)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-[10px] text-zinc-400 italic">
                                            Currently, only Administrator roles are available.
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                {initialData ? "New Password (Optional)" : "Password *"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {initialData && (
                                <p className="text-[10px] text-zinc-400 italic">Leave password fields empty to keep the current password.</p>
                            )}


                            <div className="flex justify-end gap-4 pb-10 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    asChild
                                    className="text-black min-w-[100px]"
                                >
                                    <Link href="/admin/users">Cancel</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-amber-600 hover:bg-amber-700 text-white min-w-[150px] font-medium"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {initialData ? "Update User" : "Create User"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-none border-amber-100 bg-amber-50/30">
                        <CardContent className="pt-6 space-y-4">
                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest border-b border-amber-200 pb-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 bg-amber-600 rounded-full" />
                                Role Information
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-amber-900 uppercase">Administrator</span>
                                    <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                        Full system access. Can create/edit tours, destinations, hotels, and manage other user accounts.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-zinc-100/50">
                        <CardContent className="pt-6 space-y-4">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">Password Policy</h4>
                            <ul className="space-y-2">
                                <li className="text-[11px] text-zinc-500 flex items-center gap-2">
                                    <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                    Minimum 6 characters
                                </li>
                                <li className="text-[11px] text-zinc-500 flex items-center gap-2">
                                    <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                    Must match confirmation
                                </li>
                                <li className="text-[11px] text-zinc-500 flex items-center gap-2">
                                    <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                    Case sensitive
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
