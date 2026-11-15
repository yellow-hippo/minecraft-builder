# Chicago Builder — Willis Tower v0.2

A static, iPad-friendly Minecraft Bedrock companion guide generated from the user-provided Willis Tower `.mcstructure` file. No server, account, database, or Minecraft modification required.

## Features
- Interactive 3D model, horizontal layer map, material counts, block inspection
- 178 layers, 28×28 footprint, 24,443 non-air blocks
- Automatic connected-material grouping, capped at 24 blocks per step
- Gold highlights identify the next group; tap the map to jump to a group
- Previous/next group controls, completed-group checklist, progress saved in the browser's localStorage
- Layer CSV download and optional full-building preview

## GitHub Pages deployment
1. Create a GitHub repository, e.g. `chicago-builder`.
2. Upload `index.html` to the repository root and commit. (`willis.json` is the separate source data; the HTML already embeds it.)
3. Go to Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.
4. Open the Pages URL on an iPad and add it to your Home Screen if desired.

Alternatively, drag the folder into Netlify Drop for static hosting.

## Important notes
- The 3D viewer downloads Three.js from esm.sh and therefore requires internet access; the blueprint and checklist still work if the 3D library cannot load.
- Progress is stored on each device/browser, not synced to GitHub or across devices.
- Groups are algorithmically generated from connected, same-material blocks; they are not guaranteed to represent a safe or physically supported building order. Use the 2D map to confirm placement, especially for doors, ladders, slabs, and other directional blocks.
- The 3D model uses simplified cubes, not authentic Minecraft textures or exact block shapes.
- GitHub repository creation and publishing are not performed by this ZIP.
