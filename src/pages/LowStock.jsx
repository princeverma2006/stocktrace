import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import "../css/lowstock.css";
import { apiRequest } from "../api";

const LowStock = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiRequest("/products");

                if (data.success) {
                    setProducts(data.products);
                } else {
                    setError("Unable to load products.");
                }
            } catch (error) {
                console.error(error);
                setError("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Products that need restocking
    const lowStockProducts = products.filter(
        product =>
            Number(product.quantity) <= Number(product.minimum_stock)
    );

    return (
        <div className="deshboard">
            <Sidebar />

            <main className="main-content">
                <h1>Low Stock Alerts</h1>

                <div className="content-card">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : lowStockProducts.length === 0 ? (
                        <div className="no-products">
                            All products have sufficient stock.
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Current Stock</th>
                                        <th>Minimum Stock</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody id="lowStockTable">
                                    {lowStockProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.product_name}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.minimum_stock}</td>
                                            <td>
                                                <span className="status low">
                                                    {Number(product.quantity) === 0
                                                        ? "Out of Stock"
                                                        : "Low Stock"}
                                                </span>
                                            </td>
                                            <td>
                                                <button className='restock-btn'
                                                    onClick={() =>
                                                        navigate("/addproduct", {
                                                            state: { product }
                                                        })
                                                    }
                                                >
                                                    Restock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LowStock;
