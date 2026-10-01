---
name: Action Plan Management System
description: A calm, teal-led operational workspace for daily planning and progress updates.
colors:
  workspace: "#f6f8f8"
  canvas: "#ffffff"
  ink: "#172b2d"
  deep-teal: "#173c3a"
  teal: "#137d79"
  line: "#dce5e4"
  muted: "#667c7c"
  soft-teal: "#e3f3f0"
  mint: "#c8ebe7"
  success-bg: "#dff3e6"
  success-text: "#206b43"
  progress-bg: "#e5efff"
  progress-text: "#265b9b"
  pending-bg: "#fff1d7"
  pending-text: "#9a5b16"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  control: "8px"
  field: "12px"
  container: "16px"
  pill: "999px"
spacing:
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  7: "28px"
  8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "44px"
  input-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 12px"
    height: "44px"
  surface-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.container}"
    padding: "12px"
---

# Design System: Action Plan Management System

## Overview

**Creative North Star: "The Calm Operations Desk"**

This is a desktop-first internal workspace that makes routine planning and status updates feel orderly rather than bureaucratic. A reserved teal foundation, cool near-white canvas, compact system typography, and gently rounded controls keep attention on task data and decisions.

The system is intentionally quiet: color communicates navigation, actions, and status; borders and subtle tonal shifts organize content before shadows do. It stays practical on smaller screens by replacing the Action Plan table with a stacked record view and moving dialogs to the bottom edge.

**Key Characteristics:**

- Calm teal identity with low-contrast neutral surfaces.
- Compact, scan-first tables for operational data.
- Gentle 12–16px rounding for controls and containers.
- Color-coded statuses with readable text rather than icon-only signals.

## Colors

The palette uses deep teal for identity, a clear teal for action, and pale cool neutrals to separate workspace layers without visual noise.

### Primary

- **Working Teal:** Primary actions, result links, focused fields, and active navigation use the `teal` token.
- **Deep Workspace Teal:** Brand marks, the login statement panel, dialog scrims, and major headings use `deep-teal`.
- **Active Wash:** The `soft-teal` token marks the active navigation context without competing with the primary action.
- **Avatar Mint:** The `mint` token gives initials and compact identity surfaces a light, friendly anchor.

### Neutral

- **Cool Workspace:** The `workspace` token is the application canvas behind primary surfaces.
- **White Canvas:** The `canvas` token keeps forms, tables, sidebar, and dialog content legible and distinct.
- **Quiet Ink:** The `ink` token is the highest-contrast default text color.
- **Structural Line:** The `line` token creates table divisions, field boundaries, and surface edges.
- **Supporting Copy:** The `muted` token carries descriptions and secondary information.

### Status

- **Completed:** `success-bg` and `success-text` indicate finished work.
- **In Progress:** `progress-bg` and `progress-text` indicate active work.
- **Pending:** `pending-bg` and `pending-text` indicate incomplete work.

**The Meaningful Accent Rule.** Teal is reserved for the selected path, a primary action, an interactive result link, or keyboard focus. Status hues only describe state.

## Typography

**Display Font:** System sans-serif stack.

**Body Font:** System sans-serif stack.

**Character:** A familiar native sans-serif voice keeps the workspace quick to read across managed desktop devices. Weight and spacing create hierarchy; decorative type is absent.

### Hierarchy

- **Display** (600, 3rem, 1.2): Login statement only on larger screens.
- **Title** (600, 2rem, 1.2): Page headings; the same treatment contracts to 1.875rem at narrow sizes.
- **Body** (400, 0.875rem, 1.5): Descriptions, table data, helper copy, and form controls.
- **Label** (600, 0.75rem, 0.04em): Uppercase table headers and compact group labels.

**The Scan-First Rule.** Page and record names carry medium-to-semibold weight; supporting information stays smaller and muted so a busy day’s work can be skimmed in rows.

## Layout

The desktop app has a fixed 288px sidebar and a 64px top bar; content begins after the sidebar and uses the full available workspace width with 28px large-screen padding (32px from `xl`). Page headers place the main action beside the heading when space allows, then stack on narrow screens.

