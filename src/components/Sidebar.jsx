import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Package,
  MapPin,
  Settings,
  Menu,
  X,
  Send,
  Smartphone,
  FileText,
  DollarSign,
  Wrench,
  BarChart3,
  Building2,
  MessageSquareShare,
  Presentation,
  HeartHandshake,
  Rocket,
} from 'lucide-react';
import { useState } from 'react';
import { usePresenterMode } from '../context/PresenterModeContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/vehicles', icon: Truck },
  { name: 'Customer Health', href: '/customer-health', icon: HeartHandshake },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Jobs', href: '/jobs', icon: Package },
  { name: 'Dispatch', href: '/dispatch', icon: Send },
  { name: 'Driver App', href: '/driver', icon: Smartphone },
  { name: 'Quotes', href: '/quotes', icon: FileText },
  { name: 'Invoices', href: '/invoices', icon: DollarSign },
  { name: 'Customers', href: '/customers', icon: Building2 },
  { name: 'Customer Portal', href: '/customer-portal', icon: MessageSquareShare },
  { name: 'Sales Demo', href: '/sales-demo', icon: Presentation },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Tracking', href: '/tracking', icon: MapPin },
  { name: 'Implementation', href: '/implementation', icon: Rocket },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scenario, setPanelOpen } = usePresenterMode();

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">PX</span>
            <span className="logo-text">Pine X</span>
          </div>
          <button type="button" className="action-btn small" onClick={() => setPanelOpen(true)}>
            Demo
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="company-info">
            <span className="company-name">Pine X Logistics</span>
            <span className="company-tag">Command Centre</span>
          </div>
          <span className="sidebar-scenario-chip">{scenario.name}</span>
        </div>
      </aside>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
