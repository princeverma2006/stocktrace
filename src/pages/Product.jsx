
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "../css/product.css";
import { apiRequest } from "../api";

const formatPrice = (price) =>
    Number(price ?? 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });

const Product = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

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


const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
        ...product,
        product_name: product.product_name || "",
        sku: product.sku || "",
        category: product.category || "",
        quantity: product.quantity ?? 0,
        price: product.price ?? 0,
        minimum_stock: product.minimum_stock ?? 0
    });
    setError("");
};

const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
        ...prev,
        [name]: value
    }));
};

const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setError("");
};

const handleSave = async () => {
    if (editingId === null || saving) return;

    const price = Number(editForm.price);
    if (editForm.price === "" || !Number.isFinite(price) || price < 0) {
        setError("Enter a valid non-negative price.");
        return;
    }

    setSaving(true);
    setError("");

    try {
        const updatedProduct = {
            ...editForm,
            product_name: editForm.product_name.trim(),
            sku: editForm.sku.trim(),
            category: editForm.category.trim(),
            price,
            quantity: Number(editForm.quantity),
            minimum_stock: Number(editForm.minimum_stock)
        };

        const data = await apiRequest(`/products/${editingId}`, {
            method: "PUT",
            body: JSON.stringify(updatedProduct)
        });

        if (data.success) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editingId ? { ...p, ...updatedProduct } : p
                )
            );

            setEditingId(null);
            setEditForm({});
            alert("Product updated successfully.");
        } else {
            setError(data.message || "Unable to update product.");
        }
    } catch (err) {
        setError(err.message || "Unable to update product.");
    } finally {
        setSaving(false);
    }
};

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
                    {error && (
                        <p className="product-error" role="alert">
                            {error}
                        </p>
                    )}

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
                                    <th>Unit Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>


<tbody>
    {loading ? (
        <tr>
            <td colSpan="7">Loading products...</td>
        </tr>
    ) : filteredProducts.length === 0 ? (
        <tr>
            <td colSpan="7">No products found.</td>
        </tr>
    ) : (
        filteredProducts.map((product) => {
            const isEditing = editingId === product.id;
            const productStatus = getStatus(
                isEditing ? editForm : product
            );

            return (
                <tr key={product.id}>
                    <td>
                        {isEditing ? (
                            <input
                                name="sku"
                                value={editForm.sku}
                                onChange={handleEditChange}
                                required
                            />
                        ) : product.sku}
                    </td>

                    <td>
                        {isEditing ? (
                            <input
                                name="product_name"
                                value={editForm.product_name}
                                onChange={handleEditChange}
                                required
                            />
                        ) : product.product_name}
                    </td>

                    <td>
                        {isEditing ? (
                            <input
                                name="category"
                                value={editForm.category}
                                onChange={handleEditChange}
                                required
                            />
                        ) : product.category}
                    </td>

                    <td>
                        {isEditing ? (
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                value={editForm.price}
                                onChange={handleEditChange}
                                required
                            />
                        ) : formatPrice(product.price)}
                    </td>

                    <td>
                        {isEditing ? (
                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                step="1"
                                value={editForm.quantity}
                                onChange={handleEditChange}
                                required
                            />
                        ) : product.quantity}
                    </td>

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
                        {isEditing ? (
                            <div className="edit-actions">
                                <button
                                    type="button"
                                    className="action-btn"
                                    disabled={saving}
                                    onClick={handleSave}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    className="action-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="action-btn"
                                onClick={() => handleEdit(product)}
                                disabled={editingId !== null}
                            >
                                Edit
                            </button>
                        )}
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

                        
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Product;
