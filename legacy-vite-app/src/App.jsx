import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dispatch from './pages/Dispatch';
import DriverPortal from './pages/DriverPortal';
import Quotes from './pages/Quotes';
import Invoices from './pages/Invoices';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import CustomerPortal from './pages/CustomerPortal';
import SalesDemo from './pages/SalesDemo';
import Tracking from './pages/Tracking';
import Settings from './pages/Settings';
import VehicleDetail from './pages/VehicleDetail';
import CustomerHealth from './pages/CustomerHealth';
import Implementation from './pages/Implementation';
import { PresenterModeProvider } from './context/PresenterModeContext';

export default function App() {
  return (
    <PresenterModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />
            <Route path="customer-health" element={<CustomerHealth />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="dispatch" element={<Dispatch />} />
            <Route path="driver" element={<DriverPortal />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="customer-portal" element={<CustomerPortal />} />
            <Route path="sales-demo" element={<SalesDemo />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="implementation" element={<Implementation />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PresenterModeProvider>
  );
}
