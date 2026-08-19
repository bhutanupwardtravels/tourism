/**
 * The shared look for a form's primary submit control.
 *
 * The three enquiry forms — /enquire, the packaged-tour request, and the
 * custom itinerary builder — had drifted into three different buttons: two
 * padding scales, three type sizes (one of them overridden again by a nested
 * span), two tracking values, and a sliding overlay on two of the three. They
 * are the same control doing the same job, so the job is defined once.
 *
 * Black at rest, amber on hover.
 */
export const SUBMIT_BUTTON =
    "group relative w-full overflow-hidden bg-black py-6 text-white text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-black";

/**
 * The amber wipe that fills the button from the left on hover — the same
 * treatment the site's other primary buttons use (the footer, the login form,
 * the reservation card, the page-bottom call to action).
 *
 * Render it as the button's last child. It relies on the button's own
 * `group` / `relative` / `overflow-hidden`, all of which SUBMIT_BUTTON sets,
 * and it sits behind the label because the label carries `relative z-10`.
 */
export const SUBMIT_SWEEP =
    "absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-500 transition-transform duration-700 ease-in-out";
