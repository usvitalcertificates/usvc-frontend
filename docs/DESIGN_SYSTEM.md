# USVC design system

Last updated: 2026-09-23.

## Public theme (unchanged)

| Token          | Value     | Use                                                                  |
| -------------- | --------- | -------------------------------------------------------------------- |
| Old Glory Blue | `#3C3B6E` | Headings, navigation, dark trust section, borders, and focus states. |
| Old Glory Red  | `#B22234` | All action buttons, required marks, icons, and active underlines.    |
| Surface        | `#FFFFFF` | Main page and cards.                                                 |
| Soft gray      | `#F5F5F7` | Hero/page headers, muted sections, disclosure/review panels.         |
| Border         | `#E5E4E9` | Cards, form controls, section edges.                                 |

Public typography is Times New Roman throughout. None of the flow tokens below
may appear on public pages.

## Theme

| Token          | Value     | Use                                                                  |
| -------------- | --------- | -------------------------------------------------------------------- |
| Old Glory Blue | `#3C3B6E` | Headings, navigation, dark trust section, borders, and focus states. |
| Old Glory Red  | `#B22234` | All action buttons, required marks, icons, and active underlines.    |
| Surface        | `#FFFFFF` | Main page and cards.                                                 |
| Soft gray      | `#F5F5F7` | Hero/page headers, muted sections, disclosure/review panels.         |
| Border         | `#E5E4E9` | Cards, form controls, section edges.                                 |

## Typography

Use `Times New Roman`, then `Times`, `Liberation Serif`, and `serif` as fallbacks across the entire website. All headings, navigation, buttons, labels, body copy, and form controls inherit this stack. Stripe Elements uses the equivalent supported stack.

## Reusable visual patterns

- 1280px maximum content container with responsive side padding.
- Thin three-part navy/red/navy rule beneath major headings.
- White cards with 6–8px radius and restrained shadows.
- All user-facing action buttons: Old Glory Red background (`#B22234`) with white bold text, including actions previously presented as secondary, white, quiet, or text-only buttons.
- Button hover and active states retain the official red and use opacity, outlines, or shadows for feedback; alternate dark-red or dark-blue brand shades are not used.
- Structural controls such as the mobile menu and FAQ accordion retain their functional layouts and use the official brand colors for accents.
- Application sections: white bordered cards, numbered navy headings with red number, then the tricolor rule.
- Form controls: white, 48px minimum height where appropriate, subtle gray border, navy focus state.

## Staff dashboard patterns (internal portal only)

Separate stylesheet [`app/staff.css`](../app/staff.css), imported in the root
layout but namespaced so no selector can match public pages. Own tokens:

| Token     | Value     | Use                                                      |
| --------- | --------- | -------------------------------------------------------- |
| Flow bg   | `#F7F9FC` | Page background, neutral pill backgrounds.               |
| Flow ink  | `#0B2545` | Sidebar, headings, strong text, avatar discs.            |
| Primary   | `#1D4ED8` | Buttons, links, active states, focus rings, step states. |
| Primary D | `#1E40AF` | Button hover, current-step emphasis.                     |
| Tint      | `#E4EBFB` | In-progress pill backgrounds.                            |
| Muted     | `#8DA9C4` | Borders (tinted `#DCE4EF`), icons, secondary text.       |
| Success   | `#16A34A` | Submitted/closed pills, success toasts.                  |
| Danger    | `#DC2626` | Exception pills, destructive actions, reveal countdown.  |

- Typography: Inter (`next/font`, `--font-flow`), staff scope only; 15px base,
  tabular numerals for data; sentence-case labels and buttons.
- Navy sidebar shell (264px, role pill, active-link indicator) collapsing to a
  top bar under 900px; ink band page headers; stat cards with lucide icons.
- Status pills carry text labels, never color alone; sticky-header tables with
  row hover, stacked-card fallback under 760px; numbered pagination.
- Fulfillment stepper, day-grouped timelines, success toasts, skeletons,
  destructive actions use explicit danger styling + `confirm()` (Drop
  Ownership); destructive admin actions already confirm.
- Icons: `lucide-react` with `aria-hidden`, always paired with visible text.
- Audited 2026-09-23 against Vercel web-interface-guidelines (focus-visible,
  labels, spellcheck/autocomplete, reduced motion, img dimensions, no
  `transition: all`). Accepted deviations: filters/tabs/pagination live in
  component state rather than URL params (internal tool; order detail URLs
  still deep-link); sentence case kept for consistency.

The canonical implementation is [app/staff.css](../app/staff.css).
