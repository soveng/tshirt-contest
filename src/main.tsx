import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EventStoreProvider } from "applesauce-react/providers";

import "./index.css";
import App from "./App.tsx";
import { eventStore, startEntryIngest } from "./nostr";

startEntryIngest();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EventStoreProvider eventStore={eventStore}>
      <App />
    </EventStoreProvider>
  </StrictMode>,
);
