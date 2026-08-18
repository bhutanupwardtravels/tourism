"use client";

import { createDestination } from "../actions";
import { DestinationForm } from "../components/destination-form";
import type { ActionState } from "@/lib/action-state";

export default function CreateDestinationPage() {
  const wrappedAction = async (_slug: string, prevState: ActionState, formData: FormData) => {
    return createDestination(prevState, formData);
  };

  return (
    <DestinationForm
      action={wrappedAction}
      title="Create New Destination"
    />
  );
}
