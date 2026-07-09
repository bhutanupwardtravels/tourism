
import { createUserAction } from "../actions";
import { UserForm } from "../components/user-form";

export default function CreateUserPage() {
    return <UserForm title="Create New User" action={createUserAction} />;
}
