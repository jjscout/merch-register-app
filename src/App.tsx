import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { SalesRoute } from './pages/SalesRoute';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<SalesRoute />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admin/*" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
