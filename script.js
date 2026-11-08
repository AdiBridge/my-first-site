/*
 * Theme toggle (dark / light) and contact form validation.
 * Loaded in <head> without defer so the saved theme is applied before the
 * page is painted, avoiding a flash of the wrong theme.
 * Dark is the default; light is enabled with data-theme="light" on <html>.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var root = document.documentElement;

    // localStorage can be missing or throw (privacy mode, blocked storage,
    // some file:// setups), so every access is guarded.
    function readTheme() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            /* Storage unavailable: the theme still applies for this visit. */
        }
    }

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

    applyTheme(readTheme() === 'light' ? 'light' : 'dark');

    function initToggle() {
        var button = document.getElementById('theme-toggle');
        if (!button) {
            return;
        }

        function updateLabel() {
            var label = isLight() ? 'מעבר למצב כהה' : 'מעבר למצב בהיר';
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
        }

        button.addEventListener('click', function () {
            var next = isLight() ? 'dark' : 'light';
            applyTheme(next);
            saveTheme(next);
            updateLabel();
        });

        updateLabel();
        button.hidden = false;
    }

    /*
     * Contact form — validation only.
     * Email delivery is NOT implemented yet: submission is always prevented,
     * nothing is sent anywhere, and no "sent" confirmation is shown.
     */
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var MESSAGES = {
        nameMissing: 'נא להזין שם מלא.',
        emailMissing: 'נא להזין כתובת אימייל.',
        emailInvalid: 'כתובת האימייל אינה תקינה. לדוגמה: name@example.com',
        messageMissing: 'נא לכתוב הודעה.',
        summaryInvalid: 'לא ניתן להמשיך: יש לתקן את השדות המסומנים.',
        summaryValid: 'כל השדות תקינים, אך ההודעה לא נשלחה: שליחת הודעות דרך הטופס עדיין אינה פעילה. ' +
            'בינתיים אפשר ליצור קשר דרך GitHub או LinkedIn.'
    };

    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) {
            return;
        }

        var fields = {
            name: document.getElementById('cf-name'),
            email: document.getElementById('cf-email'),
            message: document.getElementById('cf-message')
        };
        var status = document.getElementById('contact-form-status');
        var attempted = false;

        // Returns an error message for the field, or '' when it is valid.
        function errorFor(key) {
            var value = fields[key].value.trim();

            if (key === 'name') {
                return value ? '' : MESSAGES.nameMissing;
            }
            if (key === 'email') {
                if (!value) {
                    return MESSAGES.emailMissing;
                }
                var nativeOk = !fields.email.validity || !fields.email.validity.typeMismatch;
                return nativeOk && EMAIL_PATTERN.test(value) ? '' : MESSAGES.emailInvalid;
            }
            return value ? '' : MESSAGES.messageMissing;
        }

        function showFieldState(key) {
            var input = fields[key];
            var errorEl = document.getElementById(input.id + '-error');
            var message = errorFor(key);

            errorEl.textContent = message;
            if (message) {
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
            return !message;
        }

        function setStatus(text, kind) {
            status.textContent = text;
            status.className = 'form-status' + (kind ? ' is-' + kind : '');
        }

        form.addEventListener('submit', function (event) {
            // Never submit: there is no delivery service yet.
            event.preventDefault();
            attempted = true;

            var firstInvalid = null;
            Object.keys(fields).forEach(function (key) {
                if (!showFieldState(key) && !firstInvalid) {
                    firstInvalid = fields[key];
                }
            });

            if (firstInvalid) {
                setStatus(MESSAGES.summaryInvalid, 'error');
                firstInvalid.focus();
            } else {
                setStatus(MESSAGES.summaryValid, 'info');
            }
        });

        // After the first check, update each field's feedback as the user edits it.
        Object.keys(fields).forEach(function (key) {
            fields[key].addEventListener('input', function () {
                if (attempted) {
                    showFieldState(key);
                    setStatus('', '');
                }
            });
        });

        form.hidden = false;
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    onReady(initToggle);
    onReady(initContactForm);
})();
