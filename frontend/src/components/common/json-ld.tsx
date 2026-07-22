export function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            // Escape "<" so a value like "</script>" can't break out of the tag.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}
