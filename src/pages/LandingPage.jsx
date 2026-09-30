import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Landingpage.css";
function LandingPage() {
  useEffect(() => {
    document.body.classList.add("landing-route");

    return () => {
      document.body.classList.remove("landing-route");
    };
  }, []);

  const objectives = [
    "Monitor Current Stock Levels",
    "Stock-In & Stock-Out Tracking",
    "Low Stock Notifications",
    "Track Stock History",
    "Generate Reports",
    "Reduce Manual Errors",
  ];

  const features = [
    "Product Management",
    "Categories",
    "Live Stock Count",
    "Stock Movement Logs",
    "Dashboard Analytics",
    "Low Stock Alerts",
    "History Records",
    "Search & Filter",
    "Secure Data Storage",
  ];

  return (
    <div className="landing-route">
    <div className="landing-page">
      <nav className="navbar">
        <h2 className="Logo">StockTrace</h2>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <Link to="/login">
        <button className="nav-btn">
          Login
          </button>
        </Link>
        </nav>

    {/* hero section */}
    <section className="hero">
      <div className="hero-left">
        <p className="tag">Inventory Tracking & Stock Management</p>
        <h1>
          Manage your <span>Invevtory</span> Smarter & Faster
        </h1>
        <p className="hero-text">
            StockTrace helps organizations monitor stock levels, track product
            movement, receive low-stock alerts, manage categories, and generate
            inventory reports from one centralized dashboard.
          </p>
          <div className="hero-buttons">
            <Link to="/login">
              <button className="primary-btn">
                Get started
                </button>
            </Link>

            <button className="secondary-btn">explore features</button>
          </div>
      </div>

    </section>

    <section className="about">
      <h2>About StockTrace</h2>
      <p> StockTrace is a centralized inventory tracking web application that
          simplifies stock monitoring and stock movement management. It helps
          organizations reduce manual work, minimize inventory errors, and
          maintain accurate stock records in real time.
      </p>
    </section>

    {/*problem statement section*/}
    <section className="problem">
    <h2>Problem we solve</h2>
    <div className="problem-card">
      Manual inventory records often lead to incorrect stock counts,
          difficult tracking of stock movement, delayed reports, and late
          restocking of low-stock products. StockTrace provides one centralized
          platform to manage products, stock transactions, and inventory reports
          efficiently.
    </div>
    </section>

    {/*objectives section*/}
    <section className="objectives">
      <h2>Objectives</h2>
      <div className="card-grid">
        {objectives.map((item, index)=>(
          <div className="info-card" key={index}>
            <div className="icon">✔</div>
            <p>{item}</p>
          </div>
        ))}
      </div>
      </section>

    {/*features section*/}  
    <section className="features">
      <h2>Features</h2>
      <div className="card-grid">
        {features.map((item, index)=>(
          <div className="info-card" key={index}>
            <div className="icon">✔</div>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>

     {/* CTA */}
      <section className="cta">

        <h2>Start Managing Your Inventory Today</h2>

        <p>
          Organize products, track stock movement, monitor inventory levels and
          generate reports with StockTrace.
        </p>

        <Link to="/login">
          <button className="cta-btn">Launch StockTrace</button>
        </Link>

      </section>

      {/* Footer */}
      <footer>
        <h3>StockTrace</h3>
        <p>Inventory Tracking & Stock Movement Management System</p>
        <span>© 2026 StockTrace. All Rights Reserved.</span>
      </footer>

      </div> 
      </div>
  );
}

export default LandingPage;