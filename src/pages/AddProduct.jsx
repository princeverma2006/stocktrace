import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from './sidebar'
import '../css/addproduct.css'


const AddProduct = () => {
  const navigate= useNavigate();
  return (
    <div className='deshboard'>
      <Sidebar/>
      {/*main*/}
      <main className='main-content'>

        {/*page title*/}
        <div className='page-title'>
         <button
                class="back-btn"
                onClick={() => navigate("/products")}>
                ←
            </button>
        <h1 id='formTitle'>Add new product</h1>
        </div>

        {/*form*/}
        <div className='form-container'>
          <form id='productForm'>
            {/*prpduct name*/}
            <div className='form-group'>
              <label>Product name</label>
              <input type="
              text" id='productName'
               placeholder="Enter product name" 
               required />
              </div>

              {/*SKU stock keeping unit*/}
               <div className="form-group">

                    <label>
                        SKU(stock keeping unit)
                    </label>

                    <input
                        type="text"
                        id="sku"
                        placeholder="Enter SKU"
                        required
                    />
              </div>

              {/*category*/}
               <div className="form-group">

                    <label>
                        Category
                    </label>

                    <select
                        id="category"
                        required>

                        <option value="">
                            Select Category
                        </option>

                    </select>
                </div>

                {/*price*/}
                 <div className="form-group">

                    <label>
                        Unit Price (₹)
                    </label>

                    <input
                        type="number"
                        id="price"
                        placeholder="Enter price"
                        min="0"
                        required
                    />
                </div>

              {/*current stock*/}
                <div className="form-group">

                    <label>
                        Current Stock
                    </label>

                    <input
                        type="number"
                        id="quantity"
                        placeholder="Enter current stock"
                        min="0"
                        required
                    />
                    </div>

                  {/*minimum stock*/}
                   <div className="form-group">

                    <label>
                        Minimum Stock
                    </label>

                    <input
                        type="number"
                        id="minStock"
                        placeholder="Enter minimum stock"
                        min="0"
                        required
                    />
                </div>

                {/*location*/}
                <div className="form-group">
                    <label>
                        Location
                    </label>
                    <select id="location">
                        <option value="">
                            Select location
                        </option>
                        <option value="Warehouse">
                            Warehouse
                        </option>
                        <option value="Store">
                            Store
                        </option>
                        <option value="Office">
                            Office
                        </option>
                    </select>
                </div>

                {/*discription*/}
                 <div className="form-group description">
                    <label>
                        Description
                    </label>
                    <textarea
                        id="description"
                        placeholder="Enter product description">
                    </textarea>
                </div>

                  {/*buttons*/}
                 <div class="form-buttons">
                    <button
                        type="button"
                        class="cancel-btn"
                        onClick={()=>navigate("/products")}>
                        Cancel
                    </button>

                     <div class="form-buttons">

                    <button
                        type="submit"
                        class="save-btn">
                        Save Product
                    </button>
                </div>

            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddProduct;