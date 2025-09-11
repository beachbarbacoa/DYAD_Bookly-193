import { createRoot } from "react-dom/client";
import App from "./App";  // This should be a default import
import "./globals.css";

createRoot(document.getElementById("root")!).render(<App />);