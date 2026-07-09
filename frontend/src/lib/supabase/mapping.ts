// Shallow key mapping between Postgres snake_case columns and the camelCase
// document shapes the app has used since the MongoDB days. Only top-level
// keys are converted — jsonb payloads (tour days, galleries, about content)
// keep their original camelCase keys.

const toSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (key: string) => key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

// Postgres row -> app document. Adds `id` and legacy `_id` (both the uuid
// string) so existing components keep working.
export function rowToDoc(row: any): any {
    if (!row) return null;
    const doc: Record<string, any> = {};
    for (const key of Object.keys(row)) {
        doc[toCamel(key)] = row[key];
    }
    doc.id = row.id;
    doc._id = row.id;
    return doc;
}

// App document -> Postgres row, restricted to the given columns so stray
// form fields (legacy/computed keys) never hit the database.
export function docToRow(doc: any, allowedColumns: string[]): Record<string, any> {
    const row: Record<string, any> = {};
    for (const key of Object.keys(doc ?? {})) {
        const column = toSnake(key);
        if (allowedColumns.includes(column) && doc[key] !== undefined) {
            row[column] = doc[key];
        }
    }
    return row;
}

export function paginate(totalItems: number, page: number, pageSize: number) {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
        page,
        page_size: pageSize,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
        total_items: totalItems,
    };
}

export function pageRange(page: number, pageSize: number): [number, number] {
    const from = (page - 1) * pageSize;
    return [from, from + pageSize - 1];
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
