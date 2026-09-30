import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import '../css/loginpage.css'


function Loginpage(){


 const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email.trim() === "admin" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true");

      // Go to dashboard page
      navigate("/deshboard");
    } else {
      alert("Invalid email or password!");
    }
  };

  
  return (
    <>
     <div className="login-page">
       
        <div className="login-page-image">
            <img
                src={logo}
                alt="StockFlow"/>
        </div>

        
        <div className="login-menu">
            <div className="login-card">

               
                <div className="welcome-message">
                    <h1>Welcome Back!</h1>
                    <p>Log in to continue</p>
                </div>

              
                <div className="login-credential">
                   
                    <h4>Email</h4>
                    <input
                    type="email"
                     placeholder="Email = admin"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                    />
                   
                    
                    <h4>Password</h4>
                    <input
                    type="password"
                    placeholder="Password = admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
/>
                </div>

                
                <div className="forget-password">
                    <label className="remember">
                        <input type="checkbox"/>
                        <span>Remember me</span>
                    </label>
                    <a href="#">
                        Forgot Password?
                    </a>
                </div>

               
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
               
               
               
            
            <div className="footer">
                © 2024 StockFlow. All rights reserved.
            </div>
        </div>
    </div>
    
    </div>
    
    </>
  )
}

export default Loginpage;