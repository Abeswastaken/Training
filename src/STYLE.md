# Drawing style for all trainers

Keep every trainer looking like one set. The Engineering Mindset diagrams are the visual reference: clean, lightly shaded parts, color-coded fluids, labels in small caps.

## Canvas
- Main drawing is an 800 × 470 SVG (`viewBox="0 0 800 470"`). Keep text inside y ≤ 468.
- Room or zone boundaries: thin tan outline (`#a89a85`) with a faint fill. Roof and floor lines: `#8a7f70`, 4 px.
- Every clickable part is a `<g class="part" data-p="key">` with one `.hl` shape inside for the hover outline.

## Shared gradients and helpers (rz.js)
- Metal: `zSteel` (vertical), `zSteelH` (horizontal), cabinets `zCab`, inside of cabinets `zInside`, brass fittings `zBrass`, copper `zCuV`/`zCuH`, brick `zBrick`, flames `zFlame`, LCD screens `zLcd`, coil fins `zFins`/`zFinsH`, grilles `zGrille`.
- Depth: `filter="url(#zShadow)"` on a free-standing part, plus `zShade(cx, cy, rx)` for a floor shadow.
- Gauges: `zGauge(cx, cy, r, ringColor)` with a red needle line rotated −135° to +135°. Ring blue (`#2f6fd6`) for low side or suction, red (`#c0392b`) for high side.
- Readouts: `class="val"` (mono, 10–13 px). Small labels: `class="lblS"`. Chart and note text: `class="cht"`; to color it, use `style="fill:…"` (the class's CSS fill beats a `fill=` attribute).

## Fluid colors
| Fluid | Color |
|---|---|
| Refrigerant hot gas | red |
| Refrigerant high-pressure liquid | orange |
| Refrigerant low-pressure liquid + flash gas | blue |
| Refrigerant cool suction vapor | light blue |
| Hot water supply / return (hydronic) | red / darker red (controls), pink-purple striped in the boiler cutaway |
| Chilled water supply / return | `#2f6fd6` blue / `#7a5cd0` purple |
| Condenser water to chiller / to tower | `#5a9bd4` light blue / `#d9824a` orange |
| Gas piping | black iron gray (`zSteel`) |
| Flue gas | `#e0662a` dashed |
| Air | dashed arrows, `--air-cool` / `--air-warm` |
| Control air (pneumatic) | teal |

Flow is shown with a white dashed line on top of the pipe (`stroke-dasharray="4 10"`) whose offset moves with the flow rate. It stops when the flow stops.

## Text and numbers
- Every number shown in a drawing has a unit. Pressures: psig, in. w.c., Pa, in. Hg. Temperatures: °F.
- Panel screens (chiller, analyzer, DDC) use dark backgrounds with green mono text; alarms switch to amber or red.
- Plain language in part cards: what it is, what it does, normal values, and how it fails.

## Gotchas
- A gradient stroke on a perfectly straight horizontal or vertical line does not render (its box has zero width or height). `flatStrokes()` in app.js swaps in a solid color for zSteel, zSteelH, zCuH, zCuV and zBrass. For any other gradient, use a solid color on straight lines.
- `.cht` labels on light metal need `class="cht onm"` so they stay dark in dark mode. A `fill` attribute on a `.cht` label wins over the default muted color.
