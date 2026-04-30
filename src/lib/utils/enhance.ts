import type { SubmitFunction } from '@sveltejs/kit';

/**
 * enhance handler that does not call form.reset() after a successful POST.
 *
 * SvelteKit's default enhance behavior resets the form on success, which
 * snaps inputs back to their HTML defaultValue / defaultChecked attributes.
 * Svelte writes value={...} / checked={...} as DOM properties, so a reset
 * visibly clears textareas and checkboxes before the re-fetched data has a
 * chance to re-render. This handler skips the reset and just re-runs the
 * load, which is what every admin form on this app actually wants.
 */
export const enhanceNoReset: SubmitFunction = () => {
  return async ({ update }) => {
    await update({ reset: false });
  };
};
