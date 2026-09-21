# USVC design system

Last updated: 2026-09-21.

## Theme

| Token          | Value     | Use                                                               |
| -------------- | --------- | ----------------------------------------------------------------- |
| Old Glory Navy | `#3C3B6E` | Headings, navigation, dark trust section, borders.                |
| Old Glory Red  | `#B22234` | Primary calls to action, required marks, icons, active underline. |
| Surface        | `#FFFFFF` | Main page and cards.                                              |
| Soft gray      | `#F5F5F7` | Hero/page headers, muted sections, disclosure/review panels.      |
| Border         | `#E5E4E9` | Cards, form controls, section edges.                              |

## Typography

Use `Times New Roman`, then `Times` and `Liberation Serif` as fallbacks. It is intentionally used for headings, navigation, buttons, labels, and body copy to match the reference product.

## Reusable visual patterns

- 1280px maximum content container with responsive side padding.
- Thin three-part navy/red/navy rule beneath major headings.
- White cards with 6–8px radius and restrained shadows.
- Primary buttons: red background, white bold text.
- Secondary buttons: white background, two-pixel navy border, navy bold text.
- Application sections: white bordered cards, numbered navy headings with red number, then the tricolor rule.
- Form controls: white, 48px minimum height where appropriate, subtle gray border, navy focus state.

The canonical implementation is [app/globals.css](../app/globals.css).
