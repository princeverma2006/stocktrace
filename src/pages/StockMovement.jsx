import { useState } from 'react'
import Sidebar from './sidebar';
import "../css/stockmovement.css"
const StockMovement = () => {
    const [movementType, setMovementType] = useState('in')

  return (
    <div className='deshboard'>

      <Sidebar/>

      {/*main content*/}
            <main className="main-content">
                <h1 className="page-title">
            Stock Movement
        </h1>
        <div className="movement-layout">
          {/*left side*/}
            <section className="movement-section">
              {/*stock tab*/}
               <div className="movement-tabs">

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
                <div className="form-card">
                    <form id="movementForm">

                       {/*form*/}
                        <div className="form-group">
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

                        <div className="form-group">
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
                        <div className="form-group">
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

                        <div className="form-group">
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

                        <div className="form-group full-width">
                            <label>
                                Remarks (Optional)
                            </label>

                            <textarea
                                id="remarks"
                                placeholder="Enter remarks">
                            </textarea>

                        </div>


                        {/*submt*/}
                        <div className="submit-area">
                            <button
                                type="submit"
                                className="submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </section>



            {/*right side*/}
            <section className="transactions-section">
                <div className="transactions-card">
                    <h2>
                        Recent Transactions
                    </h2>

                    <div
                        id="transactionsList"
                        className="transactions-list">

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