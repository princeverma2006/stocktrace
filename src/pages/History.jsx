import React from 'react'
import { Link } from 'react-router-dom'
import Sidebar from "./sidebar"
import '../css/history.css'
const History = () => {
  return (

    <div className='deshboard'>
      <Sidebar/>
      
  {/*main content*/}
    <main class="main-content">
        <h1>
            Activity History
        </h1>
        <div class="history-card">

            {/* SEARCH + DATE */}
            <div class="filters">
                <div class="search-box">
                    <span>⌕</span>
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search activities..."
                    />

                </div>

                <select id="dateFilter">
                    <option value="all">
                        All Dates
                    </option>
                    <option value="today">
                        Today
                    </option>
                    <option value="7days">
                        Last 7 Days
                    </option>
                    <option value="30days">
                        Last 30 Days
                    </option>
                </select>

            </div>

            {/* TABLE */}
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Action</th>
                            <th>Quantity</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>

                    <tbody id="historyTable">
                        {/* JavaScript adds records here */}
                    </tbody>

                </table>

            </div>

            {/* EMPTY MESSAGE */}
            <div
                id="emptyMessage"
                class="empty-message">
                No activity found.
            </div>

        </div>

    </main>
    </div>
  )
}

export default History