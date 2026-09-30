import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from "./sidebar"
import '../css/product.css'

const Product = () => {

  const navigate = useNavigate();
  return (
    <>
    <div className='deshboard'>
    <Sidebar/>
    {/*main container*/}
    <main className='main-content'>
      {/*header*/}
      <div className='page-header'>
        <h1>Product</h1>
        <button className='add-product-btn' onClick={() => navigate("/addproduct")}>
          <span>+</span>
          
          Add product
        </button>
    </div>
        {/*product panel*/}
        <div className='product-panel'>
          {/*search and filter*/}
        <div className='filters'>
          <div className='search-box'>
          <span>⌕</span>
          <input type="text" id='searchInput' placeholder='Search product....' />
        </div>


        <select id="categoryFilter">
          <option value="all">
            All categories
          </option>
        </select>

        <select id="statusFilter">
          <option value="all">
            All status
          </option>
          <option value="good">
               Good
            </option>
          <option value="low">
            Low
          </option>
          <option value="out">
            Out of stock
          </option>
        </select>

      </div>

{/*table*/}
<div className='table-container'>
  <table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Product name</th>
        <th>Category</th>
        <th>Stock</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody id='productTable'>
      {/*product add from database*/}
    </tbody>
  </table>
</div>
 
 {/*footer*/}
 <div className='table-footer'>
  <span id='entryText'>
    showing 0 entries
  </span>

  <div className='pagination'>
    <button disabled>
      previous
    </button>
    <button className='current'>
      1
    </button>
    <button disabled>
      next
    </button>
  </div>
 </div>
 </div>

    </main>
    </div>
    </>
  )
}

export default Product;
