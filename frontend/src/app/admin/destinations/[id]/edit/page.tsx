"use client";

import * as React from "react";
import { use } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getDestinationById, updateDestination } from "../../actions";
import { DestinationForm } from "../../components/destination-form";
import { Destination } from "../../schema";

export default function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [destination, setDestination] = React.useState<Destination | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDestinationById(id);
        if (data) {
          setDestination(data as Destination);
        } else {
          toast.error("Destination not found");
        }
      } catch (error) {
        toast.error("Failed to fetch destination data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex-1 max-w-7xl mx-auto space-y-4 p-8 pt-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Destination not found</h2>
          <p className="text-gray-500 mt-2">The destination you are trying to edit does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <DestinationForm
      initialData={destination}
      action={updateDestination}
      title="Edit Destination"
    />
  );
}
