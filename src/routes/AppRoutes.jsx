import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";

import Callback from "../pages/Callback";
import Library from "../pages/Library";
import Analyze from "../pages/Analyze";
import AnalyzeEdit from "../pages/AnalyzeEdit";
import ViewPosition from "../pages/ViewPosition";
import About from "../pages/About";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route
        path="/"
        element={
          // <ProtectedRoute>
          <MainLayout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route index element={<Library />} path="/library" />
        <Route index element={<Analyze />} path="/analyze" />
        <Route index element={<AnalyzeEdit />} path="/analyze/:id" />
        <Route index element={<ViewPosition />} path="/view-position" />
        <Route index element={<About />} path="/about-us" />

      </Route>
    </Routes>
  );
}
