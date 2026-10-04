import Sidebar from "./sidebar";
import '../css/report.css'

function Reports() {
  return (
  <div className="deshboard">
    <Sidebar/>

    {/*MAIN CONTENT*/}

    <main className="main-content">


        <h1>
            Reports Page
        </h1>



        <div className="report-card">


             {/*REPORT TYPE*/}

            <div className="top-report-type">

                <label>
                    Report Type
                </label>


                <select id="reportType">

                    <option value="summary">
                        Report Summary
                    </option>

                    <option value="movement">
                        Stock Movement
                    </option>

                    <option value="lowstock">
                        Low Stock Report
                    </option>

                </select>

            </div>



             {/*FILTER ROW*/}

            <div className="filter-row">


                <div className="filter-item">

                    <label>
                        Report Type
                    </label>


                    <select id="summaryType">

                        <option value="stock-summary">
                            Stock Summary
                        </option>

                    </select>

                </div>



                <div className="filter-item">

                    <label>
                        From Date
                    </label>


                    <input
                        type="date"
                        id="fromDate"
                    />

                </div>



                <div className="filter-item">

                    <label>
                        To Date
                    </label>


                    <input
                        type="date"
                        id="toDate"
                    />

                </div>



               


            </div>

 <button
                    type="button"
                    id="generateBtn"
                    className="generate-btn"
                    onclick="generateReport()">

                    Generate Report

                </button>



                <button
                    id="exportBtn"
                    className="export-btn">

                    Export CSV

                </button>

             {/*TABLE*/}

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

                    </tbody>


                </table>


            </div>



            <div
                id="emptyMessage"
                className="empty-message">

                No report data available.

            </div>


        </div>


    </main>



  </div>

  )
}

export default Reports;