import { Navigate, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { SignupForm } from "../components/signup-form";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const auth = useLogin();

  const [credentials, setCredentials] = useState({email: "", password: "", password_confirmation: ""})

  async function handleSubmit(e){
    e.preventDefault();

    const res = await fetch("https://slack-api.replit.app/api/v1/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    })

    const data = await res.json();

    if(res.ok){
        alert('Account created successfully!');
        navigate('/login');
    }else{
        alert(data.errors.full_messages[0] + "\n" + data.errors.full_messages[1]);
    }
  }

  return !auth.token ? (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm credentials={credentials} setCredentials={setCredentials} handleSubmit={handleSubmit} />
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
}
