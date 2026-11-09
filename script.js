/*
 * Site behaviour: language switching (Hebrew / English), theme toggle
 * (dark / light), and the contact form (validation + Formspree submission).
 *
 * Loaded in <head> without defer so the saved theme and language direction
 * are applied before the page is painted.
 *
 * Translation approach:
 * - Hebrew is the default and the source of truth: it lives in index.html.
 * - Elements with data-i18n="key" get their English HTML from CONTENT_EN.
 *   Their original Hebrew HTML is captured on load, so switching back
 *   restores it exactly.
 * - Text set from JavaScript (labels, form messages, title, metadata)
 *   comes from UI_TEXT, which has both languages.
 */
(function () {
    'use strict';

    var root = document.documentElement;

    /* ------------------------------------------------------------------
     * Storage helpers. localStorage can be missing or throw (privacy mode,
     * blocked storage, some file:// setups), so every access is guarded.
     * Only the theme and language preferences are stored, never form data.
     * ------------------------------------------------------------------ */
    function readPref(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function savePref(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            /* Storage unavailable: the choice still applies for this visit. */
        }
    }

    /* ------------------------------------------------------------------
     * Translations
     * ------------------------------------------------------------------ */
    var CONTENT_EN = {
        'hero.tagline': '<strong>Information Systems, Automation &amp; Integrations</strong><br>' +
            'Specializing in Salesforce, CRM Solutions &amp; Business Process Optimization',
        'hero.intro': 'My work in Information Systems combines implementing and customizing business systems, ' +
            'building automations, connecting systems through integrations, and optimizing business processes, ' +
            'with Salesforce as my core specialization. ' +
            'My goal is to translate business needs into technology solutions that save time, ' +
            'reduce manual work, and help organizations work smarter and more efficiently.',
        'heroSvg.title': 'Illustration: business systems connected around the CRM',
        'heroSvg.desc': 'A technology illustration with a CRM cloud at its center, connected by data-flow lines ' +
            'to six surrounding systems: API, Automation, Data, Analytics, Integrations, and Workflows.',
        'interests': 'My primary area of interest is Information Systems, especially Salesforce and building CRM solutions.<br>' +
            'Another area that interests me is automation and integrations that connect systems, save time, and streamline processes.<br>' +
            'I am also passionate about software development and learning new technologies.',

        'skills.title': 'Professional Experience and Expertise',
        'skills.intro': 'My work combines business process analysis, system implementation and customization, building automations, ' +
            'developing custom logic, and connecting systems, with Salesforce and CRM systems as my professional foundation. ' +
            'My approach starts with understanding the business process ' +
            'and continues with a technical solution that is simple, stable, and easy to maintain.',
        'skills.crm': 'Setting up and customizing Salesforce environments: objects, fields, permissions, and page layouts, ' +
            'so the system reflects how the organization works, alongside work with CRM solutions and other business systems.',
        'skills.flows': 'Analyzing business processes and building automations with Salesforce Flows and Make.com scenarios ' +
            'to reduce manual work, keep data consistent, and shorten handling times.',
        'skills.apex': 'Developing custom logic in Apex and querying data with SOQL when requirements go beyond ' +
            'what declarative tools can do.',
        'skills.integrations': 'Connecting business systems through APIs, and building reports, dashboards, and data processes ' +
            'that support data-driven decisions.',

        'background.title': 'Professional Background and Education',
        'background.intro': 'A professional path in Salesforce and CRM, alongside technology training.',
        'experience.title': 'Professional Experience',
        'job1.date': '<span class="date-range"><time datetime="2025-04">April 2025</time>' +
            '<span class="date-sep">–</span><span class="date-end">Present</span></span>' +
            '<span class="timeline-badge">Current role</span>',
        'job1.desc': 'Salesforce implementation, building automations and integrations, CRM architecture design, ' +
            'and business process optimization.',
        'job2.date': '<span class="date-range"><time datetime="2022-04">April 2022</time>' +
            '<span class="date-sep">–</span><time datetime="2025-04">April 2025</time></span>',
        'job2.desc': 'Salesforce configuration and customization, CRM implementation, building business workflows, ' +
            'and process automation.',
        'education.title': 'Education and Training',
        'edu1.type': 'Bootcamp · <time datetime="2020-11">November 2020</time> – <time datetime="2021-02">February 2021</time>',
        'edu1.desc': 'Training in software testing and automation, including QA Automation and Selenium testing.',
        'edu2.type': 'Professional training · <time datetime="2022-04">April 2022</time>',
        'edu2.desc': 'A Salesforce implementation course provided by T-Bridge Consulting and Solutions.',

        'process.eyebrow': 'Business Process Automation',
        'process.title': 'From Complex Processes to Smart Solutions',
        'process.p1': 'Every good solution starts with a deep understanding of the business process: who is involved, ' +
            'where delays occur, and which steps are still done manually. From that understanding, business requirements ' +
            'can be translated into a focused technical solution, in Salesforce, in Make.com, or in the relevant business systems.',
        'process.p2': 'Combining automation, custom logic, and integrations between business systems lets information flow seamlessly, ' +
            'and keeps the process consistent, transparent, and reliable.',
        'process.conclusion': 'The result: more efficient processes, less manual work, and clear, maintainable solutions ' +
            'that keep serving the organization as its needs change.',
        'processSvg.title': 'Flow diagram: from business challenge to automation',
        'processSvg.desc': 'A three-stage diagram from top to bottom. Stage 1: Business challenge – understanding the business problem. ' +
            'Stage 2: Solution design – planning a tailored technical solution. ' +
            'Stage 3: Automation and optimization – automating and improving the process.',
        'processSvg.s1title': 'Business Challenge',
        'processSvg.s1sub': 'Defining the business need',
        'processSvg.s2title': 'Solution Design',
        'processSvg.s2sub': 'Tailored technical design',
        'processSvg.s3title': 'Automate &amp; Optimize',
        'processSvg.s3sub': 'Automating and improving',

        'contact.eyebrow': 'Get in Touch',
        'contact.title': 'Let’s Talk About Your Next Solution',
        'contact.text': 'Have a process that could benefit from automation, business systems that need to work together, ' +
            'or an idea for improving your organization’s information systems?<br>' +
            'I’d love to hear about your challenges, explore the possibilities together, ' +
            'and find a technology solution that fits your needs.',
        'contact.github': 'My GitHub profile',
        'contact.linkedin': 'Let’s connect on LinkedIn',
        'contact.newTab': '(opens in a new tab)',

        'form.title': 'Leave a Message',
        'form.note': 'All fields are required.',
        'form.honeypot': 'Do not fill in this field',
        'form.name': 'Full name',
        'form.email': 'Email address',
        'form.message': 'Message'
    };

    var UI_TEXT = {
        he: {
            switchLanguage: 'מעבר לעברית',
            themeToLight: 'מעבר למצב בהיר',
            themeToDark: 'מעבר למצב כהה',
            title: 'Adi Olszanski | מערכות מידע, אוטומציות ואינטגרציות',
            description: 'הפורטפוליו המקצועי של Adi Olszanski: מערכות מידע, אוטומציות ואינטגרציות, עם התמחות בSalesforce ובפתרונות CRM.',

            submit: 'שליחת הודעה',
            nameMissing: 'נא להזין שם מלא.',
            emailMissing: 'נא להזין כתובת אימייל.',
            emailInvalid: 'כתובת האימייל אינה תקינה. לדוגמה: name@example.com',
            messageMissing: 'נא לכתוב הודעה.',
            summaryInvalid: 'לא ניתן לשלוח: יש לתקן את השדות המסומנים.',
            sending: 'שולח את ההודעה...',
            sendingButton: 'שולח...',
            success: 'ההודעה נשלחה בהצלחה! תודה שפנית אליי, אחזור אליך בהקדם.',
            error: 'לא הצלחנו לשלוח את ההודעה. נסה שוב מאוחר יותר.',
            rateLimited: 'נשלחו יותר מדי הודעות בזמן קצר. נסה שוב בעוד כמה דקות.'
        },
        en: {
            switchLanguage: 'Switch to English',
            themeToLight: 'Switch to light mode',
            themeToDark: 'Switch to dark mode',
            title: 'Adi Olszanski | Information Systems, Automation & Integrations',
            description: 'Professional portfolio of Adi Olszanski: Information Systems, automation, and integrations, ' +
                'specializing in Salesforce and CRM solutions.',

            submit: 'Send message',
            nameMissing: 'Please enter your full name.',
            emailMissing: 'Please enter your email address.',
            emailInvalid: 'The email address is not valid. Example: name@example.com',
            messageMissing: 'Please enter a message.',
            summaryInvalid: 'Unable to send: please correct the highlighted fields.',
            sending: 'Sending your message...',
            sendingButton: 'Sending...',
            success: 'Your message was sent successfully! Thank you for reaching out, I will get back to you soon.',
            error: 'We couldn’t send your message. Please try again later.',
            rateLimited: 'Too many messages were sent in a short time. Please try again in a few minutes.'
        }
    };

    /* ------------------------------------------------------------------
     * Language state
     * ------------------------------------------------------------------ */
    var LANG_KEY = 'lang';
    var currentLang = readPref(LANG_KEY) === 'en' ? 'en' : 'he';
    var languageListeners = [];

    function t(key) {
        return UI_TEXT[currentLang][key];
    }

    function onLanguageChange(fn) {
        languageListeners.push(fn);
    }

    // Set direction immediately (before paint) so the layout never flips visibly.
    function applyDirection() {
        root.setAttribute('lang', currentLang);
        root.setAttribute('dir', currentLang === 'en' ? 'ltr' : 'rtl');
    }

    // <title> is parsed before this script, so the tab title can be set right away.
    function applyTitle() {
        document.title = t('title');
    }

    applyDirection();
    applyTitle();
    if (currentLang === 'en') {
        // Hide content until the English text is in place (removed in initLanguage).
        root.classList.add('i18n-pending');
    }

    var originalHebrew = [];   // [{ el, html }] captured from the page on load

    function applyLanguage() {
        applyDirection();

        originalHebrew.forEach(function (item) {
            var key = item.el.getAttribute('data-i18n');
            var english = CONTENT_EN[key];
            item.el.innerHTML = currentLang === 'en' && english !== undefined ? english : item.html;
        });

        applyTitle();
        var description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', t('description'));
        }

        languageListeners.forEach(function (fn) {
            fn();
        });
    }

    function initLanguage() {
        var elements = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < elements.length; i++) {
            originalHebrew.push({ el: elements[i], html: elements[i].innerHTML });
        }

        var button = document.getElementById('lang-toggle');

        function updateButton() {
            if (!button) {
                return;
            }
            // The button names the OTHER language, in that language.
            var target = currentLang === 'en' ? 'he' : 'en';
            button.textContent = target === 'en' ? 'EN' : 'עב';
            button.setAttribute('lang', target);
            button.setAttribute('aria-label', UI_TEXT[target].switchLanguage);
            button.setAttribute('title', UI_TEXT[target].switchLanguage);
        }

        onLanguageChange(updateButton);

        if (button) {
            button.addEventListener('click', function () {
                currentLang = currentLang === 'en' ? 'he' : 'en';
                savePref(LANG_KEY, currentLang);
                applyLanguage();
            });
            button.hidden = false;
        }

        try {
            applyLanguage();
        } finally {
            root.classList.remove('i18n-pending');
        }
    }

    /* ------------------------------------------------------------------
     * Theme toggle. Dark is the default; light is data-theme="light" on <html>.
     * ------------------------------------------------------------------ */
    var THEME_KEY = 'theme';

    function isLight() {
        return root.getAttribute('data-theme') === 'light';
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
    }

    applyTheme(readPref(THEME_KEY) === 'light' ? 'light' : 'dark');

    function initToggle() {
        var button = document.getElementById('theme-toggle');
        if (!button) {
            return;
        }

        function updateLabel() {
            var label = isLight() ? t('themeToDark') : t('themeToLight');
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
        }

        button.addEventListener('click', function () {
            var next = isLight() ? 'dark' : 'light';
            applyTheme(next);
            savePref(THEME_KEY, next);
            updateLabel();
        });

        onLanguageChange(updateLabel);
        updateLabel();
        button.hidden = false;
    }

    /* ------------------------------------------------------------------
     * Contact form — validated in the browser, delivered by Formspree.
     * The endpoint comes from the form's action attribute (public, no secrets).
     * Submitted data is never logged or stored in the browser.
     * ------------------------------------------------------------------ */
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var REQUEST_TIMEOUT_MS = 20000;

    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form || !window.fetch || !window.FormData) {
            // Without fetch, the form falls back to a normal POST to Formspree.
            return;
        }

        // JavaScript takes over validation (translated messages, inline errors).
        form.noValidate = true;

        var fields = {
            name: document.getElementById('cf-name'),
            email: document.getElementById('cf-email'),
            message: document.getElementById('cf-message')
        };
        var submitButton = document.getElementById('contact-form-submit');
        var status = document.getElementById('contact-form-status');
        var alertBox = document.getElementById('contact-form-alert');
        var attempted = false;
        var submitting = false;
        var lastMessage = null;   // { key, kind } so it can be re-translated

        // Returns the message key for the field's error, or '' when it is valid.
        function errorFor(key) {
            var value = fields[key].value.trim();

            if (key === 'name') {
                return value ? '' : 'nameMissing';
            }
            if (key === 'email') {
                if (!value) {
                    return 'emailMissing';
                }
                var nativeOk = !fields.email.validity || !fields.email.validity.typeMismatch;
                return nativeOk && EMAIL_PATTERN.test(value) ? '' : 'emailInvalid';
            }
            return value ? '' : 'messageMissing';
        }

        function showFieldState(key) {
            var input = fields[key];
            var errorEl = document.getElementById(input.id + '-error');
            var messageKey = errorFor(key);

            errorEl.textContent = messageKey ? t(messageKey) : '';
            if (messageKey) {
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
            return !messageKey;
        }

        function clearFieldStates() {
            Object.keys(fields).forEach(function (key) {
                fields[key].removeAttribute('aria-invalid');
                document.getElementById(fields[key].id + '-error').textContent = '';
            });
        }

        // kind: 'loading' | 'success' (polite status) or 'error' (alert)
        function showMessage(key, kind) {
            lastMessage = key ? { key: key, kind: kind } : null;
            status.textContent = '';
            status.className = 'form-status';
            alertBox.textContent = '';

            if (!key) {
                return;
            }
            if (kind === 'error') {
                alertBox.textContent = t(key);
            } else {
                status.textContent = t(key);
                status.className = 'form-status is-' + kind;
            }
        }

        function updateSubmitLabel() {
            submitButton.textContent = submitting ? t('sendingButton') : t('submit');
        }

        function setSubmitting(isSubmitting) {
            submitting = isSubmitting;
            submitButton.disabled = isSubmitting;
            updateSubmitLabel();
            form.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
        }

        function send() {
            var controller = window.AbortController ? new AbortController() : null;
            var timer = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;

            setSubmitting(true);
            showMessage('sending', 'loading');

            // FormData sets the multipart Content-Type (with boundary) by itself.
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
                signal: controller ? controller.signal : undefined
            }).then(function (response) {
                if (response.ok) {
                    form.reset();
                    clearFieldStates();
                    attempted = false;
                    showMessage('success', 'success');
                } else if (response.status === 429) {
                    showMessage('rateLimited', 'error');
                } else {
                    showMessage('error', 'error');
                }
            }, function () {
                // Network failure or timeout: the entered data stays in the form.
                showMessage('error', 'error');
            }).then(function () {
                if (timer) {
                    clearTimeout(timer);
                }
                setSubmitting(false);
            });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (submitting) {
                return;
            }
            attempted = true;

            var firstInvalid = null;
            Object.keys(fields).forEach(function (key) {
                if (!showFieldState(key) && !firstInvalid) {
                    firstInvalid = fields[key];
                }
            });

            if (firstInvalid) {
                showMessage('summaryInvalid', 'error');
                firstInvalid.focus();
                return;
            }

            send();
        });

        // After the first attempt, update each field's feedback as the user edits it.
        Object.keys(fields).forEach(function (key) {
            fields[key].addEventListener('input', function () {
                if (attempted && !submitting) {
                    showFieldState(key);
                    showMessage('', '');
                }
            });
        });

        // Re-translate the button, any visible field errors, and the status message.
        onLanguageChange(function () {
            updateSubmitLabel();
            Object.keys(fields).forEach(function (key) {
                if (fields[key].hasAttribute('aria-invalid')) {
                    showFieldState(key);
                }
            });
            if (lastMessage) {
                showMessage(lastMessage.key, lastMessage.kind);
            }
        });

        updateSubmitLabel();
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // The theme and form register their language listeners first,
    // then initLanguage applies the saved language to everything at once.
    onReady(initToggle);
    onReady(initContactForm);
    onReady(initLanguage);
})();
