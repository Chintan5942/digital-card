import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";

import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import QrGalleryPage from "./pages/QrGalleryPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      {/* Layout ALWAYS loads first */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/:slug" element={<ProfilePage />} />

        {/* Protected routes */}
        <Route element={<AdminRoute />}>
          <Route path="/qr" element={<QrGalleryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
