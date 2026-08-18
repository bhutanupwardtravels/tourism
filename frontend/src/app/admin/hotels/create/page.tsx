import { HotelForm } from "../components/hotel-form";
import { createHotel } from "../actions";
import { initialActionState } from "@/lib/action-state";

export default function CreateHotelPage() {
  const createHotelWithPrevState = createHotel.bind(null, initialActionState);

  return (
    <HotelForm
      title="Create New Hotel"
      action={createHotelWithPrevState}
    />
  );
}
