import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from './contexts/AuthContext';
import React from 'react';

// Remove loading class once app is ready
const root = document.getElementById("root")!;
root.classList.remove("app-loading");

createRoot(root).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
