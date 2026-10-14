
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "../css/product.css";
import { apiRequest } from "../api";

const Product = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch products from MySQL through the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiRequest("/products");

                if (data.success) {
                    setProducts(data.products);
                } else {
                    setError("Unable to load products.");
                }
            } catch (err) {
                console.error("Product loading error:", err);
                setError("Unable to load products. Check your server.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get unique categories from database products
    const categories = [
        ...new Set(products.map((product) => product.category).filter(Boolean))
    ];

    // Determine product stock status
    const getStatus = (product) => {
        const quantity = Number(product.quantity);
        const minimumStock = Number(product.minimum_stock);

        if (quantity <= 0) return "out";
        if (quantity <= minimumStock) return "low";
        return "good";
    };

    // Search and filter products
    const filteredProducts = products.filter((product) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            String(product.product_name || "").toLowerCase().includes(searchText) ||
            String(product.sku || "").toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" || product.category === category;

        const matchesStatus =
            status === "all" || getStatus(product) === status;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="deshboard">
            <Sidebar />

            <main className="main-content">
                {/* Header */}
                <div className="page-header">
                    <h1>Product</h1>

                    <button
                        className="add-product-btn"
                        onClick={() => navigate("/addproduct")}
                    >
                        <span>+</span>
                        Add product
                    </button>
                </div>

                {/* Product panel */}
                <div className="product-panel">
                    {/* Search and filters */}
                    <div className="filters">
                        <div className="search-box">
                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search product...."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="all">All categories</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="all">All status</option>
                            <option value="good">Good</option>
                            <option value="low">Low</option>
                            <option value="out">Out of stock</option>
                        </select>
                    </div>

                    {/* Product table */}
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Product name</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">Loading products...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="6">{error}</td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">No products found.</td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => {
                                        const productStatus = getStatus(product);

                                        return (
                                            <tr key={product.id}>
                                                <td>{product.sku}</td>
                                                <td>{product.product_name}</td>
                                                <td>{product.category}</td>
                                                <td>{product.quantity}</td>

                                                <td>
                                                    <span className={`status ${productStatus}`}>
                                                        {productStatus === "out"
                                                            ? "Out of stock"
                                                            : productStatus === "low"
                                                            ? "Low"
                                                            : "Good"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button className="action-btn"
                                                        type="button"
                                                        onClick={() =>
                                                            navigate("/addproduct", {
                                                                state: { product }
                                                            })
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="table-footer">
                        <span>
                            Showing {filteredProducts.length} of {products.length} entries
                        </span>

                        <div className="pagination">
                            <button disabled>Previous</button>
                            <button className="current">1</button>
                            <button disabled>Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Product;
