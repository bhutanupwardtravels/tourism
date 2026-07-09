
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/data/users";
import { updateUserAction } from "../../actions";
import { UserForm } from "../../components/user-form";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditUserPage({ params }: PageProps) {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <UserForm
            title="Edit User"
            initialData={user}
            action={updateUserAction.bind(null, id)}
        />
    );
}
