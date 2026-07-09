import { getHotelById, updateHotel } from "../../actions";
import { HotelForm } from "../../components/hotel-form";
import { notFound } from "next/navigation";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hotel = await getHotelById(id);

  if (!hotel) {
    notFound();
  }

  const updateHotelWithId = updateHotel.bind(null, id, null);

  return (
    <HotelForm
      title={`Edit Hotel: ${hotel.name}`}
      initialData={hotel}
      action={updateHotelWithId}
    />
  );
}
