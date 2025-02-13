import { BrowserRouter, HashRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useLogin from "./hooks/useLogin";
import Page from "./app/dashboard/page";

// Automatically use HashRouter for GitHub Pages, BrowserRouter for local dev
const isDev = import.meta.env.MODE === "development";
const RouterComponent = isDev ? BrowserRouter : HashRouter;

function App() {
  return (
    <RouterComponent basename="/slack-clone">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Navigate to="/app" />} />
          <Route path="/app" element={<Page />} />
        </Route>
        
        <Route element={<ProtectedRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </RouterComponent>
  );
}

function PrivateRoutes() {
  let auth = useLogin();
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
}

function ProtectedRoutes() {
  let auth = useLogin();
  return auth.token ? <Navigate to="/" /> : <Outlet />;
}

export default App;
