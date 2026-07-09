"use server";

import * as tourDb from "@/lib/data/tours";
import * as destinationDb from "@/lib/data/destinations";
import * as experienceDb from "@/lib/data/experiences";
import { tourRequestDb } from "@/lib/data/tour-requests";
import { Tour } from "../tours/schema";
import { Destination } from "../destinations/schema";
import { Experience } from "../experiences/schema";

import * as hotelDb from "@/lib/data/hotels";
import { Hotel } from "../../admin/hotels/schema";
import { Cost } from "../../admin/settings/schema";
import * as settingsDb from "@/lib/data/settings";

export interface PlanMyTripData {
    packages: Tour[];
    destinations: Destination[];
    allDestinations: Destination[];
    experiences: Experience[];
    hotels: Hotel[];
    costs: Cost[];
}

export async function getPlanMyTripData(): Promise<PlanMyTripData> {
    try {
        const [allTours, entryPointDestinations, allDestinations, allExperiences, allHotels, allCosts] = await Promise.all([
            tourDb.getAllTours(),
            destinationDb.getEntryPointDestinations(),
            destinationDb.getAllDestinations(),
            experienceDb.getAllExperiences(),
            hotelDb.getAllHotels(),
            settingsDb.getAllCosts()
        ]);

        // Filter packages if needed (e.g. only featured or specific category)
        // For now we return the top 4 featured or general tours as "packages"
        const packages = (allTours.filter((t: any) => t.featured).slice(0, 4)) as Tour[];
        // Fallback if no featured tours
        const finalPackages = packages.length > 0 ? packages : (allTours.slice(0, 4) as Tour[]);

        return {
            packages: finalPackages,
            destinations: entryPointDestinations as Destination[],
            allDestinations: allDestinations as Destination[],
            experiences: allExperiences as Experience[],
            hotels: allHotels as Hotel[],
            costs: allCosts as Cost[]
        };

    } catch (error) {
        console.error("Error fetching Plan My Trip data:", error);
        return {
            packages: [],
            destinations: [],
            allDestinations: [],
            experiences: [],
            hotels: [],
            costs: []
        };
    }
}

import { sendMail } from "@/lib/mail";
import { emailTemplates } from "@/lib/email/templates";

export async function submitTourRequest(data: any) {
    try {
        const result = await tourRequestDb.createTourRequest(data);

        // Send email to User
        const userMail = sendMail({
            to: data.email,
            subject: "Your Tour Request - Black Tomato Bhutan",
            html: emailTemplates.userConfirmation(result),
        });

        // Send email to Operator
        const operatorMail = sendMail({
            to: process.env.OPERATOR_EMAIL || "info@blacktomato.com",
            subject: "New Tour Request Notification",
            html: emailTemplates.operatorNotification(result),
        });

        // Fire and forget or wait? For robustness, we might want to wait, 
        // but we don't want to block the user UI if mail is slow.
        // However, Promise.all ensures both are sent.
        Promise.all([userMail, operatorMail]).catch(err =>
            console.error("Delayed error in sending emails:", err)
        );

        return { success: true };
    } catch (error) {
        console.error("Failed to submit tour request:", error);
        return { success: false, error: "Submission failed" };
    }
}
