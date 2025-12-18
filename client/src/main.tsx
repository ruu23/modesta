import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Remove loading class once app is ready
const root = document.getElementById("root")!;
root.classList.remove("app-loading");

createRoot(root).render(<App />);
