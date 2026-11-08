# Adi Olszanski – Personal Portfolio

A professional portfolio presenting my background in Salesforce, CRM solutions, automation, integrations, and software development.

**Live website:** [adibridge.github.io/my-first-site](https://adibridge.github.io/my-first-site/)

## Overview

This is a single-page, static portfolio website written in Hebrew with a right-to-left (RTL) layout. It introduces my professional focus, skills, experience, and education, and gives visitors a way to connect with me. The site uses a dark navy and cyan visual style and is fully responsive across desktop and mobile screens.

## Features

The page is made up of the following sections:

- **Hero introduction** – Name, professional tagline, and a short introduction, displayed alongside an original inline SVG illustration of connected systems (CRM, API, Automation, Data, Analytics, Integrations, and Workflows). On desktop the text and illustration sit side by side; on mobile they stack vertically.
- **Areas of interest** – A short paragraph describing my main professional interests.
- **Professional experience and areas of expertise** – Four skill cards: Salesforce & CRM, Automation & Flows, Apex & SOQL, and Integrations & Analytics.
- **Professional background and education**
  - A work experience timeline for my roles at T-Bridge Consulting and Solutions.
  - Education and training cards for Experis Academy and a Salesforce Implementation Course.
- **Business process automation showcase** – An explanation of my approach to business process automation, accompanied by a three-stage inline SVG flow diagram.
- **Contact** – An invitation to connect, with GitHub and LinkedIn buttons that open in a new tab.
- **Footer** – Copyright notice.
- **Dark / light theme toggle** – A button in the top corner switches between the default dark theme and a light theme. The visitor's choice is saved in `localStorage` when available and restored on reload; if storage is unavailable, the toggle still works for the current visit.

### Design and accessibility

- Hebrew RTL layout, with English terms and names isolated so they display correctly left to right.
- Responsive layouts built with CSS Grid and Flexbox, with breakpoints for mobile, tablet, and wide screens.
- Semantic HTML (`header`, `section`, `article`, `figure`, `footer`) and labeled section headings.
- Accessible SVG illustrations with Hebrew titles and descriptions.
- Visible keyboard focus styles on the contact buttons and the theme toggle.
- The theme toggle has a Hebrew accessible label that updates with the current theme.
- Subtle hover effects and a CSS-only animation in the hero illustration, all of which respect the user's `prefers-reduced-motion` setting.

## Technologies

- **HTML5**
- **CSS3** – custom properties, Grid, Flexbox, logical properties, media queries, and keyframe animations
- **Inline SVG** – illustrations and icons
- **JavaScript** – a small vanilla script for the dark / light theme toggle

The site does not use frameworks, external libraries, or external images.

## Getting Started

No build step or dependencies are required.

1. Clone the repository:

   ```bash
   git clone https://github.com/AdiBridge/my-first-site.git
   ```

2. Open the project folder:

   ```bash
   cd my-first-site
   ```

3. Open `index.html` directly in any modern web browser (for example, by double-clicking it).

## Project Structure

```
my-first-site/
├── index.html   # Page content and inline SVG illustrations
├── style.css    # All styling, dark and light themes, responsive layout, and animations
├── script.js    # Dark / light theme toggle with saved preference
├── README.md    # Project documentation
└── .gitignore   # Files excluded from version control
```

## Links

- **Live website:** https://adibridge.github.io/my-first-site/
- **GitHub repository:** https://github.com/AdiBridge/my-first-site

## Author

**Adi Olszanski**

- GitHub: [AdiBridge](https://github.com/AdiBridge)
- LinkedIn: [Adi Olszanski](https://www.linkedin.com/in/adi-olszanski-765173224/)
