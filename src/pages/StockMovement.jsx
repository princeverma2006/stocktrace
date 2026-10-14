import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import "../css/stockmovement.css";
import { apiRequest } from '../api';

const StockMovement = () => {
    const [movementType, setMovementType] = useState('in');
    const [products, setProducts] = useState([]);
    const [movements, setMovements] = useState([]);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [location, setLocation] = useState('');
    const [remarks, setRemarks] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        const [productData, movementData] = await Promise.all([
            apiRequest('/products'),
            apiRequest('/stock-movements')
        ]);

        setProducts(productData.products || []);
        setMovements(movementData.movements || []);
    };

    useEffect(() => {
        loadData().catch(error => {
            console.error(error);
            setMessage('Unable to load data. Check your backend.');
        });
    }, []);

    const selectedProduct = products.find(
        product => String(product.id) === productId
    );

    const reasons = movementType === 'in'
        ? ['Purchase', 'Customer Return', 'Stock Correction', 'Other']
        : ['Sale', 'Damaged', 'Lost', 'Stock Correction', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setMessage('');

        try {
            const data = await apiRequest('/stock-movements', {
                method: 'POST',
                body: JSON.stringify({
                    product_id: Number(productId),
                    movement_type: movementType,
                    quantity: Number(quantity),
                    reason,
                    location,
                    remarks
                })
            });

            if (data.success) {
                setMessage(data.message);

                setQuantity('');
                setReason('');
                setLocation('');
                setRemarks('');

                await loadData();
            } else {
                setMessage(data.message || 'Unable to save movement.');
            }
        } catch (error) {
            setMessage(error.message || 'Unable to save movement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="deshboard">
            <Sidebar />

            <main className="main-content">
                <h1 className="page-title">Stock Movement</h1>

                <div className="movement-layout">
                    <section className="movement-section">
                        <div className="movement-tabs">
                            <button
                                type="button"
                                className={`tab ${movementType === 'in' ? 'active' : ''}`}
                                onClick={() => {
                                    setMovementType('in');
                                    setReason('');
                                    setMessage('');
                                }}
                            >
                                Stock In
                            </button>

                            <button
                                type="button"
                                className={`tab ${movementType === 'out' ? 'active' : ''}`}
                                onClick={() => {
                                    setMovementType('out');
                                    setReason('');
                                    setMessage('');
                                }}
                            >
                                Stock Out
                            </button>
                        </div>

                        <div className="form-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Product</label>
                                    <select
                                        value={productId}
                                        onChange={e => setProductId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(product => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.product_name} ({product.sku})
                                            </option>
                                        ))}
                                    </select>

                                    {selectedProduct && (
                                        <small>
                                            Available stock: {selectedProduct.quantity}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="Enter quantity"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Reason</label>
                                    <select
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Reason</option>
                                        {reasons.map(item => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Location</label>
                                    <select
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Location</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Store">Store</option>
                                        <option value="Office">Office</option>
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label>Remarks (Optional)</label>
                                    <textarea
                                        placeholder="Enter remarks"
                                        value={remarks}
                                        onChange={e => setRemarks(e.target.value)}
                                    />
                                </div>

                                {message && <p role="status">{message}</p>}

                                <div className="submit-area">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="transactions-section">
                        <div className="transactions-card">
                            <h2>Recent Transactions</h2>

                            <div className="transactions-list">
                                {movements.length === 0 ? (
                                    <p className="empty-message">No transactions yet.</p>
                                ) : (
                                    movements.map(movement => (
                                        <div
                                            className="transaction"
                                            key={movement.id}
                                        >
                                            <div className={`transaction-amount ${
                                                String(movement.movement_type).toLowerCase() === 'in'
                                                    ? 'in'
                                                    : 'out'
                                            }`}>
                                                {String(movement.movement_type).toLowerCase() === 'in'
                                                    ? '+'
                                                    : '−'}
                                            </div>

                                            <div className="transaction-info">
                                                <strong>
                                                    {movement.product_name || 'Unknown product'}
                                                </strong>

                                                <span>
                                                    {String(movement.movement_type).toLowerCase() === 'in'
                                                        ? 'Stock In'
                                                        : 'Stock Out'}
                                                    {' — '}
                                                    {movement.quantity} units
                                                </span>

                                                <small>
                                                    Stock: {movement.previous_quantity}
                                                    {' → '}
                                                    {movement.new_quantity}
                                                </small>

                                                {movement.note && <p>{movement.note}</p>}
                                                 <small className="transaction-date">
                                                {movement.created_at
                                                    ? new Date(movement.created_at)
                                                        .toLocaleString()
                                                    : ''}
                                            </small>
                                            </div>

                                           
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default StockMovement;
