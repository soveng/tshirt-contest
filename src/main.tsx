import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AccountsProvider, EventStoreProvider } from "applesauce-react/providers";

import "./index.css";
import App from "./App.tsx";
import { accounts, eventStore, restoreSession, startIngest } from "./nostr";

startIngest();
void restoreSession();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EventStoreProvider eventStore={eventStore}>
      <AccountsProvider manager={accounts}>
        <App />
      </AccountsProvider>
    </EventStoreProvider>
  </StrictMode>,
);
