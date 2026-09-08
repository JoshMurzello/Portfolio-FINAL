# Approved Engineering selection — September 8, 2026

This records Josh's selected presentation following the project inventory audit.

Ordering update: Cycloidal Actuator, SpaceX, and Mechatronics Gauntlet Robot lead, in that order. Remaining entries sort by recorded year descending, retaining their relative order for ties. Undated ME 2110, Electric Skateboard, and MARS Research follow dated work; Stacy stays last. Do not infer project dates from file modification or publication dates.

- Live carousel data: `engineering-projects.js`; renderer: `engineering-orbit.js`.
- 15 carousel entries: Brain Controlled Interface, Vision Tracking Robot, Mechatronics Gauntlet Robot, ME 2110 Barbenheimer Bot, Cycloidal Actuator, Focus Dial / Pomodoro Device, 3D Printing Product Series, Electric Skateboard, MARS Research, SpaceX, Tesla, LG Electronics, Price Industries, STL Animator Tool, and Stacy.
- Focus Dial is a standalone entry linked to `pomodoro.html`, removed from the printed-product collection.
- MARS Research is a standalone research entry included in the Projects filter. Its page uses the existing introduction and lab photograph. Detailed methods, individual contributions, dates, and measured findings still need supplied documentation.
- `3Dprint.html` groups Camera Storage, Plant Shelf, Dink Rack, Toothbrush Holder, Spiral Storage Container, Guitar Holder, and Phone Shower Holder. The first three link to their existing individual pages.
- STL Downloads is outside the carousel, in a compact link below it, pointing to `stl-drops.html`. The product-series page also links to it.
- No STL/STEP/3MF/F3D/ZIP release files were present in this repository during implementation. The downloads page explicitly says there are no released files yet, links to the build pages and Josh's existing MakerWorld profile, and does not load the old simulated email-unlock script. The old drops JavaScript/CSS remain in the repository but are not used by the new page.
- Add future approved file packages and their actual download links on `stl-drops.html`, with matching print/assembly notes and license terms supplied by Josh. Do not label a case-study link as a file download.

The older `engineering.js` inventory and untracked preview/draft files are not loaded by the live Engineering page. They must not replace the approved selection during future layout changes. The static “Browse all engineering work” directory should continue to match the live data; the existing orbit test checks that alignment.

Validation: 15 relevant orbit/media tests passed, the site integrity check passed for all 27 local HTML files, and desktop/mobile browser checks covered Focus Dial navigation, grouped product destinations, the downloads link/page, and the MARS page. Existing photos and media were reused; the MARS test-setup image was visually inspected before reuse.
