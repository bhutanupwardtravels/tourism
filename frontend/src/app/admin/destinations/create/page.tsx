"use client";

import { createDestination } from "../actions";
import { DestinationForm } from "../components/destination-form";

export default function CreateDestinationPage() {
  const wrappedAction = async (_slug: string, prevState: any, formData: FormData) => {
    return createDestination(prevState, formData);
  };

  return (
    <DestinationForm
      action={wrappedAction}
      title="Create New Destination"
    />
  );
}
