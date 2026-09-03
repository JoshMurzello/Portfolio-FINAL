# Location gallery interaction update — 2026-09-03

## Scope

Only the four photo-journal modals on `Creatives.html` change: Japan, Vietnam, Coast & mountains, and Austin. The 21 selected photos, their ordering, captions, source assets, and journal covers are unchanged. India and the proposed vlog/social additions remain on hold. Existing project case-study modals and the page's creative archive are unchanged.

## Interaction

- Horizontal gallery with a flat, fully framed center photograph and neighboring photographs receding as angled 3D planes.
- Pointer drag/swipe, intentional horizontal trackpad gestures, previous/next buttons, and direct photo selectors. Clicking a neighboring photograph brings it to the center; the centered photograph and full-size link open the existing image in a new tab.
- Left/Right and Home/End keyboard navigation, caption and position announcements, a visible keyboard focus indicator, modal focus containment, Escape-to-close, and focus return to the original destination card.
- Drag detection suppresses accidental image-link navigation. Vertical scrolling and pinch/zoom gestures are not captured as carousel navigation. Navigation stops at the first and last photo.
- Reduced-motion CSS removes rotation/depth transitions and shows only the selected photo. There is no autoplay or continuous animation loop.
- Responsive sizing, including a shorter mobile stage for Austin's landscape-only stills. Off-center photos are excluded from keyboard focus and assistive-technology reading order.
- Images are assigned sources as they approach the selected photo. Closing the modal clears the gallery and aborts its event handlers. No external library or new media download was added to the repository.

## Files

- `location-gallery.js` and `location-gallery.css`: scoped component and presentation.
- `creatives.js`: photo-journal-only integration, cleanup, safe backdrop dismissal, and focus handling.
- `Creatives.html`: versioned component loading.
- `scripts/test-location-gallery.mjs`: nine interaction/integration regression tests.
- `scripts/validate-site.mjs`: includes the new component in reference checking.

## Verification

- 37 checks pass across location-gallery, media-update, orbit, robot-media, and home-motion suites.
- Site integrity passes for all 27 HTML files; JavaScript syntax and Git whitespace checks pass.
- Browser review at desktop size and 390 × 844: full-frame portrait/landscape rendering, all 21 photos loaded across all four albums, no horizontal modal overflow, real pointer drag, arrow controls, keyboard boundaries, direct selection, close/reopen, focus restoration, and forward/reverse modal Tab containment.
- The existing Portrait Language modal still renders its three images without the new carousel. Browser error/warning logs were empty during the review.
- Reduced-motion behavior is verified by stylesheet/integration assertions, not a system-preference change on the user's computer.
