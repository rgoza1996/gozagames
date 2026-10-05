# Screenshot rights audit — October 5, 2026

## Scope and result

The published evidence supports displaying the specific Valyria Tear title-screen image selected here, subject to the conditions implemented below. This is a source-based permission assessment, not a legal opinion or a blanket clearance for every screenshot, a port, a reimplementation, or story reuse. No fair-use exception is needed for this implementation.

## Valyria Tear — selected title screen permitted with GPL conditions

Primary evidence:

- [Upstream README](https://github.com/ValyriaTear/ValyriaTear): distinguishes code from asset licenses and separately reserves reuse of the story concept.
- [Original 0.6.0 asset manifest](https://raw.githubusercontent.com/ValyriaTear/ValyriaTear/0.6.0/LICENSES): lists the title logo and clouds, mist, fog, shadows, and flare as GPLv2+, the background as GPLv2 (JAP), and crystal/satellites as GPLv2 (Len with Bertram). It has path spelling errors (`backgrops`, `cloudymist`) which are reconciled against the actual [title-scene script](https://github.com/ValyriaTear/ValyriaTear/blob/0.6.0/dat/config/boot.lua). The original black-sleet menu cursor is GPLv2+ (Allacrost); fonts have their own retained licenses.
- [Current upstream manifest](https://raw.githubusercontent.com/ValyriaTear/ValyriaTear/master/LICENSES.txt): confirms the title-scene licensing under renamed `data/boot_menu` paths.
- [GPL version 2](https://github.com/ValyriaTear/ValyriaTear/blob/0.6.0/COPYING.GPL-2): permits copying/distribution with notices, licensing, and applicable source access.

Selected image: the upstream project’s original `screenshot_1.png`, linked in its AppData metadata, visibly identifying 0.6.0. It shows the title screen, not narrative dialogue or mixed-license battle artwork. The rendered type is not distribution of a font program; the relevant original font notices and files are nevertheless included in the downloadable source materials.

Implementation: distribute the original PNG and lossless WebP image under GPL version 2; retain a full local GPL notice; credit Bertram/Yohann Ferreira, JAP, Len, and Allacrost; provide downloadable original title assets, scripts, fonts, notices, and screenshot source in `assets/licenses/valyria-title-source.zip`. No extra restrictions or DRM. Conversion to lossless WebP is disclosed. The page links image terms next to the preview. These image-specific terms do not relicense unrelated site content.

Other Valyria Tear scenes require separate reviews because the project uses GPL, CC BY, CC BY-SA, CC0, and OFL assets. This audit does not claim the entire game or all screenshots are CC BY-SA. The existing port/story permission review remains open.

## Storm

Use an existing local campaign playtest capture, `build/continue-copy-review-e9ae749-actors-20261005/frame-20.png`. Label as campaign prototype, not a finished release. No private source code, saves, diagnostics, usernames, or desktop content is published. The screenshot depicts the game’s current visuals and is converted to lossless WebP.

## Public implementation

Attribution and license/source downloads: `screenshot-credits/index.html`. Each project card has alt text, a clickable full-image preview, and visible original-game/prototype labeling. Original PNG and source archive are served directly from the same Pages site. Recheck rights if replacing an image with a different scene or adding a port download.
