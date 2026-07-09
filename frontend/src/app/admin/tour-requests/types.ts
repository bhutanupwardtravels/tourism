export enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    ARCHIVED = "archived",
}

export interface TourRequest {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    destination?: string;
    travelDate: string;
    travelers: string;
    message: string;
    tourId?: string; // Optional: If they selected a specific package
    tourName?: string; // Optional: Denormalized name for easier display
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
    customItinerary?: DayItinerary[];
}

export interface DayItinerary {
    day: number;
    title?: string;
    items: ItineraryItem[];
}

export type ItineraryItemType = "experience" | "travel";

export interface ItineraryItem {
    id: string; // Unique ID for drag/drop
    type: ItineraryItemType;
    order: number;
    experienceId?: string;
    experience?: {
        title: string;
        duration: string;
        image?: string;
    }; // Denormalized for display
    destinationId?: string; // MongoDB ObjectId of destination (deprecated - use destinationFromId/ToId)
    destination?: {
        name: string;
        image?: string;
    }; // Denormalized for display
    destinationFromId?: string; // MongoDB ObjectId of "from" destination
    destinationToId?: string; // MongoDB ObjectId of "to" destination
    hotelId?: string; // MongoDB ObjectId of hotel
    hotel?: {
        name: string;
        image?: string;
    }; // Denormalized for display
    travel?: {
        from: string;
        to: string;
        duration: number; // in hours
    };
}

