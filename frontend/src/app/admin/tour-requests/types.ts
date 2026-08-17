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
    country?: string; // ISO2 country code, e.g. "IN" — captured via the bespoke planner
    destination?: string;
    travelDate: string;
    travelers: string;
    message: string;
    // Bespoke builder fields — only present for custom itinerary submissions.
    adults?: number;
    children_6_12?: number;
    children_under_6?: number;
    arrivalDate?: string;
    departureDate?: string;
    tourId?: string; // Optional: If they selected a specific package
    tourName?: string; // Optional: Denormalized name for easier display
    status: RequestStatus;
    // Quote snapshot, always recomputed server-side at submit — the client's
    // figures are never trusted. Only the bespoke builder produces a subtotal
    // and total; the package and general-enquiry flows have no computed cost,
    // so they store the discount percent alone for the operator to apply.
    quoteSubtotal?: number | null;
    quoteTotal?: number | null;
    quoteCurrency?: string | null;
    discountKind?: "none" | "loyalty" | "coupon" | null;
    discountPercent?: number | null;
    discountAmount?: number | null;
    couponCode?: string | null;
    priorTripCount?: number | null;
    createdAt: string;
    updatedAt: string;
    readAt?: string | null; // null/undefined => unread (notification bell)
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

