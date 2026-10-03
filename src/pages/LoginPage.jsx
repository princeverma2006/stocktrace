import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'; // Update if needed
import '../css/loginpage.css';

function Loginpage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (email.trim() === "admin" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/deshboard");
    } else {
      alert("Invalid email or password!");
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
            <div className="input-group">
              <span className="input-icon">
                {/* Email Envelope SVG Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input Field */}
            <div className="input-group">
              <span className="input-icon">
                {/* Lock SVG Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
               
              </span>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="forget-password">
              <label className="remember">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Forgot password clicked"); }}>
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="login-button">
              Sign In <span style={{ marginLeft: "8px" }}>→</span>
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