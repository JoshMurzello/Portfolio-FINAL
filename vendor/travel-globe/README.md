# Travel globe dependencies and location sourcing

- `globe.gl-2.45.0.min.js`: Globe.GL 2.45.0, MIT. Vendored from https://cdn.jsdelivr.net/npm/globe.gl@2.45.0/dist/globe.gl.min.js. License in LICENSE-globe.gl. Includes bundled rendering dependencies and their retained license comments.
- `earth-blue-marble.jpg`: Earth texture distributed with three-globe 2.44.0's examples, downloaded from https://cdn.jsdelivr.net/npm/three-globe@2.44.0/example/img/earth-blue-marble.jpg. Blue Marble Earth imagery is from NASA; source project https://github.com/vasturiano/three-globe (MIT).

## Integration

Load `travel-globe.css`, create `<section id="travel-globe-section" class="wrap section"></section>`, then load `travel-albums.js` and `travel-globe.js`, in that order. Script mounts once at DOM ready and lazy-loads the local renderer only when the section nears the viewport. It derives media paths relative to its own script URL.

Six city pins: Delhi, Agra, Jaipur, Tokyo, Austin, and San Francisco. India mapping uses explicit existing captions corroborated by `docs/india-media-update.md`. Tokyo uses only the Skytree river photograph whose existing alt identifies Tokyo. San Francisco uses only the Ferry Building photograph explicitly identified in the existing alt. Austin uses its existing city album. Coordinates identify cities, not exact camera positions. Unconfirmed city assignments are intentionally not invented: all Japan, Vietnam, India, Coast & mountains, and Austin photographs remain accessible in whole-trip collections.

The film uses the verified Delhi final (native controls, audio, no autoplay, preload none). Switching collections or photographs pauses prior video; leaving the section/document pauses playback. Offscreen and background globe rendering pauses. Reduced-motion preference disables introductory/camera transitions. Location controls and albums remain available if WebGL or a globe asset fails.

No social upload URLs are invented. Adding those later requires verified per-media post URLs.
