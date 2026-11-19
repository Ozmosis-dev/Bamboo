/** Temporary site switches.
 *
 * MENU_HIDDEN: while true, /menu returns 404 on both sites and every link to
 * it (nav, home CTAs, course index, sitemap, JSON-LD hasMenu, legacy
 * redirects) is suppressed. Flip to false and redeploy to restore the page
 * exactly as it was — no menu data is touched.
 */
export const MENU_HIDDEN = false;

/** PRICES_HIDDEN: while true, every price on the public site is suppressed —
 * menu items lose their dollar amounts (and any price_note that contains a
 * "$", like "glass / $64 bottle"; portion notes such as "2 pc" stay), the
 * homepage highlights drop theirs, JSON-LD omits offers, and the printed-menu
 * PDF buttons (which show prices) are hidden. Flip to false and redeploy to
 * restore — no menu data is touched, and the admin CMS always shows prices. */
export const PRICES_HIDDEN = true;

/** COMING_SOON: while true, the Chattanooga homepage opens with the
 * full-screen "coming soon" panel (construction note, open date, 3D room
 * preview) that scrolls away into the regular hero. Flip to false around
 * opening day to remove it — nothing else on the page changes. */
export const COMING_SOON = true;
