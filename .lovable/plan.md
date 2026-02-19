
## Change Default Map Centre to New Braunfels, TX

### What's changing

A single focused edit to `src/pages/Map.tsx` — replacing the hardcoded New York coordinates with New Braunfels, TX coordinates, and updating the initial zoom level from 13 to 10 to show the ~20-mile radius view as planned.

### Coordinates

New Braunfels, TX 78130:
- Latitude: **29.7030**
- Longitude: **-98.1245**

### Files to edit

**`src/pages/Map.tsx` — two changes:**

1. **Initial map centre** (line 146): Change `center: [40.758, -73.975], zoom: 13` → `center: [29.7030, -98.1245], zoom: 10`

2. **The curated PARKS data** (lines 50–131): The existing 10 parks are all plotted in New York City. Since the default view is now New Braunfels, TX, they will not be visible at zoom 10. These parks should be replaced with curated parks around New Braunfels / the greater San Antonio / Guadalupe River area so the map is immediately useful rather than showing an empty view.

   New parks will include real and representative locations in the New Braunfels area such as:
   - Landa Park (iconic NB park with splash area, train, playground)
   - Cypress Bend Park (Guadalupe River access)
   - Fischer Park
   - Wheatfield Park
   - Community Park on Common St
   - + surrounding area parks (San Marcos, Seguin, Kyle/Buda, etc.)

### Technical details

No database migration needed — this is purely a frontend coordinate and data update.

**Summary of edits:**

| What | Old value | New value |
|------|-----------|-----------|
| Default map centre | `[40.758, -73.975]` | `[29.7030, -98.1245]` |
| Default zoom | `13` | `10` |
| Park dataset | 10 NYC parks | 10 New Braunfels / Hill Country area parks |

The geolocation-on-mount behaviour (fly to real user location when permission is granted) remains part of the full plan — this change only addresses the default fallback centre as requested. The "Me" button and all other map functionality remain unchanged.
