import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import useLogin from "./hooks/useLogin"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<div>Welcome User!</div>}/>
          <Route path="/app" element={<div>Chat App</div>}/>
        </Route>

        <Route path="/login" element={<Login />}/>
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

