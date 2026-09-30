import { Link } from 'react-router-dom';
import React from 'react'
import Sidebar from './sidebar';
import "../css/lowstock.css"

const LowStock = () => {
  return (
    <div className='deshboard'>
      <Sidebar/>


      
    {/*main content*/}

    <main class="main-content">

        <h1>
            Low Stock Alerts
        </h1>


        <div class="content-card">

            <div class="table-container">

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

                        {/* js will add product here*/}

                    </tbody>
                </table>
            </div>

           {/*no product message*/}
            <div
                id="noLowStock"
                class="no-products">
                All products have sufficient stock.
            </div>
        </div>


    </main>

    </div>
  )
}

export default LowStock;