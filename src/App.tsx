import { Suspense, lazy } from "react";
import { AccountsProvider } from "applesauce-react/providers";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { GalleryPage } from "./pages/GalleryPage";
import { accounts } from "./nostr";

const JudgesPage = lazy(() =>
  import("./pages/JudgesPage").then((m) => ({ default: m.JudgesPage })),
);

const ResultsPage = lazy(() =>
  import("./pages/ResultsPage").then((m) => ({ default: m.ResultsPage })),
);

function PageFallback({ label }: { label: string }) {
  return (
    <div className="page-shell flex min-h-[50vh] items-center justify-center">
      <p className="font-mono text-sm text-muted">Loading {label}…</p>
    </div>
  );
}

export default function App() {
  return (
    <AccountsProvider manager={accounts}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route
            path="/judges"
            element={
              <Suspense fallback={<PageFallback label="judging" />}>
                <JudgesPage />
              </Suspense>
            }
          />
          <Route
            path="/results"
            element={
              <Suspense fallback={<PageFallback label="results" />}>
                <ResultsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccountsProvider>
  );
}
