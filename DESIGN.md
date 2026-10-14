---
name: SaaS Architect Genesis
description: An idea plotted as a flight plan on a printed en-route chart, with every part also written on a paper strip.
colors:
  primary: "#1b58a7"
  primary-ink-on-accent: "#14417b"
  destructive: "#a61c65"
  navy-ink: "#141f2a"
  chart-stock: "#f4f6f5"
  card-stock: "#fcfdfc"
  strip-paper: "#ffffff"
  strip-edge: "#8395a5"
  secondary-stock: "#e3e8e6"
  accent-wash: "#dfe7f1"
  muted-ink: "#495865"
  hairline: "#bfc7cf"
  field-edge: "#718698"
typography:
  display:
    fontFamily: "Barlow Condensed, Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.4vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow Condensed, Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
  user-headline:
    fontFamily: "Barlow Condensed, Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.02
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  sm: "0px"
  md: "1px"
  lg: "2px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  gutter-x: "56px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.card-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 20px"
  button-primary-lg:
    height: "48px"
    padding: "0 28px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.md}"
  button-outline-hover:
    backgroundColor: "{colors.navy-ink}"
    textColor: "{colors.chart-stock}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.card-stock}"
    rounded: "{rounded.md}"
  input-field:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 14px"
  strip:
    backgroundColor: "{colors.strip-paper}"
    textColor: "{colors.navy-ink}"
    padding: "10px 12px"
---

# Design System: SaaS Architect Genesis

## Overview

**Creative North Star: "The En-Route Chart"**

The interface is a printed aeronautical en-route chart with a rack of paper flight strips beside it. Cool-white chart stock carries navy ink, hairline rules, a ruled neatline and tick marks. Parts of a plan are drafted navaid symbols at one fixed scale joined by airways, and every part is also written on a boxed-field paper strip that the founder can flag or strike. Density is calm and instrument-like: lots of ruled structure, almost no ornament.

The system rejects the dark-glass dashboard and the icon-card grid. Nothing glows, blurs or floats; structure comes from rules, rings and boxed fields. Lettering is one grotesque family cut three ways (Barlow, Barlow Semi Condensed, Barlow Condensed), all with tabular, lining figures turned on at the body.

**Key Characteristics:**
- Cool-white stock, navy ink, one blue, one magenta.
- Priority is ring form (double, single, dashed), never hue.
- State is line form (solid, dashed, struck), never colour alone.
- 2px corners, hairline rules, flat except a soft strip shadow.
- Condensed uppercase display for app-authored headings; the user's own words stay mixed-case.

## Colors

A cool, near-neutral chart palette (hue 150 stock, hue 208 ink) with exactly one chromatic voice for action and one reserved for decisions. Source of truth is the HSL custom properties in `src/index.css`; the hex values here are their conversions.

