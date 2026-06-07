import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { GalleryPage } from "./pages/GalleryPage";
import { JudgesPage } from "./pages/JudgesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/judges" element={<JudgesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
