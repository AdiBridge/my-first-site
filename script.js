/*
 * Theme toggle (dark / light).
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggle);
    } else {
        initToggle();
    }
})();
