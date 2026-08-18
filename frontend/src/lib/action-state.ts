/**
 * The value every admin form action returns, and the `prevState` React hands
 * back on the next submit. `useActionState` types the two as the same thing,
 * so keeping one shared alias here stops the forms and their actions from
 * drifting apart.
 */
export type ActionState = {
  success: boolean;
  message: string;
};

/** The state a form starts in, before anything has been submitted. */
export const initialActionState: ActionState = { success: false, message: "" };
