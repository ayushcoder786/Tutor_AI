import { useState } from "react";
import { Link } from "react-router-dom";
import { callApi } from "../api";
import "./Login.css";
import "./Register.css";

const Register = () => {
    const [submitting, setSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState(null);

    const ErrorHandler = (error) => {
        setSubmitting(false);

        const detail = error?.detail ?? error?.message ?? error;
        const message = typeof detail === "string"
            ? detail
            : Array.isArray(detail)
                ? detail.map((item) => item.msg || JSON.stringify(item)).join(" ")
                : "Registration failed. Please check your details and try again.";
        setFormStatus({ type: "error", message });
    };

    const responseHandler = (data) => {
        if (data?.status !== true) {
            ErrorHandler(data?.detail ?? data?.message);
            return;
        }

        setSubmitting(false);
        setFormStatus({
            type: "success",
            message: typeof data?.message === "string"
                ? data.message
                : "User registered successfully."
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        setFormStatus(null);

        const formData = new FormData(event.currentTarget);
        const payload = {
            firstname: formData.get("firstname").toUpperCase(),
            lastname: formData.get("lastname").toUpperCase(),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password")
        };
        callApi("POST", "/auth/signup", payload, null, responseHandler, "", ErrorHandler);
    };

    return (
        <main className="login-page">
            <section className="login-form-panel" aria-labelledby="register-title">
                <Link className="login-brand" to="/login" aria-label="TutorAI sign in">
                    <span className="login-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
                    <span>Tutor<span className="login-brand-accent">AI</span></span>
                </Link>

                <div className="login-form-content register-form-content">
                    <p className="login-eyebrow">START LEARNING YOUR WAY</p>
                    <h1 id="register-title">Create account<span>.</span></h1>
                    <p className="login-intro">A few details and you're ready to get started.</p>

                    {formStatus && (
                        <div className={`register-message register-message-${formStatus.type}`} role={formStatus.type === "error" ? "alert" : "status"}>
                            <span>{formStatus.message}</span>
                            {formStatus.type === "success" && <Link to="/login">Go to sign in</Link>}
                        </div>
                    )}

                    <form className="login-form register-form" onSubmit={handleSubmit}>
                        <div className="register-fields-row">
                            <div className="register-field">
                                <label htmlFor="firstname">First name</label>
                                <input id="firstname" name="firstname" type="text" autoComplete="given-name" required />
                            </div>
                            <div className="register-field">
                                <label htmlFor="lastname">Last name</label>
                                <input id="lastname" name="lastname" type="text" autoComplete="family-name" required />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="register-email">Email address</label>
                            <input id="register-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                        </div>

                        <div className="register-field">
                            <label htmlFor="phone">Phone number</label>
                            <input id="phone" name="phone" type="tel" autoComplete="tel" required />
                        </div>

                        <div className="register-field">
                            <label htmlFor="register-password">Password</label>
                            <input id="register-password" name="password" type="password" autoComplete="new-password" required />
                        </div>

                        <button className="login-submit" type="submit" disabled={submitting}>
                            {submitting ? "Creating account..." : "Create account"}
                            {!submitting && <span aria-hidden="true">&#8594;</span>}
                        </button>
                    </form>

                    <p className="login-switch">Already have an account? <Link to="/login">Sign in</Link></p>
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
};

export default Register;