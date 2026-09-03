# T7 portfolio media update — 2026-09-03

## Review map

| Page | Added or changed |
| --- | --- |
| `Creatives.html#photo-journals` | New photo-journal section before the existing scroll archive: Japan (8 photos), Vietnam (6), Coast & mountains (4), Austin (3 edit stills). Responsive album covers, full-frame modal images, captions, full-size links, keyboard close/focus restoration, and a sticky close control. |
| `camera-storage.html` | Replaced the generic camera hero with the real organizer; added a CAD frame, three-step build documentation, a 5.3-second print timelapse, and an 8-second camera fit-check excerpt. Replaced the outdated “next revision gets photographed” status. |
| `pomodoro.html` | Three real Focus Dial photos: desk view, top-face packaging, and illuminated display. Replaced the hero/electronics artifact placeholders, removed the unfulfilled CAD placeholder, and put the physical prototype before the existing YouTube video. |
| `cyclodial-actuator.html` | Added a 12-second silent assembly walkthrough beside the existing mechanical-architecture documentation. It is explicitly not presented as a measured torque/backlash test. |
| `3Dprint.html` | Added linked Camera Storage and Focus Dial cards, making those existing case studies discoverable from the engineering product-series page. |
| `Engineering.html` | The existing 3D Printing Product Series carousel card now uses the real camera-organizer photo and updated media proof text. Project count/order and the other engineering projects are unchanged. |

## Inventory and boundaries

The mounted `/Volumes/T7` was inventoried read-only on September 3, 2026 at 17:24 UTC: 11,366 visible files, 1,741,402,320,056 bytes. This is a filename/size inventory, **not a claim that all footage was watched**. Curation used contact sheets, selected full-frame images, and sampled video frames from the relevant folders.

- Original photos, camera footage, Resolve archives, and folder organization were not moved, renamed, or modified. No move log is needed because there were no moves.
- Site assets are new derivatives under `images/travel`, `images/builds`, and `videos/optimized`.
- Photos use WebP at a maximum 1800-pixel long edge, plus 640-pixel travel derivatives for responsive loading. Original framing and existing color are preserved; EXIF/GPS metadata is not included.
- Three new silent H.264, 1280×720, fast-start MP4 clips total 2,486,381 bytes. They have posters, captions, native controls, `playsinline`, and `preload="none"`; none autoplays.
- Existing robot case studies already have demos, photos, and presentation diagrams, so those were retained rather than duplicated. Employer documents, course handouts, transcripts, resumes, raw personal-backup collections, and unverified performance claims were not added.
- The inventory skipped hidden/system entries and symlinks. One malformed filename in a separate SD-card backup could not be statted. Later sampling also found two unreadable JPEGs in that backup. None is part of the selected media.
- **India remains unresolved:** no confidently identified India travel set was located in the named travel folder or sampled dated backups. No India label or empty placeholder was fabricated. The folder/location needs confirmation before an India album can be added.

## Photo source map

All source paths below are relative to `/Volumes/T7`. Output names are under `images/travel/`, with `.webp` and `-640.webp` versions.

Japan and Vietnam source directory: `Travels 2026/Japan & Vietnam May 2026 /Photos/` (the parent folder has a trailing space).

| Source filename | Output stem |
| --- | --- |
| DSC00479.JPG | japan-torii |
| DSC09936.JPG | japan-bridge |
| DSC09951.JPG | japan-waterfall |
| DSC09996.JPG | japan-mountain-lake |
| DSC00071.JPG | japan-flowers |
| DSC00403.JPG | japan-golden-pavilion |
| DSC09986.JPG | japan-tokyo-river |
| DSC00535.JPG | japan-night-street |
| DSC00724.JPG | vietnam-coast |
| DSC00589.JPG | vietnam-bookshop |
| DSC00579.JPG | vietnam-cafe |
| DSC00679.JPG | vietnam-clocktower |
| DSC00727.JPG | vietnam-promenade |
| DSC00771.JPG | vietnam-cable-cars |

| Source path | Output stem |
| --- | --- |
| Backups/2025/Oct 2025/Pictures/DSC07109.JPG | california-coast |
| Backups/2025/Oct 2025/Pictures/DSC07141.JPG | california-waterfront |
| Backups/2025/Dec 2025/Photography/DSC08283.JPG | california-lake |
| Backups/2025/Dec 2025/Photography/DSC08309.JPG | california-mountains |
| Austin July 2025/Photos/Editing/Still 2025-07-22 174143_1.10.1.png | austin-sunset |
| Austin July 2025/Photos/Editing/Still 2025-07-22 174143_1.2.1.png | austin-street |
| Austin July 2025/Photos/Editing/Still 2025-07-22 174143_1.7.1.png | austin-skyline |

The Austin entries are existing edit stills, not newly claimed camera photographs; their letterboxing is retained. The Coast & mountains selection groups coastal/city/mountain scenes in the dated archive thematically, without claiming an exact itinerary or which side of a state border a lake photo was taken on. Japan/Vietnam country grouping uses the trip folder and visible scene sequence; captions avoid uncertain city-level labels.

## Engineering source map

| Existing folder / role | Selected source | Published derivative |
| --- | --- | --- |
| `Youtube 2025/3d print camera storage/thumbnail` — product photos | `DSC07008.JPG` | `images/builds/camera-storage-overview.webp` |
| `Youtube 2025/3d print camera storage/Finals` — inspected reference export | `Final 3!.mov`, frame at 02:20 | `images/builds/camera-storage-cad.webp` |
| Same reference export | `Final 3!.mov`, 05:06–05:14 | `videos/optimized/camera-storage-fit.mp4` and poster |
| `Youtube 2025/3d print camera storage/timelapses/Camera Storage Timelapse.dra/MediaFiles` — original still sequence | 381 JPEGs, every third frame retained (127 frames at 24 fps) | `videos/optimized/camera-storage-print.mp4` and final-frame poster |
| `Youtube 2025/Pomodoro/PIctures` — product photos | `DSC08335.JPG`, `DSC08326.JPG` | `images/builds/focus-dial-desk.webp`, `focus-dial-display.webp` |
| `Backups/2025/Dec 2025/Photography` — matching product photo | `DSC08339.JPG` | `images/builds/focus-dial-top.webp` |
| `Youtube 2026/Cyclodial Actuator/Videos` — camera source, assembly demonstration | `C3236.MP4`, 00:02–00:14 | `videos/optimized/cycloidal-assembly.mp4` and poster |

`Final 3!.mov` was selected because the inspected content shows the matching organizer and its CAD/fit workflow. It is used as a reference export; this update does not declare it the definitive final or replace the other exports. The actuator clip is a hand-held assembly walkthrough, not a completed promotional export. No music or dialogue from either source was republished.

## Verification

- `node --test scripts/test-media-update.mjs scripts/test-orbit.mjs scripts/test-robot-media.mjs scripts/test-home-motion.mjs` — 28 passing checks.
- `npm run check:site` — all 27 current HTML files and referenced assets pass integrity checks.
- `git diff --check` — clean.
- Browser review: desktop and 390-pixel mobile layout, all four albums, full-frame image rendering, Escape/focus return, sticky close after scrolling, and all three local video clips reaching playable state with their expected durations.
- Existing YouTube embeds were retained. Local playback verification applies to the three new MP4 clips, not third-party YouTube availability.
- The user's pre-existing untracked preview pages, notes, and photos are excluded from this update.