### Primary
- **Chart Blue** (#1b58a7, `--primary`, hsl 214 72% 38%): airways, the selection brackets, the focus ring, text links, checked controls, the primary button. Nothing else is blue-saturated.
- **Deep Chart Blue** (#14417b, `--accent-foreground`): text on the accent wash only.

### Secondary
- **Decision Magenta** (#a61c65, `--destructive`, hsl 328 71% 38%): reserved for flags, errors and anything that needs a decision (flag pennant, "Flagged" tag, error border and text, the active Flag button).

### Neutral
- **Navy Ink** (#141f2a, `--foreground`): all text, symbols, bay rails, outline buttons.
- **Chart Stock** (#f4f6f5, `--background`): page ground.
- **Card Stock** (#fcfdfc, `--card`, `--popover`): chart panel, inputs, delegated-answer panel, symbol fill.
- **Strip Paper** (#ffffff, `--strip`): paper strips and question strips only.
- **Strip Edge** (#8395a5, `--strip-edge`): the cool ink edge of a strip and its boxed fields.
- **Secondary Stock** (#e3e8e6, `--secondary`, `--muted`): secondary button fill.
- **Accent Wash** (#dfe7f1, `--accent`): hovered and selected answer rows, ghost hover.
- **Muted Ink** (#495865, `--muted-foreground`): secondary text, zone names, bay names.
- **Hairline** (#bfc7cf, `--border`): rules, neatline, legend rows, zone dividers.
- **Field Edge** (#718698, `--input`): input borders, quiet (dimmed or struck) airways, chart tick marks, scrollbars.

### Named Rules
**The One Blue Rule.** Chart Blue means airways and the primary action. It is never used for priority, decoration or categories.

**The Decision Magenta Rule.** Magenta appears only where the founder must look or decide: flags, errors, the failure banner. If nothing needs a decision the screen has no magenta.

**The Ring Not Hue Rule.** Priority is carried by ring form on the symbol: double ring high, single ring medium, dashed thin ring low. Colour is never the carrier of priority or type.

## Typography

**Display Font:** Barlow Condensed (with Barlow Semi Condensed, system-ui)
**Body Font:** Barlow (with system-ui, sans-serif)
**Label Font:** Barlow Semi Condensed (with Barlow, system-ui)

**Character:** A single drafting-lettering family: condensed and tall for headings, semi-condensed and tracked for chart labels, plain Barlow for reading. Self-hosted through @fontsource (Barlow 400/500/600, Semi Condensed 500/600, Condensed 500/600/700, latin subset). The page sets `tnum` and `lnum` on body.

### Hierarchy
- **Display** (700, clamp(3rem, 6.4vw, 5.5rem), 0.92, uppercase, -0.01em): landing headline.
- **Headline** (700, clamp(2.25rem, 4.4vw, 3.75rem), 0.98, uppercase, -0.005em): question headings, max 20ch; generating-screen headline is 700 at clamp(2.75rem, 6vw, 4.5rem).
- **Title** (700, 1.75rem, 1, uppercase, +0.01em): results section headings (How it fits together, Reading the chart, Parts, Technology).
- **User Headline** (600, clamp(2.25rem, 4.6vw, 3.75rem), 1.02, mixed case): results H1, which is the founder's own idea text.
- **Body** (Barlow 400, 1.0625rem / 1.125rem lead, line-height relaxed 1.625, 52-65ch): prose, remarks, explanations.
- **Label** (Barlow Semi Condensed 600, 0.8125-0.9375rem, +0.06 to +0.08em, uppercase): `.label-caps`, buttons, nav steps, legend terms, strip text. Strip field names drop to 0.6875rem at +0.1em.
- **Chart lettering** (SVG, Barlow Semi Condensed 600): part names 16px, type tags 12px at +0.1em uppercase, zone names 13px at +0.12em uppercase, each haloed with a 5px card-stock stroke.

### Named Rules
**The Voice Rule.** App-authored headings are uppercase Barlow Condensed 700. The user's own words (the results H1, their idea) are mixed-case 600; the app never shouts the founder's text.

## Layout

Content sits in a centred column at max-width 84rem (1344px) with 20px side padding, 32px from the `sm` breakpoint. The landing page is a two-column grid at `lg` (5fr / 6fr, 56px column gap): headline, idea field and action on the left, labelled synthetic chart and legend table on the right. The questions page is a 16rem sticky strip rail beside a fluid column at `lg`; below it the strips become a 2 or 3 column grid. Results use a fluid chart column plus a 25rem sticky strip rack at `xl`.

The chart is a 1000-unit-wide SVG (720 on the landing example), with left-to-right zone columns by tier (Client, Access, Core, Data, Services), 128-unit rows, a ruled neatline, dashed zone dividers and ruler ticks along the bottom (25-unit steps, longer every 100). Narrow screens scroll the chart horizontally inside its frame (min-width 560px landing, 760px results) rather than shrinking it.

Rhythm is ruled bands rather than cards: sections divide on 1px hairlines, with vertical spacing in 8px steps (12px to 64px between bands). The header is a single hairline-bottomed bar with the mark, a four-step progress list (Key, Idea, Questions, Plan, hidden below `md`) and a text-only Remove key action.

## Elevation & Depth

Flat by default. The only shadow in the system is the soft strip shadow, which lifts a paper strip a hair off the chart stock. Everything else, including the chart frame, inputs and buttons, is separated by hairlines and fill alone. No blur, glow or backdrop effects.

### Shadow Vocabulary
- **Strip shadow** (`box-shadow: 0 1px 0 hsl(var(--strip-edge)), 0 3px 8px -4px hsl(208 36% 12% / 0.35)`): paper strips (parts rack and question rail).
- **Current-question edge** (`box-shadow: 0 0 0 1px hsl(var(--primary))`): replaces the strip shadow on the current question strip, reinforcing its blue edge.

### Named Rules
**The Flat-Except-Paper Rule.** Only strips carry a shadow, and only the soft one above. Nothing else lifts.

## Shapes

Corners are 2px (`--radius: 0.125rem`; Tailwind lg 2px, md 1px, sm 0). Strips, the chart frame, strip fields and toggle buttons are effectively square; the hairline and the cool strip edge do the shaping. Radio dots are the single round control. Symbols are drafted at one fixed scale in a 36-unit box with a 21-unit ring, 1.75 stroke, round joins; each component type owns one distinct silhouette (hexagon, crosshair circle, drum, triangle, diamond, and so on). A bay rail (6px tall bar in navy ink at 85%, 1px corner) sits above each bay of strips and above the question rail.

## Components

### Buttons
- **Shape:** 1px corner, 44px tall (sm 36px, lg 48px), Barlow Semi Condensed 600 uppercase, +0.06em tracking, 150ms colour transition.
- **Primary:** Chart Blue fill, card-stock text, 20px side padding (lg 28px). Hover darkens to 90%.
- **Outline:** 1px navy ink at 70%, transparent; hover inverts to navy fill with chart-stock text.
- **Ghost / Secondary / Link:** ghost hovers to accent wash; secondary is Secondary Stock; link is blue, underlined, normal case. Destructive is Decision Magenta fill.
- **Focus:** 2px chart-blue ring with 2px offset; disabled drops to 45% opacity.

### Inputs / Fields
- **Style:** card-stock fill, 1px field-edge border, 1px corner, 48px tall (textarea min 7rem, 14px side padding).
- **Hover / Focus:** border to navy at 60% on hover; border goes Chart Blue with a 2px blue ring on focus. Caret is blue.
- **Error:** message in magenta, medium weight, beneath the field with a reserved line height so layout does not jump.

### Navaid Symbol (signature)
A drafted symbol on a card-stock disc: type glyph inside a priority ring (double 21 and 24.5 radius for high, single 1.75 stroke for medium, dashed 1.25 stroke for low). Struck parts dash the ring. Used on the chart, in strips, in the legend and as the brand mark.

### Airways
Chart Blue 1.75px lines with an open chevron arrowhead, routed horizontal out of the source, vertical in the zone gutter, horizontal into the target, with 10-unit rounded corners. Hover or selection raises related airways to 2.75px and quiets the others to Field Edge. Struck parts' airways turn dashed (5 5) and quiet. They plot in with a 900ms stroke draw, only when reduced motion is not requested.

### Paper Strip
White strip paper, 1px cool strip-edge border, strip shadow, a navy bay rail above each bay with the bay name and count. Inside: symbol, name, and boxed fields (Type, Priority, Feeds) with 1px strip-edge boxes and 0.6875rem field names. A flagged strip is offset (cocked) by 16px to the right and shows a magenta Flagged tag; a struck strip gets a dashed border, 70% opacity and a struck name. The selected strip is edged in Chart Blue and opens Remarks plus Flag and Strike toggles (magenta fill when flagged, navy fill when struck).

### Question Strips
The same paper, edged in strip-edge; the current question is edged in Chart Blue only (1px border plus 1px blue ring) and is never offset. Each shows a number, short label and Open, Answered or AI decides status.

### Legend
A ranked symbol table: two columns, 1px hairline row dividers, symbol beside uppercase term and plain-language gloss, ending in one sentence on ring meaning.

### Answer Rows
Full-width ruled rows, minimum 56px tall, with a 20px square (checkbox) or round (radio) control; selected rows fill Accent Wash and the control fills Chart Blue.

## Do's and Don'ts

### Do:
- **Do** write app headings in uppercase Barlow Condensed 700 and the founder's own text in mixed-case 600.
- **Do** use Chart Blue only for airways, focus, links and the primary action; magenta only for flags, errors and open decisions.
- **Do** show priority with ring form and state with line form (solid, dashed, struck), so no meaning rests on colour alone.
- **Do** draw every component as a navaid symbol at the one fixed scale, one silhouette per type.
- **Do** separate sections with 1px hairlines and bay rails instead of cards.
- **Do** keep corners at 2px and let the strip shadow be the only shadow.
- **Do** mark an offset strip as flagged and keep the current question strip blue-edged with no offset.
- **Do** respect `prefers-reduced-motion`: the plot-line and settle animations are gated on no-preference.

### Don't:
- **Don't** use hue to encode priority or component type.
- **Don't** add a paper texture: there is no real raster asset in the build, so strips are flat white.
- **Don't** use rounded cards, glow, blur, glass panels or a second accent.
- **Don't** route airways diagonally; keep them horizontal, vertical in the gutter, horizontal into the target.
- **Don't** put magenta on anything that is not an error, flag or open decision.
