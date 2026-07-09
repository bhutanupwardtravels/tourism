import { HotelForm } from "../components/hotel-form";
import { createHotel } from "../actions";

export default function CreateHotelPage() {
  const createHotelWithPrevState = createHotel.bind(null, null);

  return (
    <HotelForm
      title="Create New Hotel"
      action={createHotelWithPrevState}
    />
  );
}
