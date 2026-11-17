import { useEffect, useState } from 'react';
import Sidebar from "./sidebar";
import '../css/report.css';
import { apiRequest } from '../api';

const fetchReport = (type, fromDate, toDate) => {
    const params = new URLSearchParams({ type, fromDate, toDate });
    return apiRequest(`/reports?${params.toString()}`);
};

function Reports() {
    const [reportType, setReportType] = useState('summary');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [appliedDates, setAppliedDates] = useState({
        fromDate: '',
        toDate: ''
    });
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('No report data available.');

    useEffect(() => {
        let active = true;

        const loadReport = async () => {
            try {
                const data = await fetchReport(
                    reportType,
                    appliedDates.fromDate,
                    appliedDates.toDate
                );

                if (!data.success) {
                    throw new Error(data.message || 'Unable to generate report.');
                }

                if (active) {
                    const reportData = data.report || [];
                    setReport(reportData);
                    setMessage(reportData.length ? '' : 'No report data available.');
                }
            } catch (error) {
                if (active) {
                    setReport([]);
                    setMessage(error.message || 'Unable to generate report.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        if (
            appliedDates.fromDate &&
            appliedDates.toDate &&
            appliedDates.fromDate > appliedDates.toDate
        ) {
            return () => {
                active = false;
            };
        }

        loadReport();

        return () => {
            active = false;
        };
    }, [reportType, appliedDates]);

    const invalidDateRange = fromDate && toDate && fromDate > toDate;
    const searchTerm = productSearch.trim().toLowerCase();
    const visibleReport = invalidDateRange
        ? []
        : report.filter(item =>
            String(item.product || '').toLowerCase().includes(searchTerm) ||
            String(item.sku || '').toLowerCase().includes(searchTerm)
        );
    const applyDateRange = (event) => {
        event.preventDefault();
        if (invalidDateRange) return;

        setLoading(true);
        setAppliedDates({ fromDate, toDate });
    };

    const clearDateRange = () => {
        setFromDate('');
        setToDate('');
        setLoading(true);
        setAppliedDates({ fromDate: '', toDate: '' });
    };

    return (
        <div className="deshboard">
            <Sidebar />

            <main className="main-content">
                <h1>Reports Page</h1>

                <div className="report-card">
                    <div className="top-report-type">
                        <label>Report Type</label>

                        <select
                            id="reportType"
                            value={reportType}
                            onChange={e => {
                                setLoading(true);
                                setReportType(e.target.value);
                            }}
                        >
                            <option value="summary">Report Summary</option>
                            <option value="movement">Stock Movement</option>
                            <option value="lowstock">Low Stock Report</option>
                        </select>
                    </div>

                    <form className="filter-row" onSubmit={applyDateRange}>
                        <div className="filter-item">
                            <label>Report Type</label>

                            <select id="summaryType" defaultValue="stock-summary">
                                <option value="stock-summary">
                                    Stock Summary
                                </option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label htmlFor="fromDate">From Date</label>

                            <input
                                type="date"
                                id="fromDate"
                                max={toDate || undefined}
                                value={fromDate}
                                onChange={e => setFromDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-item">
                            <label htmlFor="toDate">To Date</label>

                            <input
                                type="date"
                                id="toDate"
                                min={fromDate || undefined}
                                value={toDate}
                                onChange={e => setToDate(e.target.value)}
                            />
                        </div>

                        <div className="date-filter-actions">
                            <button type="submit" disabled={Boolean(invalidDateRange)}>
                                Apply Dates
                            </button>
                            <button type="button" onClick={clearDateRange}>
                                Clear Dates
                            </button>
                        </div>
                    </form>

                    <div className="report-search">
                        <label htmlFor="productSearch">Search Products</label>
                        <input
                            type="search"
                            id="productSearch"
                            placeholder="Name or SKU"
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Opening Stock</th>
                                    <th>Stock In</th>
                                    <th>Stock Out</th>
                                    <th>Closing Stock</th>
                                    <th>Value (₹)</th>
                                </tr>
                            </thead>

                            <tbody id="reportTable">
                                {visibleReport.map((item, index) => (
                                    <tr key={`${item.sku}-${index}`}>
                                        <td>{item.product}</td>
                                        <td>{item.opening_stock}</td>
                                        <td>{item.stock_in}</td>
                                        <td>{item.stock_out}</td>
                                        <td>{item.closing_stock}</td>
                                        <td>
                                            {Number(item.value).toLocaleString(
                                                'en-IN',
                                                {
                                                    style: 'currency',
                                                    currency: 'INR'
                                                }
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {invalidDateRange && (
                        <div id="emptyMessage" className="empty-message">
                            From Date cannot be after To Date.
                        </div>
                    )}

                    {(!loading && !invalidDateRange && visibleReport.length === 0) && (
                        <div id="emptyMessage" className="empty-message">
                            {report.length > 0
                                ? 'No products match your search.'
                                : message}
                        </div>
                    )}

                    {loading && <p>Loading report...</p>}
                </div>
            </main>
        </div>
    );
}

export default Reports;
