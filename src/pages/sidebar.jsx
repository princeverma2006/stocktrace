import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login", { replace: true });
    };

  return (
    <>
     <aside className="sidebar">
        <div className="logo">
            <img
                src={logo}
                alt="StockFlow"
            />
            <span>StockTrace</span>
        </div>

        <nav>
            <Link to="/deshboard">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/stock-movement">Stock movement</Link>
            <Link to="/low-stock">Low Stock</Link>
            <Link to="/history">History</Link>
            <Link to="/reports">Reports</Link>
        </nav>


        <button
            className="logout"
            onClick={handleLogout}
        >
            Logout
        </button>
    </aside>

        </>
    );
}

export default Sidebar;