Data tables sit in bordered white containers and retain their horizontal columns at desktop widths. The Action Plan list changes to separated record cards below the `md` breakpoint. Monitoring changes from a two-column user-picker/data arrangement to a vertical stack below `xl`; the navigation becomes a scrim-backed slide-out panel below `lg`. Login’s split identity/form composition collapses naturally into one column on smaller screens.

## Elevation & Depth

Depth is restrained and structural. Standard cards use a low, diffuse green-gray shadow (`0 18px 36px -32px rgba(23,60,58,0.35)`) combined with a visible border. The login frame has a slightly larger diffuse lift (`0 24px 60px -38px rgba(26,55,54,0.38)`); dialogs use a top-biased shadow and translucent deep-teal scrim to establish temporary focus.

### Shadow Vocabulary

- **Surface lift:** `0 18px 36px -32px rgba(23,60,58,0.35)` for tables and user-selection cards.
- **Login frame:** `0 24px 60px -38px rgba(26,55,54,0.38)` for the single, introductory application frame.
- **Dialog lift:** `0 -20px 56px -25px rgba(23,60,58,0.55)` for mobile-bottom and centered dialogs.

**The Border-First Rule.** Resting hierarchy comes from pale borders and background contrast; shadows provide containment, not decoration.

## Shapes

Controls use a friendly 12px radius, compact icon buttons use 8px, and content surfaces use 16px. Status and role markers are fully pill-shaped. Circular initials distinguish people; the square AP mark and primary controls preserve the rounded-rectangle language. Fields remain white with a single border that turns teal on focus.

## Components

### Buttons

Primary buttons are 44px tall, `teal`, white, semibold, and rounded to 12px, with a darker teal hover state. Secondary cancellation actions are text-first with a pale neutral hover background. Icon actions are 36px square with 8px rounding; their hover surface is pale teal.

### Status Badges

- **Style:** Fully rounded labels with 10px horizontal / 4px vertical padding, 12px semibold text, and no border.
- **State:** Completion, in-progress, and pending states each pair a pale background with a darker readable text color.

### Cards / Containers

- **Corner Style:** Soft 16px corners for tables, monitoring selection, and the login frame.
- **Background:** White canvas on a cool workspace background.
- **Border:** A one-pixel `line` edge supports every primary data surface.
- **Internal Padding:** 12px for selection cards; table cells use 20px horizontal / 16px vertical spacing.

### Inputs / Fields

- **Style:** White, bordered fields with 12px corners and 44–48px control heights.
- **Focus:** The border shifts to `teal`; the global keyboard outline is a 3px mint-teal ring with a 3px offset.
- **Textarea:** Same field treatment with no resize handle.

### Navigation

The left navigation uses 44px rows, 12px rounding, 14px medium-weight labels, and 18px outline icons. Active items have the `soft-teal` wash and teal text; inactive items remain muted and gain a pale neutral hover fill. On mobile, the same sidebar sits above a translucent scrim and is opened from the compact top bar.

### Dialogs

Dialogs are white, padded 24px, and 16px rounded when centered. On small screens they become a bottom-attached sheet with top-only 16px rounding; a single compact close icon and an aligned action row make editing states focused and familiar.

## Do's and Don'ts

### Do:

- **Do** use `teal` for a clear primary action, the active route, focus borders, and external result links.
- **Do** keep operational records in aligned, lightly divided rows with 20px horizontal cell padding on desktop.
- **Do** pair every status background with its established dark text color and a written label.
- **Do** preserve the system sans-serif stack and compact, medium-weight hierarchy.
- **Do** use 12px rounding for inputs and primary controls, 16px rounding for main surfaces, and pills only for compact labels.

### Don't:

- **Don't** introduce decorative gradients, oversized imagery, or promotional dashboard graphics into this operational UI.
- **Don't** use strong shadows when a pale border and the workspace/canvas contrast already establishes grouping.
- **Don't** use teal as a general text color; reserve it for interactive or selected meaning.
- **Don't** let desktop table columns collapse into unreadable fragments; use the established card treatment for the Action Plan list on narrow screens.
