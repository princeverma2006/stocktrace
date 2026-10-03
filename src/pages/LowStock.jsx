import Sidebar from './sidebar';
import "../css/lowstock.css"

const LowStock = () => {
  return (
    <div className='deshboard'>
      <Sidebar/>


      
    {/*main content*/}

    <main className="main-content">

        <h1>
            Low Stock Alerts
        </h1>


        <div className="content-card">

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

                        {/* js will add product here*/}

                    </tbody>
                </table>
            </div>

           {/*no product message*/}
            <div
                id="noLowStock"
                className="no-products">
                All products have sufficient stock.
            </div>
        </div>


    </main>

    </div>
  )
}

export default LowStock;