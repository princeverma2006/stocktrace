import { useEffect, useRef, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "../css/Landingpage.css";
import landingpagehero from '../assets/landing_page_hero.jpg';

const features = [
  {
    icon: "◈",
    title: "Add & Manage Products",
    text: "Easily add, edit and organize your product catalog.",
    color: "blue",
  },
  {
    icon: "⇄",
    title: "Track Stock Movement",
    text: "Keep real-time track of incoming and outgoing stock.",
    color: "cyan",
  },
  {
    icon: "♧",
    title: "Low Stock Alerts",
    text: "Get notified before stock runs out.",
    color: "pink",
  },
  {
    icon: "▥",
    title: "Reports & Analytics",
    text: "Make data-driven decisions with detailed reports.",
    color: "purple",
  },
  {
    icon: "♙",
    title: "User Management",
    text: "Secure access for your team with role-based permissions.",
    color: "blue",
  },
];

const about = [
  {
    icon: "🏢",
    title: "About StockTrace",
    text: "A smart inventory management system designed to simplify and organize your business operations.",
    color: "blue",
  },
  {
    icon: "⚡",
    title: "Simple & Efficient",
    text: "Manage products, monitor stock levels, and track inventory movement from one place.",
    color: "cyan",
  },
  {
    icon: "📦",
    title: "Stay Organized",
    text: "Keep your inventory data structured, accurate, and easy to access whenever you need it.",
    color: "pink",
  },
  {
    icon: "📊",
    title: "Data-Driven Insights",
    text: "Understand your inventory through clear reports and useful analytics.",
    color: "purple",
  },
  {
    icon: "👥",
    title: "Built for Teams",
    text: "Give your team secure and organized access with role-based user management.",
    color: "blue",
  },
];

function Dashboard() {
  return (
    <div className="laptop-area">
     <img src={landingpagehero} alt="" />
    </div>
  );
}

function LandingPage() {
 const nevigate=useNavigate();
  return (
   <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">◆</div>

          <div className="brand-name">
            Stock<span>Trace</span>
          </div>

          <div className="brand-divider"></div>

          <div className="brand-tagline">
            Smart Inventory Management System
          </div>
        </div>

        <nav>
          <a href="#home" className="active">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <button className="gradient-btn small" onClick={()=>nevigate("/login")}>Get Started</button>
        </div>
      </header>


      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            <span>ϟ</span>
            Smarter Inventory. Better Business.
          </div>

          <h1>
            Track.
            <span className="cyan"> Manage.</span>
            <span className="purple"> Grow.</span>
          </h1>

          <p className="hero-description">
            StockTrace is a powerful and easy-to-use inventory management
            system designed to help you track your stock, manage products,
            and keep your business running smoothly.
          </p>

          <div className="hero-buttons">
            <button className="gradient-btn" onClick={()=>nevigate("/login")}>
              Get Started Free
              <span>→</span>
            </button>

            
          </div>

          <div className="benefits">

            <div className="benefit">
              <div className="benefit-icon">◈</div>
              <div>
                <strong>100%</strong>
                <span>Stock Accuracy</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">ϟ</div>
              <div>
                <strong>Faster</strong>
                <span>Operations</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">♢</div>
              <div>
                <strong>Secure</strong>
                <span>& Reliable</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">▥</div>
              <div>
                <strong>Better</strong>
                <span>Decision Making</span>
              </div>
            </div>

          </div>
        </div>

        <Dashboard />

      </section>


      {/* FEATURES */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <h2>
            Powerful Features for
            <span> Smarter Inventory</span>
          </h2>

          <p>
            Everything you need to track, manage and grow your stock —
            all in one place.
          </p>
        </div>

        <div className="feature-grid">

          {features.map((feature, index) => (
            <div className="feature-card" key={index}>

              <div className={`feature-icon ${feature.color}`}>
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              
            </div>
          ))}

        </div>



      {/* ABOUT */}
            <br /><br />
        <div className="section-heading" id="about"> 
          <h2>
            About the
            <span> StockTrace</span>
          </h2>

          <p>
            Everything you need to track, manage and grow your stock —
            all in one place.
          </p>
        </div>

        <div className="feature-grid">

          {about.map((about, index) => (
            <div className="feature-card" key={index}>

              <div className={`feature-icon ${about.color}`}>
                {about.icon}
              </div>

              <h3>{about.title}</h3>

              <p>{about.text}</p>

             
            </div>
          ))}

        </div>


        {/* CTA */}
        <div className="bottom-cta">

          <div className="cta-decoration">
            <div className="cta-cube">◆</div>
          </div>

          <div className="cta-text">
            <small>READY TO GET STARTED?</small>
            <h3>Take control of your inventory today.</h3>
            <p>
              Join thousands of businesses already using StockTrace.
            </p>
          </div>

          <div className="cta-buttons">
            <button className="gradient-btn" onClick={()=>nevigate("/login")}>
              Get Started Free <span>→</span>
            </button>

           
          </div>

        </div>

      </section>


        

      

      <div className="contact" id="contact">
        <div className="section-heading" >
        <h2>Get in <span>Touch</span></h2>
         <p>Have questions about StockTrace?</p>

      </div>
      <div className="contact-desc">
        <div className="email">
        <a href="#">
          ✉ support@stocktrace.com
        </a>
          </div>
          <div className="phone">
        <a href="#">
          ☎ +91 xxxxxxxxxx
        </a>
      </div>

      <a href="#">
          @social-media
        </a>
          </div>
   </div>
    </div>
  );
}

export default LandingPage;