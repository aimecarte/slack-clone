import { Navigate } from "react-router-dom";
import useLogin from "../hooks/useLogin"
import { SignupForm } from "../components/signup-form";

export default function Register() {
    const auth = useLogin();

    return (
        !auth.token ? (
            <div className="max-w-sm w-[24rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <SignupForm />
            </div>
        ) : (
            <Navigate to='/' />
        )
    )
}