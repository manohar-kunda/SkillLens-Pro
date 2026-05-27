/**
 * -----------------------------------------------------------------------------
 * File: ThemeContext.jsx
 * Component: React Global Context Provider
 * Purpose: Manages global styling aesthetic theme states (Light vs Dark Mode) 
 *          across the entire full-stack career dashboard client.
 *
 * Responsibilities:
 * - Read default styling preference on startup from browser localStorage.
 * - Toggle system states and set custom data-theme attributes (`data-theme="dark"`) 
 *   on the document element to trigger global CSS styling variable replacements.
 * - Expose theme variables and toggle actions via a custom React hook `useTheme`.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create central color theme context object
const ThemeContext = createContext();

/**
 * Higher-order provider component wrapping the React application node tree.
 * Syncs active theme properties to HTML elements and browser storage.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {React.ReactElement} React Context Provider element.
 */
export const ThemeProvider = ({ children }) => {
    // Initializer function lazy-loads theme preference from browser localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // Side-effect: Synchronizes the data attribute on the document root for CSS selection cascades
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    /**
     * Toggles active state between Light and Dark mode options.
     */
    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Access hook returning the active theme state values and toggle controls.
 * Throws errors if executed outside a valid ThemeProvider boundary context.
 *
 * @returns {{ isDarkMode: boolean, toggleTheme: Function }} Active theme context values.
 */
export const useTheme = () => useContext(ThemeContext);
