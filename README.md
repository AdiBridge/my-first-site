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
- **Contact** – An invitation to connect, with GitHub and LinkedIn buttons that open in a new tab, and a contact form (see [Contact form](#contact-form)).
- **Footer** – Copyright notice.
- **Dark / light theme toggle** – A button in the top corner switches between the default dark theme and a light theme. The visitor's choice is saved in `localStorage` when available and restored on reload; if storage is unavailable, the toggle still works for the current visit.

### Design and accessibility

- Hebrew RTL layout, with English terms and names isolated so they display correctly left to right.
- Responsive layouts built with CSS Grid and Flexbox, with breakpoints for mobile, tablet, and wide screens.
- Semantic HTML (`header`, `section`, `article`, `figure`, `footer`) and labeled section headings.
- Accessible SVG illustrations with Hebrew titles and descriptions.
- Visible keyboard focus styles on the contact buttons, form fields, and the theme toggle.
- Contact form fields have labels, `autocomplete` hints, and inline Hebrew error messages linked with `aria-describedby`; loading, success, and error messages are announced to screen readers.
- The theme toggle has a Hebrew accessible label that updates with the current theme.
- Subtle hover effects and a CSS-only animation in the hero illustration, all of which respect the user's `prefers-reduced-motion` setting.

## Technologies

- **HTML5**
- **CSS3** – custom properties, Grid, Flexbox, logical properties, media queries, and keyframe animations
- **Inline SVG** – illustrations and icons
- **JavaScript** – a small vanilla script for the dark / light theme toggle and the contact form (validation and `fetch()` submission)
- **[Formspree](https://formspree.io/)** – third-party form backend that delivers contact form messages by email

The site does not use frameworks, JavaScript libraries, a build step, or external images.

## Contact form

The contact form sends real messages by email through Formspree, without a server of its own.

- **Endpoint:** `https://formspree.io/f/maeezgnv` (set in the form's `action` attribute). The endpoint is public by design; no API keys, passwords, or tokens are stored in the code, and the destination email address is configured in Formspree rather than on the site.
- **Fields:** `name`, `email`, and `message` (all required). The email is checked for a valid format before sending.
- **Submission:** `script.js` validates the fields, then sends them asynchronously with `fetch()` (`POST`, `FormData` body, `Accept: application/json`), so the page does not reload.
- **Feedback:** the submit button is disabled and a Hebrew loading message is shown while sending. A success message appears only when Formspree responds with an HTTP 2xx status, and the form is cleared only then. On errors, network failures, or timeouts, a Hebrew error message is shown and the entered text is kept; HTTP 429 (rate limiting) shows a "try again later" message.
- **Spam protection:** a hidden `_gotcha` honeypot field, which Formspree uses to filter bot submissions.
- **Privacy:** submitted data is not logged to the console or stored in the browser.
- **Without JavaScript:** the browser validates the required fields and posts the form directly to Formspree.

> **Status:** the integration is implemented, but end-to-end email delivery has not yet been verified manually.

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
├── script.js    # Theme toggle, contact form validation and Formspree submission
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
