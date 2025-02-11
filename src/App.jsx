import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import useLogin from "./hooks/useLogin"
import Page from "./app/dashboard/page"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Navigate to='/app' />} />
          <Route path="/app" element={<Page />} />
        </Route>

        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
    </Router>
  )
}

function PrivateRoutes() {
  let auth = useLogin();

  return (
    auth.token ? (
      <Outlet />
    ) : (
      <Navigate to='/login' />
    )
  )
}

export default App

