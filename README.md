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
  - Education and training cards for The Open University of Israel, Experis Academy, and a Salesforce Implementation Course.
- **Business process automation showcase** – An explanation of my approach to business process automation, accompanied by a three-stage inline SVG flow diagram.
- **Contact** – An invitation to connect, with GitHub and LinkedIn buttons that open in a new tab.
- **Footer** – Copyright notice.

### Design and accessibility

- Hebrew RTL layout, with English terms and names isolated so they display correctly left to right.
- Responsive layouts built with CSS Grid and Flexbox, with breakpoints for mobile, tablet, and wide screens.
- Semantic HTML (`header`, `section`, `article`, `figure`, `footer`) and labeled section headings.
- Accessible SVG illustrations with Hebrew titles and descriptions.
- Visible keyboard focus styles on the contact buttons.
- Subtle hover effects and a CSS-only animation in the hero illustration, all of which respect the user's `prefers-reduced-motion` setting.

## Technologies

- **HTML5**
- **CSS3** – custom properties, Grid, Flexbox, logical properties, media queries, and keyframe animations
- **Inline SVG** – illustrations and icons

The site does not use JavaScript, frameworks, external libraries, or external images.

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
├── style.css    # All styling, responsive layout, and animations
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
