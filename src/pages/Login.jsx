import { Navigate } from "react-router-dom";
import useLogin from "../hooks/useLogin"

export default function Login() {
    const auth = useLogin();

    return (
        !auth.token ? (
            <h1>Login Page</h1>
        ) : (
            <Navigate to='/' />
        )
    )
}