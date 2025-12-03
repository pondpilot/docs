---
title: Theming
description: Customize the appearance of the PondPilot Widget.
sidebar:
  order: 5
---

PondPilot Widget supports a powerful theming system. You can use built-in themes, auto-detection, or create your own.

## Built-in Themes

-   **`light`**: The default theme. Clean, white background.
-   **`dark`**: A dark theme suitable for dark mode websites.
-   **`auto`**: Automatically switches between light and dark based on the user's system preference (`prefers-color-scheme`).

Usage:

```html
<!-- Use dark theme -->
<pre class="pondpilot-snippet" data-theme="dark">...</pre>

<!-- Use auto theme -->
<pre class="pondpilot-snippet" data-theme="auto">...</pre>
```

## Custom Themes

You can register custom themes using `PondPilot.registerTheme()`. A theme can extend an existing one (`light` or `dark`) and override specific tokens.

### Theme Tokens

Tokens map to CSS custom properties.

| Token | Description |
| :--- | :--- |
| `bgColor` | Main background color. |
| `textColor` | Main text color. |
| `primaryBg` | Primary color (buttons, highlights). |
| `editorBg` | Background of the code editor area. |
| `syntaxKeyword` | Color for SQL keywords. |
| `fontFamily` | Font stack for UI elements. |
| `editorFontFamily` | Monospace font stack for code. |

(See full list in API docs or source).

### Example: "Midnight Neon" Theme

```javascript
PondPilot.registerTheme('midnight-neon', {
  extends: 'dark',
  config: {
    bgColor: '#0c1022',
    textColor: '#e7ecff',
    borderColor: 'rgba(56, 189, 248, 0.18)',
    editorBg: '#050814',
    primaryBg: '#22d3ee',
    syntaxKeyword: '#38bdf8',
    syntaxString: '#fb7185',
    // ... other overrides
  },
});
```

Then apply it:

```html
<pre class="pondpilot-snippet" data-theme="midnight-neon">
SELECT 'Glowing text' AS status;
</pre>
```

## CSS Variables

Under the hood, themes simply set CSS variables on the widget container. You can also override these directly in your CSS if you prefer not to use the JS API.

```css
.pondpilot-widget[data-theme="my-custom-theme"] {
  --pondpilot-bg-color: #f0f0f0;
  --pondpilot-primary-bg: #ff0000;
}
```
