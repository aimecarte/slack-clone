import { Navigate } from "react-router-dom";
import useLogin from "../hooks/useLogin"
import { LoginForm } from "../components/login-form";

export default function Login() {
    const auth = useLogin();

    return (
        !auth.token ? (
            <div className="max-w-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoginForm />
            </div>
        ) : (
            <Navigate to='/' />
        )
    )
}