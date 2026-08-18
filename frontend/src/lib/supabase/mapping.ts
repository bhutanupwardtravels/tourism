// Shallow key mapping between Postgres snake_case columns and the camelCase
// document shapes the app has used since the MongoDB days. Only top-level
// keys are converted — jsonb payloads (tour days, galleries, about content)
// keep their original camelCase keys.

const toSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (key: string) => key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** A Postgres row as Supabase hands it back: column names to column values. */
export type Row = Record<string, unknown>;

/** An app-side document: camelCase keys, plus the `id`/`_id` pair. */
export type Doc = Record<string, unknown>;

// Postgres row -> app document. Adds `id` and legacy `_id` (both the uuid
// string) so existing components keep working.
//
// The caller names the document type it expects (`rowToDoc<Tour>(row)`); the
// shape cannot be checked here because the column set is only known at the
// call site.
export function rowToDoc<T = Doc>(row: Row | null | undefined): T | null {
    if (!row) return null;
    const doc: Doc = {};
    for (const key of Object.keys(row)) {
        doc[toCamel(key)] = row[key];
    }
    doc.id = row.id;
    doc._id = row.id;
    return doc as T;
}

// The list form. Supabase never yields null entries inside a result set, so
// unlike `rowToDoc` this stays free of nulls and can feed a typed array
// directly.
export function rowsToDocs<T = Doc>(rows: Row[] | null | undefined): T[] {
    return (rows ?? []).map((row) => rowToDoc<T>(row) as T);
}

// App document -> Postgres row, restricted to the given columns so stray
// form fields (legacy/computed keys) never hit the database.
export function docToRow(doc: object | null | undefined, allowedColumns: string[]): Row {
    const row: Row = {};
    const source = (doc ?? {}) as Doc;
    for (const key of Object.keys(source)) {
        const column = toSnake(key);
        if (allowedColumns.includes(column) && source[key] !== undefined) {
            row[column] = source[key];
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
