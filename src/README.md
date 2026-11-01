# Trainer sources

Everything the live site is built from. Edit here, then from this folder run `python3 build_all.py`.

- `dist/` (not committed): artifact pages `<name>-trainer.html` (title ends in FB-Enable) and standalone `full*.html` for tests.
- Tests: `cd dist && node ../tests/<test>.js` (Playwright). Each prints `ERR []` when the page threw nothing.
- `build_site.py` writes the public folders at the repo root (crumb nav, FB-Enable stripped, Google Form feedback).
- `boiler/`: the boiler page is `bt.orig.html` patched by `patch.py` (+ `patch_two.py`), with drawings in `boiler_rz.js`.
- Shared drawing library: `rz.js` (gradients, parts), `rz_cards.js` (part-card pictures).
- `oneoff/`: edit scripts that were already applied. Do not rerun.
