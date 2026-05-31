import "./style.css";

import { registerServiceWorker } from "./pwa";
import { mountApp } from "./ui/app";

const rootElement = document.querySelector<HTMLDivElement>("#app");

if (rootElement === null) {
  throw new Error("Missing #app root element.");
}

await mountApp(rootElement);
registerServiceWorker();
