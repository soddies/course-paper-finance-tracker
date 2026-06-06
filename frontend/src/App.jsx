import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import Enter from './pages/enter'; 
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Targets from './pages/Targets';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/enter" element={<Enter />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/categories" element={<Categories/>} />
      <Route path="/targets" element={<Targets />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;