import '../css/dashboard.css'
import Sidebar from "./sidebar";


function Deshboard() {
  return (
<div className="dashboard">

   <Sidebar/>
    <main className="main-content">
        <header className="top-header">
            <div>
                <h1>
                    Good Morning, Admin 👋
                </h1>
                <p>
                    Here's what's happening with your inventory today.
                </p>
            </div>

            <div className="date" id="currentDate">
  {new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</div>
        </header>

        <section className="stats">
            <div className="stat-card">
                <div className="stat-title">
                    <span className="green-icon">✓ Products</span>
                    
                </div>
                <h2 id="totalProducts">0</h2>
                <p className='green-icon'>Total Products</p>
            </div>

            <div className="stat-card">
                <div className="stat-title">
                    <span className='blue-icon'>✓ Stock</span>
                   
                </div>
                <h2 id="totalItems">0</h2>
                <p className='blue-icon'>Total Items</p>
            </div>


            <div className="stat-card">
                <div className="stat-title">
                    <span >⚠ Low Stock</span>
                    
                </div>
                <h2 id="lowStock">0</h2>
                <p>Items</p>
            </div>

            <div className="stat-card">
                <div className="stat-title">
                    <span >⚠ Out of Stock</span>
                    
                </div>
                <h2 id="outOfStock">0</h2>
                <p>Items</p>
            </div>
        </section>


        <section className="dashboard-grid">
            <div className="panel products-panel">
                <div className="panel-header">
                    <h3>
                        Products
                    </h3>
                    <span id="productCount">
                        0 Products
                    </span>
                </div>

                <div className="product-table">
                    <div className="table-header">
                       <span>Product</span>
                        <span>Category</span>
                        <span>Quantity</span>
                        <span>Min Stock</span>
                        <span>Price</span>
                        <span>Status</span>
                    </div>
                    <div id="productList">
                    </div>
                </div>
            </div>


            <div className="right-panels">
                <div className="panel">
                    <div className="panel-header">
                        <h3>
                            Low Stock Products
                        </h3>
                    </div>
                    <div id="lowStockList">
                    </div>
                </div>

                <div className="panel summary-panel">
                   <div className="panel-header">
                        <h3>
                            Inventory Summary
                        </h3>
                    </div>

                    <div className="summary-row">
                        <span>Total Products</span>
                        <strong id="summaryProducts">
                            0
                      </strong>
                    </div>


                    <div className="summary-row">
                        <span>Total Items</span>
                        <strong id="summaryItems">
                            0
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Low Stock</span>
                        <strong id="summaryLow">
                            0
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Out of Stock</span>
                        <strong id="summaryOut">
                            0
                        </strong>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

  )
}

export default Deshboard