import { Navigate, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { LoginForm } from "../components/login-form";
import { useMemo, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  let auth = useLogin();

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(
      "https://slack-api.replit.app/api/v1/auth/sign_in",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );
    const data = await res.json();

    if (!data.hasOwnProperty('errors')) {
      const accessToken = res.headers.get("access-token");
      const client = res.headers.get("client");
      const expiry = res.headers.get("expiry");
      const uid = res.headers.get("uid");

      const headers = {
        "access-token": accessToken,
        client,
        expiry,
        uid,
      };

      const user = {email: data.data.email, id: data.data.id}

      localStorage.setItem("headers", JSON.stringify(headers));
      localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
    } else {
        alert(data.errors[0])
    }

    
  }

  return (
    <div className="max-w-sm w-[24rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <LoginForm
        onSubmit={handleSubmit}
        credentials={credentials}
        setCredentials={setCredentials}
      />
    </div>
  );
}
