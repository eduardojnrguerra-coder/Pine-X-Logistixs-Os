import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { usePresenterMode } from '../context/PresenterModeContext';
import PineXLogo from './PineXLogo';
import ScenarioBadge from './ScenarioBadge';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { scenario } = usePresenterMode();

  return (
    <header className="header">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search jobs, drivers, vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <PineXLogo className="header-brand-badge" showText={false} />
        <ScenarioBadge scenario={scenario} compact />
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-menu">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Operations</span>
          </div>
        </div>
      </div>
    </header>
  );
}
