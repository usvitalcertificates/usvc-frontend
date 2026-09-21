# USVC design system

Last updated: 2026-09-22.

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

The canonical implementation is [app/globals.css](../app/globals.css).
