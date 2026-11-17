
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/loginpage.css";
import { apiRequest } from "../api";

function Loginpage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailHasSymbols = email.length > 0 && !/^[a-zA-Z0-9]+$/.test(email);
  const passwordHasInvalidLength =
    passwordTouched && (password.length < 4 || password.length > 8);

const handleLogin = async (e) => {
    e.preventDefault();

    if (emailHasSymbols || passwordHasInvalidLength) {
        return;
    }

    setLoading(true);

    try {
        const data = await apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({
                email: email.trim(),
                password: password
            })
        });

        if (data.success) {
            localStorage.setItem("isLoggedIn", "true");
            navigate("/deshboard");
        } else {
            alert("Wrong email or password!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server error. Please try again later.");
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="login-page">
      {/* Left side banner / image */}
      <div className="login-page-image">
        <img src={logo} alt="StockTrace" />
      </div>

      {/* Right side form menu */}
      <div className="login-menu">
        <div className="login-card">
          <div className="welcome-message">
            <h2>Welcome Back!</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="login-credential">
            {/* Email Input Field */}
            <div className={`input-group${emailHasSymbols ? " has-error" : ""}`}>
              <span className="input-icon">
               <svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <circle cx="12" cy="8" r="4" />
  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
</svg>
                  
              </span>

              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                aria-invalid={emailHasSymbols}
                aria-describedby={emailHasSymbols ? "email-error" : undefined}
                required
              />
            </div>
            {emailHasSymbols && (
              <p className="input-error" id="email-error" role="alert">
                Only letters and numbers are allowed.
              </p>
            )}

            {/* Password Input Field */}
            <div
              className={`input-group${passwordHasInvalidLength ? " has-error" : ""}`}
            >
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true);
                }}
                autoComplete="current-password"
                aria-invalid={passwordHasInvalidLength}
                aria-describedby={
                  passwordHasInvalidLength ? "password-error" : undefined
                }
                required
              />

              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {passwordHasInvalidLength && (
              <p className="input-error" id="password-error" role="alert">
                Password length must be 4-8 letters.
              </p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Checking..." : "Sign In"}
              <span style={{ marginLeft: "8px" }}>→</span>
            </button>
          </form>

          {/* Footer */}
          <div className="footer">
            © 2025 StockTrace. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
