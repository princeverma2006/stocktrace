import { useState, useEffect } from 'react';
import Sidebar from "./sidebar";
import '../css/history.css';
import { apiRequest } from '../api';

const History = () => {
    const [activities, setActivities] = useState([]);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await apiRequest('/stock-movements');

                if (data.success) {
                    setActivities(data.movements);
                } else {
                    setError('Unable to load activity history.');
                }
            } catch (err) {
                console.error(err);
                setError('Unable to connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Search and date filtering
    const filteredActivities = activities.filter(activity => {
        const searchText = search.toLowerCase();

        const matchesSearch = [
            activity.product_name,
            activity.sku,
            activity.movement_type,
            activity.note
        ].some(value =>
            String(value || '').toLowerCase().includes(searchText)
        );

        if (!matchesSearch) return false;

        if (dateFilter === 'all') return true;

        const activityDate = new Date(activity.created_at);

        if (Number.isNaN(activityDate.getTime())) return false;

        const now = new Date();

        if (dateFilter === 'today') {
            return activityDate.toDateString() === now.toDateString();
        }

        const days = dateFilter === '7days' ? 7 : 30;
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        return activityDate >= startDate && activityDate <= now;
    });

    return (
        <div className="deshboard">
            <Sidebar />

            <main className="main-content">
                <h1>Activity History</h1>

                <div className="history-card">

                    {/* Search and date filter */}
                    <div className="filters">
                        <div className="search-box">
                            <span>⌕</span>
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                        </select>
                    </div>

                    {/* Activity table */}
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date &amp; Time</th>
                                    <th>User</th>
                                    <th>Product</th>
                                    <th>Action</th>
                                    <th>Quantity</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredActivities.map(activity => (
                                    <tr key={activity.id}>
                                        <td>
                                            {activity.created_at
                                                ? new Date(activity.created_at)
                                                    .toLocaleString()
                                                : '—'}
                                        </td>

                                        <td>—</td>

                                        <td>
                                            {activity.product_name || 'Unknown'}
                                            <br />
                                            <small>{activity.sku || ''}</small>
                                        </td>

                                        <td>
                                            {activity.movement_type === 'in'
                                                ? 'Stock In'
                                                : activity.movement_type === 'out'
                                                    ? 'Stock Out'
                                                    : activity.movement_type}
                                        </td>

                                        <td>{activity.quantity}</td>

                                        <td>{activity.note || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Loading, error and empty messages */}
                    {loading && <p>Loading activity history...</p>}

                    {!loading && error && <p>{error}</p>}

                    {!loading && !error && filteredActivities.length === 0 && (
                        <div className="empty-message">
                            No activity found.
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default History;
