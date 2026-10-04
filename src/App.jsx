import { Navigate, Route, Routes } from 'react-router-dom';
import Landingpage from './pages/LandingPage';
import Loginpage from './pages/LoginPage';
import Deshboard from './pages/Deshboard';
import Product from './pages/Product';
import AddProduct from './pages/AddProduct';
import StockMovement from './pages/StockMovement';
import LowStock from './pages/LowStock';
import History from './pages/History';
import Reports from './pages/Reports';

import './App.css'
function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Landingpage/>}/>
      <Route path="/login" element={<Loginpage/>}/>
      <Route path="/deshboard" element={<Deshboard/>}/>
      <Route path="/products" element={<Product/>}/>
      <Route path="/addproduct" element={<AddProduct/>}/>
      <Route path="/stock-movement" element={<StockMovement/>}/>
      <Route path="/low-stock" element={<LowStock/>}/>
      <Route path="/history" element={<History/>}/>
      <Route path="/reports" element={<Reports/>}/>

      
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
