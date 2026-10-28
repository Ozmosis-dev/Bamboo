/** Temporary site switches.
 *
 * MENU_HIDDEN: while true, /menu returns 404 on both sites and every link to
 * it (nav, home CTAs, course index, sitemap, JSON-LD hasMenu, legacy
 * redirects) is suppressed. Flip to false and redeploy to restore the page
 * exactly as it was — no menu data is touched.
 */
export const MENU_HIDDEN = true;
