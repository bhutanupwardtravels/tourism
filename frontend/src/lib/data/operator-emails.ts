import { supabaseAdmin } from "../supabase/admin";

const TABLE = "site_operator_emails";

export interface OperatorEmailsContent {
    emails: string[];
    updatedAt?: string;
}

function envOperatorEmails(): string[] {
    return (process.env.OPERATOR_EMAIL || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
}

export async function getOperatorEmailsContent(): Promise<OperatorEmailsContent> {
    const supabase = supabaseAdmin();
    const { data: row } = await supabase
        .from(TABLE)
        .select("content, updated_at")
        .eq("id", 1)
        .maybeSingle();

    if (!row) return { emails: envOperatorEmails() };

    const doc = row.content as Partial<OperatorEmailsContent>;
    const emails = Array.isArray(doc.emails) ? doc.emails.filter(Boolean) : [];
    return {
        emails: emails.length > 0 ? emails : envOperatorEmails(),
        updatedAt: row.updated_at,
    };
}

export async function updateOperatorEmailsContent(data: { emails: string[] }) {
    const supabase = supabaseAdmin();
    const emails = data.emails.map((e) => e.trim()).filter(Boolean);

    const { error } = await supabase.from(TABLE).upsert({
        id: 1,
        content: { emails },
        updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    return { acknowledged: true };
}

// Resolves the operator recipient list used when sending mail: the
// admin-managed list if set, falling back to OPERATOR_EMAIL, then a
// hardcoded default so a submission never goes unnoticed.
export async function getOperatorEmails(): Promise<string[]> {
    const { emails } = await getOperatorEmailsContent();
    return emails.length > 0 ? emails : ["info@bhutanupwardtravels.com"];
}
