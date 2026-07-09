"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export function AdminBreadcrumbs() {
    const pathname = usePathname();

    // Split the path and filter out empty strings
    const pathSegments = pathname.split("/").filter((segment) => segment !== "");

    // The first segment is always 'admin', and we want to keep it as a base.
    // We'll skip it in the map but starting index 1 for the rest.

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
                href="/admin"
                className="font-bold text-black uppercase tracking-wider hover:text-amber-600 transition-colors"
            >
                Admin
            </Link>

            {pathSegments.length > 1 && (
                <span className="text-gray-300 mx-1">/</span>
            )}

            {pathSegments.slice(1).map((segment, index) => {
                const href = `/${pathSegments.slice(0, index + 2).join("/")}`;
                const isLast = index === pathSegments.length - 2;

                // Format the segment: destinations-create -> Destinations Create
                const label = segment
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return (
                    <React.Fragment key={href}>
                        {isLast ? (
                            <span className="text-gray-600 font-medium">{label}</span>
                        ) : (
                            <>
                                <Link
                                    href={href}
                                    className="hover:text-amber-600 transition-colors"
                                >
                                    {label}
                                </Link>
                                <span className="text-gray-300 mx-1">/</span>
                            </>
                        )}
                    </React.Fragment>
                );
            })}

            {pathSegments.length === 1 && (
                <>
                    <span className="text-gray-300 mx-1">/</span>
                    <span className="text-gray-600">Portal</span>
                </>
            )}
        </div>
    );
}
