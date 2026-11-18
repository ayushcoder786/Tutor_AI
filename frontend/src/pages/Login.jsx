import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callApi } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const ErrorHandler = (error) => {
        setSubmitting(false);
        setErrorMessage(typeof error === "string"
            ? error
            : error instanceof Error
                ? error.message
                : "Unable to sign in. Please try again.");
    };

    const responseHandler = (data) => {
        if (data?.status !== true) {
            ErrorHandler(data?.message || "Invalid email or password.");
            return;
        }

        login(data);
        navigate("/dashboard", { replace: true });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrorMessage("");

        const formData = new FormData(event.currentTarget);
        const payload = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        callApi("POST", "/auth/login", payload, null, responseHandler, "", ErrorHandler);
    };

    return (
        <main className="login-page">
            <section className="login-form-panel" aria-labelledby="login-title">
                <a className="login-brand" href="/" aria-label="TutorAI home">
                    <span className="login-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
                    <span>Tutor<span className="login-brand-accent">AI</span></span>
                </a>

                <div className="login-form-content">
                    <p className="login-eyebrow">YOUR LEARNING SPACE</p>
                    <h1 id="login-title">Welcome back<span>.</span></h1>
                    <p className="login-intro">Sign in to pick up where your curiosity left off.</p>

                    {errorMessage && <div className="login-form-message" role="alert">{errorMessage}</div>}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />

                        <div className="login-password-label">
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="login-password-field">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                className="login-password-toggle"
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <label className="login-remember">
                            <input type="checkbox" name="remember" />
                            <span>Keep me signed in</span>
                        </label>

                        <button className="login-submit" type="submit" disabled={submitting}>
                            {submitting ? "Signing in..." : "Sign in"}
                            {!submitting && <span aria-hidden="true">&#8594;</span>}
                        </button>
                    </form>
                    <p className="login-switch">New to TutorAI? <Link to="/register">Create an account</Link></p>

                </div>

                <p className="login-legal">Copyright 2026 TutorAI <span aria-hidden="true">|</span> Learn at your own pace</p>
            </section>

            <aside className="login-story-panel" aria-label="A little inspiration">
                <div className="story-topline">
                    <span className="story-live-dot" />
                    <span>MADE FOR THE MOMENT IT CLICKS</span>
                </div>

                <div className="story-content">
                    <p className="story-index">01 <span>/ 03</span></p>
                    <h2>Big ideas start with <em>one good question.</em></h2>
                    <p className="story-description">A more personal way to learn, explore, and make progress that feels like yours.</p>
                </div>

                <div className="story-footer">
                    <span className="story-pagination"><i /><i /><i /></span>
                </div>
                <span className="story-orbit story-orbit-one" aria-hidden="true" />
                <span className="story-orbit story-orbit-two" aria-hidden="true" />
            </aside>
        </main>
    );
}

export default Login;
