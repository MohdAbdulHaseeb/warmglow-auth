# Buildify Auth

Create a modern, premium, responsive authentication system for Buildify, an AI-powered furniture blueprint analysis and manufacturing platform.

Tech Stack

- React + TypeScript

- Tailwind CSS

- Framer Motion

- Lucide React

- Component-based architecture

- Responsive design

==================================================

DESIGN STYLE

==================================================

Theme:

Luxury • Modern • Warm • Professional • Minimal

Design Inspiration:

Apple + Linear + Notion + Premium SaaS Dashboard

Use glassmorphism with warm gradients, soft shadows, smooth transitions, rounded corners (16px), and elegant typography.

==================================================

WARM EMBER COLOR PALETTE

==================================================

Primary Background: #1A1412

Secondary Background: #241C18

Card Background: rgba(46,34,28,0.75)

Primary Accent: #C96A3D

Secondary Accent: #E08A5B

Highlight: #F2B279

Text Primary: #FFFFFF

Text Secondary: #D6C6BE

Muted Text: #9F8D84

Borders: rgba(255,255,255,0.08)

Hover Accent: #D97745

Success: #4CAF50

Warning: #F4A261

Error: #E63946

Gradient:

#1A1412 → #2D201A → #C96A3D

Buttons should use Warm Ember gradients with subtle glow effects.

==================================================

LAYOUT

==================================================

Desktop:

Split screen.

Left (45%)

- Buildify logo

- Large heading:

  "Build Smarter with AI"

Subtitle:

"Transform furniture blueprints into intelligent manufacturing workflows."

Feature cards:

• AI Blueprint Analysis

• Material Intelligence

• Manufacturing Dashboard

• AI Room Visualization

Use animated blueprint graphics with warm glowing ember particles.

Right (55%)

Premium glass authentication card.

==================================================

LOGIN PAGE

==================================================

Fields:

- Email

- Password

Features:

- Email icon

- Password icon

- Show/Hide password

- Remember Me

- Forgot Password

Primary Button:

Sign In

Divider:

OR

Google Sign In button

Footer:

Don't have an account?

Create Account

==================================================

REGISTER PAGE

==================================================

Fields:

- Full Name

- Email

- Password

- Confirm Password

Checkbox:

I agree to the Terms & Conditions

Primary Button:

Create Account

Divider:

OR

Google Sign Up

Footer:

Already have an account?

Sign In

==================================================

ANIMATIONS

==================================================

Framer Motion animations:

- Fade-in page

- Slide-up authentication card

- Floating ember particles

- Soft glowing background

- Hover lift on buttons

- Smooth page transitions

- Animated input focus border

- Loading spinner

- Success animation placeholder

==================================================

INPUT DESIGN

==================================================

Rounded inputs

Warm glass background

Focus state:

- Warm Ember glow

- Accent border

- Smooth animation

Icons inside inputs.

==================================================

BUTTON STYLE

==================================================

Primary:

Warm Ember gradient

(#C96A3D → #E08A5B)

Hover:

Slight scale (1.03)

Brighter glow

Shadow

Secondary:

Transparent with ember border.

==================================================

RESPONSIVE

==================================================

Desktop:

Split layout.

Tablet:

60/40 layout.

Mobile:

Hide illustration panel.

Authentication card becomes full width.

==================================================

ACCESSIBILITY

==================================================

- Keyboard navigation

- Proper labels

- Focus rings

- High contrast

- ARIA attributes

==================================================

CODE STRUCTURE

==================================================

Generate reusable components.

src/

 ├── pages/

 │    Login.tsx

 │    Register.tsx

 ├── components/

 │    AuthCard.tsx

 │    AuthInput.tsx

 │    PasswordInput.tsx

 │    SocialLogin.tsx

 │    AuthHeader.tsx

 │    AnimatedBackground.tsx

 ├── hooks/

 │    useAuthForm.ts

 ├── assets/

 │    logo.svg

==================================================

IMPORTANT

==================================================

- Frontend only.

- No backend authentication.

- Use placeholder functions.

- Keep the code ready for future Supabase integration.

- Use clean, scalable, production-quality React code.

- Maintain the Warm Ember theme consistently across all elements.

- Create a premium SaaS experience with subtle luxury and excellent UX.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://warmglow-auth.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/facd190c-c1f5-4b1e-842a-c67b6f492b7f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
