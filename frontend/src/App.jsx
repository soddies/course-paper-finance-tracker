import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import Enter from './pages/enter'; 
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

const PlaceholderPage = ({title}) => (
  <div style={{padding: '40px', textAlign: 'center'}}>
    <h1>{title}</h1>
    <p>В разработке...</p>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/enter" element={<Enter />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/budgets" element={<PlaceholderPage title="Бюджеты" />} />
      <Route path="/categories" element={<PlaceholderPage title="Категории" />} />
      <Route path="/analytics" element={<PlaceholderPage title="Аналитика" />} />
      <Route path="/profile" element={<PlaceholderPage title="Профиль" />} />
    </Routes>
  );
}

export default App;