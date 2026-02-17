import { createRoot } from "react-dom/client.js";
import App from "./App.jsx";
import "./index.css";
// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
