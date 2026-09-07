# Buildify Theme Color Update

## Scope
Update only the existing light and dark color system. Preserve the current theme control, persistence, routes, behavior, layout, animations, and application logic.

## Changes
- Remap the existing semantic theme tokens to the supplied exact palettes:
  - Light: cream background, ivory surfaces, beige secondary surfaces, bronze/gold accents, warm dark text, and warm borders.
  - Dark: near-black foundation, dark brown/green surfaces, selective emerald/forest accents, gold highlights, ivory text, and green-toned borders.
- Add semantic aliases only where needed for the requested surface, emerald, forest, bronze, primary-hover, and text roles; keep existing component-facing tokens mapped to those roles so the whole app updates consistently.
- Replace old canvas and ember gradients with restrained theme-specific gradients built from the requested colors.
- Update shared glass panels, inputs, placeholders, dropdowns, dialogs, side navigation states, buttons, charts, progress tracks, and translucent surfaces so they inherit the active theme instead of using fixed white/black overlays.
- Keep muted success, warning, and danger colors readable in both modes without introducing blue or purple.
- Remove remaining old warm-orange visual overrides in reusable previews where they represent interface styling rather than real material swatches.

## Validation
- Check the application in light, dark, and system modes without changing the existing switcher.
- Review desktop and mobile views across authentication, dashboard, projects, Canvas, billing, analytics, management, and settings.
- Confirm menus, modals, fields, tables, badges, loading states, and overlays never fall back to an unintended white surface in dark mode.
- Verify there are no runtime errors and no layout or behavior regressions.

## Technical details
- Primary implementation is in the existing global Tailwind v4 semantic token definitions.
- Component edits are limited to replacing hardcoded visual color utilities with semantic classes or CSS variables.
- Material/photo swatches that convey actual product appearance remain unchanged unless they are old interface-only decoration.
