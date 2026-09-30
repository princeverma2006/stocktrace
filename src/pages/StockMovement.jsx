import { useState } from 'react'
import Sidebar from './sidebar';
import "../css/stockmovement.css"
const StockMovement = () => {
    const [movementType, setMovementType] = useState('in')

  return (
    <div className='deshboard'>

      <Sidebar/>

      {/*main content*/}
      <main class="main-content">
        <h1 class="page-title">
            Stock Movement
        </h1>
        <div class="movement-layout">
          {/*left side*/}
            <section class="movement-section">
              {/*stock tab*/}
               <div class="movement-tabs">

                    <button
                        id="stockInBtn"
                        className={`tab ${movementType === 'in' ? 'active' : ''}`}
                        onClick={() => setMovementType('in')}>
                        Stock In
                    </button>

                    <button
                        id="stockOutBtn"
                        className={`tab ${movementType === 'out' ? 'active' : ''}`}
                        onClick={() => setMovementType('out')}>
                        Stock Out
                    </button>
                </div>

                {/*form*/}
                <div class="form-card">
                    <form id="movementForm">

                       {/*form*/}
                        <div class="form-group">
                            <label>
                                Product
                            </label>

                            <select
                                id="productSelect"
                                required>

                                <option value="">
                                    Select Product
                                </option>
                            </select>
                        </div>



                        {/*quantity*/}

                        <div class="form-group">
                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                placeholder="Enter quantity"
                                required
                            />

                            <small
                                id="stockInfo">
                            </small>

                        </div>

                       {/*reason*/}
                        <div class="form-group">
                            <label>
                                Reason
                            </label>

                            <select
                                id="reason"
                                required>

                                <option value="">
                                    Select Reason
                                </option>
                            </select>
                        </div>



                        {/*location*/}

                        <div class="form-group">
                            <label>
                                Location
                            </label>

                            <select
                                id="location"
                                required>

                                <option value="">
                                    Select Location
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



                       {/*remark*/}

                        <div class="form-group full-width">
                            <label>
                                Remarks (Optional)
                            </label>

                            <textarea
                                id="remarks"
                                placeholder="Enter remarks">
                            </textarea>

                        </div>


                        {/*submt*/}
                        <div class="submit-area">
                            <button
                                type="submit"
                                class="submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </section>



            {/*right side*/}
            <section class="transactions-section">
                <div class="transactions-card">
                    <h2>
                        Recent Transactions
                    </h2>

                    <div
                        id="transactionsList"
                        class="transactions-list">

                      {/*js will insert the transaction*/}

                    </div>

                </div>
            </section>

        </div>

    </main>

</div>

  )
}

export default StockMovement;