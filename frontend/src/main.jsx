/**
 * -----------------------------------------------------------------------------
 * File: main.jsx
 * Component: React Application Entry Mount Point
 * Purpose: Mounts the main React component tree into the index HTML document DOM element.
 *
 * Responsibilities:
 * - Load global stylesheet declarations (`index.css`) containing variables and design tokens.
 * - Establish React 18 Concurrent Rendering root using `createRoot`.
 * - Inject `<StrictMode>` wrapper boundaries to highlight component lifecycle warnings
 *   and prevent standard side-effect regressions during development.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Retrieve DOM selector hook and render Concurrent React tree
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
