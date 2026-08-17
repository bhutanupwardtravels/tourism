/** The subset of a campaign that is safe (and useful) to ship to the browser. */
export interface PublicCampaign {
    id: string;
    discountPercent: number;
    bannerHeadline: string;
    bannerBody: string;
    bannerCtaLabel: string;
    bannerStartsAt?: string | null;
    bannerEndsAt?: string | null;
    couponValidDays: number;
    couponEligibleAfterDays: number;
}
