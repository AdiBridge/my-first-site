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
     * Contact form — validated in the browser, delivered by Formspree.
     * The endpoint comes from the form's action attribute (public, no secrets).
     * Submitted data is never logged or stored in the browser.
     */
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var REQUEST_TIMEOUT_MS = 20000;

    var MESSAGES = {
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
    };

    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form || !window.fetch || !window.FormData) {
            // Without fetch, the form falls back to a normal POST to Formspree.
            return;
        }

        // JavaScript takes over validation (Hebrew messages, inline errors).
        form.noValidate = true;

        var fields = {
            name: document.getElementById('cf-name'),
            email: document.getElementById('cf-email'),
            message: document.getElementById('cf-message')
        };
        var submitButton = document.getElementById('contact-form-submit');
        var submitLabel = submitButton.textContent;
        var status = document.getElementById('contact-form-status');
        var alertBox = document.getElementById('contact-form-alert');
        var attempted = false;
        var submitting = false;

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

        function clearFieldStates() {
            Object.keys(fields).forEach(function (key) {
                fields[key].removeAttribute('aria-invalid');
                document.getElementById(fields[key].id + '-error').textContent = '';
            });
        }

        // kind: 'loading' | 'success' (polite status) or 'error' (alert)
        function showMessage(text, kind) {
            status.textContent = '';
            status.className = 'form-status';
            alertBox.textContent = '';

            if (!text) {
                return;
            }
            if (kind === 'error') {
                alertBox.textContent = text;
            } else {
                status.textContent = text;
                status.className = 'form-status is-' + kind;
            }
        }

        function setSubmitting(isSubmitting) {
            submitting = isSubmitting;
            submitButton.disabled = isSubmitting;
            submitButton.textContent = isSubmitting ? MESSAGES.sendingButton : submitLabel;
            form.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
        }

        function send() {
            var controller = window.AbortController ? new AbortController() : null;
            var timer = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;

            setSubmitting(true);
            showMessage(MESSAGES.sending, 'loading');

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
                    showMessage(MESSAGES.success, 'success');
                } else if (response.status === 429) {
                    showMessage(MESSAGES.rateLimited, 'error');
                } else {
                    showMessage(MESSAGES.error, 'error');
                }
            }, function () {
                // Network failure or timeout: the entered data stays in the form.
                showMessage(MESSAGES.error, 'error');
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
                showMessage(MESSAGES.summaryInvalid, 'error');
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
