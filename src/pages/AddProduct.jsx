import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import '../css/addproduct.css';
import { apiRequest } from '../api';

const AddProduct = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;

        const form = e.target;

        const product = {
            product_name: form.productName.value.trim(),
            sku: form.sku.value.trim(),
            category: form.category.value,
            price: form.price.value,
            quantity: form.quantity.value,
            minimum_stock: form.minStock.value,
            location: form.location.value,
            description: form.description.value.trim()
        };

        try {
            setSaving(true);
            setMessage("");

            const data = await apiRequest("/products", {
                method: "POST",
                body: JSON.stringify(product)
            });

            if (data.success) {
                alert("Product added successfully!");
                navigate("/products");
            } else {
                setMessage(data.message || "Unable to save product.");
            }
        } catch (error) {
            setMessage(error.message || "Unable to connect to server.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="deshboard">
            <Sidebar />

            <main className="main-content">
                <div className="page-title">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => navigate("/products")}
                    >
                        ←
                    </button>

                    <h1>Add new product</h1>
                </div>

                <div className="form-container">
                    <form id="productForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product name</label>
                            <input
                                type="text"
                                name="productName"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>SKU (stock keeping unit)</label>
                            <input
                                type="text"
                                name="sku"
                                placeholder="Enter SKU"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" required defaultValue="">
                                <option value="" disabled>Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Unit Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Enter price"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Current Stock</label>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Enter current stock"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Minimum Stock</label>
                            <input
                                type="number"
                                name="minStock"
                                placeholder="Enter minimum stock"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <select name="location" defaultValue="">
                                <option value="">Select location</option>
                                <option value="Warehouse">Warehouse</option>
                                <option value="Store">Store</option>
                                <option value="Office">Office</option>
                            </select>
                        </div>

                        <div className="form-group description">
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter product description"
                            />
                        </div>

                        {message && <p>{message}</p>}

                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/products")}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProduct;
