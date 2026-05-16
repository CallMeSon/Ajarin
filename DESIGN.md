---
name: Ajarin Mentorship Platform
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#464555'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is anchored in the concepts of **Intellectual Growth** and **Human Connection**. It balances the authority of a professional educational institution with the approachability of a peer-to-peer community. 

The aesthetic follows a **Corporate Modern** direction with a strong emphasis on **Minimalism**. It utilizes ample white space to reduce cognitive load—crucial for a learning platform—and relies on high-quality typography and purposeful color accents to guide the user toward conversion. The emotional response should be one of confidence, clarity, and optimism.

## Colors
This design system employs a palette designed to instill trust while signaling progress.

- **Primary (Deep Indigo):** Used for primary actions, navigation states, and brand-heavy elements. It represents intelligence and stability.
- **Secondary (Vibrant Teal):** Used for success states, growth indicators, and secondary calls-to-action. It represents the "Mentorship Spark" and personal development.
- **Tertiary (Amber):** Reserved for highlights, badges, and warning states to provide a warm contrast to the cooler primary palette.
- **Neutral:** A range of cool grays used for text, borders, and backgrounds to maintain a clean, professional appearance.

The default mode is **light**, prioritizing a bright, open "classroom" feel.

## Typography
The design system utilizes **Plus Jakarta Sans** for all levels of hierarchy. This typeface was selected for its modern geometric build and its inherent "friendliness" through its open apertures and soft curves.

- **Headlines:** Use Bold (700) or ExtraBold (800) weights with slightly tighter letter spacing to create a strong visual impact.
- **Body Text:** Maintained at a generous 1.6 line-height to ensure maximum readability during long-form reading (e.g., mentor bios or lesson descriptions).
- **Interactive Elements:** Labels and buttons use Medium (500) or SemiBold (600) weights to distinguish them from static content.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on a 12-column system. It prioritizes clarity and whitespace to prevent the user from feeling overwhelmed.

- **Grid:** On desktop, use a 12-column grid with 24px gutters. On mobile, transition to a single-column layout with 20px side margins.
- **Spacing Rhythm:** All spacing between elements must be multiples of the 8px base unit (8, 16, 24, 32, 48, 64).
- **Sectioning:** Use large vertical padding (80px to 120px) between landing page sections to allow the brand story to breathe.

## Elevation & Depth
The design system uses a **Tonal Layering** approach combined with **Ambient Shadows** to create a sense of hierarchy without clutter.

1.  **Level 0 (Base):** Solid white or very light gray (#F9FAFB) backgrounds.
2.  **Level 1 (Cards):** White surfaces with a soft, diffused shadow (Box Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05)).
3.  **Level 2 (Dropdowns/Modals):** Elevated surfaces with a more pronounced shadow and a subtle 1px neutral-200 border to define edges against the background.

Avoid heavy blacks in shadows; instead, use tinted shadows (indigo-900 at 5% opacity) to maintain a modern, sophisticated feel.

## Shapes
The shape language is **Rounded**, reflecting the approachable and friendly nature of a mentorship platform.

- **Buttons & Inputs:** Use the standard 0.5rem (8px) radius.
- **Benefit Cards:** Use the 1rem (16px) radius to create a soft, inviting container for content.
- **Badges/Chips:** Use the 1.5rem (24px) radius or full pill-shape for a distinct "interactive" look that contrasts against square blocks of text.

## Components
Consistent component styling is vital for the conversion-focused nature of the platform.

- **Buttons:** 
  - *Primary:* Deep Indigo background, white text. Large padding (16px 32px) for CTA prominent areas.
  - *Secondary:* White background, Deep Indigo border (2px), Deep Indigo text.
- **Benefit Cards:** Large 16px rounded corners. Include a Teal icon in a soft-teal circular background. Use `headline-md` for the title and `body-md` for the description.
- **Input Fields:** 8px rounded corners, 1px neutral-300 border. On focus, the border transitions to Primary Indigo with a soft indigo outer glow.
- **Pricing Tables:** The "Recommended" or "Pro" tier should use a Primary Indigo border or a "Most Popular" Teal badge. Pricing should be displayed in `headline-lg`.
- **Mentor Profiles:** Use circular avatars with a 2px Teal border to indicate "Online/Active" status, reinforcing the concept of growth and availability.
- **Conversion Bars:** Sticky footers or headers for mobile screens with a single Vibrant Teal button to "Book a Session."