import { useEffect, useMemo, useState } from 'react';
import { Bell, Building2, Database, Shield, Users } from 'lucide-react';
import SettingsSection from '../components/SettingsSection';
import TrackerProviderCard from '../components/TrackerProviderCard';
import IntegrationStatusBadge from '../components/IntegrationStatusBadge';
import SyncLogPanel from '../components/SyncLogPanel';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  SETTINGS_COMPANY_PROFILE,
  SETTINGS_DEMO_USERS,
  SETTINGS_INVOICE_DEFAULTS,
  SETTINGS_NOTIFICATION_DEFAULTS,
  SETTINGS_USER_ROLES,
} from '../data/demoData';
import { clearSyncLogs, getSyncLogs } from '../services/syncLogs';
import { TRACKING_MODES, trackingService } from '../services/trackingService';

export default function Settings() {
  const { scenario } = usePresenterMode();
  const [companyProfile, setCompanyProfile] = useState(SETTINGS_COMPANY_PROFILE);
  const [users, setUsers] = useState(SETTINGS_DEMO_USERS);
  const [notifications, setNotifications] = useState(SETTINGS_NOTIFICATION_DEFAULTS);
  const [invoiceSettings, setInvoiceSettings] = useState(SETTINGS_INVOICE_DEFAULTS);
  const [mode, setMode] = useState(trackingService.getMode());
  const [providerConfigs, setProviderConfigs] = useState(trackingService.getProviderConfigs());
  const [settingsFeedback, setSettingsFeedback] = useState('');
  const [syncLogs, setSyncLogs] = useState(getSyncLogs());
  const [showLogs, setShowLogs] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    const unsubscribe = trackingService.subscribeToSettings((snapshot) => {
      setMode(snapshot.mode);
      setProviderConfigs(snapshot.providerConfigs);
      setSyncLogs(getSyncLogs());
    });
    return unsubscribe;
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const query = userSearch.toLowerCase();
        const matchesSearch = userSearch === '' || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
        const matchesRole = roleFilter === '' || user.role === roleFilter;
        return matchesSearch && matchesRole;
      }),
    [roleFilter, userSearch, users]
  );

  const handleProviderSave = (updatedConfig) => {
    trackingService.updateProviderConfig(updatedConfig.provider, updatedConfig);
    setProviderConfigs(trackingService.getProviderConfigs());
    setSettingsFeedback(`${updatedConfig.providerName} settings saved locally.`);
    setSyncLogs(getSyncLogs());
  };

  const handleProviderTest = async (updatedConfig) => {
    trackingService.updateProviderConfig(updatedConfig.provider, updatedConfig);
    const result = await trackingService.testConnection(updatedConfig.provider);
    setProviderConfigs(trackingService.getProviderConfigs());
    setSettingsFeedback(result.message);
    setSyncLogs(getSyncLogs());
    return result;
  };

  const handleRunSyncTest = async () => {
    await trackingService.runSyncTest(trackingService.getProvider());
    setProviderConfigs(trackingService.getProviderConfigs());
    setSyncLogs(getSyncLogs());
    setSettingsFeedback('Mock sync test completed and new sync logs were recorded.');
  };

  return (
    <div className="page-container settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Company setup, provider handshakes, sync logs, and safe frontend-ready integration structure.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="settings-overview-grid">
        <div className="stat-card"><div className="stat-header"><div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}><Building2 size={20} style={{ color: '#2563eb' }} /></div></div><div className="stat-value">{companyProfile.companyName}</div><div className="stat-label">Company Profile</div></div>
        <div className="stat-card"><div className="stat-header"><div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}><Users size={20} style={{ color: '#16a34a' }} /></div></div><div className="stat-value">{users.filter((user) => user.active).length}</div><div className="stat-label">Active Users</div></div>
        <div className="stat-card"><div className="stat-header"><div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}><Database size={20} style={{ color: '#d97706' }} /></div></div><div className="stat-value">{mode === TRACKING_MODES.DEMO ? 'Demo Mode' : 'Live Mode'}</div><div className="stat-label">Tracking Data Mode</div></div>
        <div className="stat-card"><div className="stat-header"><div className="stat-icon" style={{ backgroundColor: '#ede9fe' }}><Bell size={20} style={{ color: '#7c3aed' }} /></div></div><div className="stat-value">{syncLogs.length}</div><div className="stat-label">Sync Log Events</div></div>
      </div>

      {settingsFeedback && <div className="settings-feedback global">{settingsFeedback}</div>}

      <SettingsSection title="Company Profile" description="Basic company details used across invoices, quotes, and customer-facing views." action={<button className="primary-button" onClick={() => setSettingsFeedback('Company profile updated locally.')}>Save</button>}>
        <div className="settings-form-grid">
          <div className="form-group"><label>Company name</label><input type="text" value={companyProfile.companyName} onChange={(event) => setCompanyProfile({ ...companyProfile, companyName: event.target.value })} /></div>
          <div className="form-group"><label>Registration number</label><input type="text" value={companyProfile.registrationNumber} onChange={(event) => setCompanyProfile({ ...companyProfile, registrationNumber: event.target.value })} /></div>
          <div className="form-group"><label>VAT number</label><input type="text" value={companyProfile.vatNumber} onChange={(event) => setCompanyProfile({ ...companyProfile, vatNumber: event.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input type="text" value={companyProfile.phone} onChange={(event) => setCompanyProfile({ ...companyProfile, phone: event.target.value })} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={companyProfile.email} onChange={(event) => setCompanyProfile({ ...companyProfile, email: event.target.value })} /></div>
          <div className="form-group full-width"><label>Address</label><input type="text" value={companyProfile.address} onChange={(event) => setCompanyProfile({ ...companyProfile, address: event.target.value })} /></div>
        </div>
      </SettingsSection>

      <SettingsSection title="Users & Roles" description="Search staff, filter by role, and toggle local active status.">
        <div className="page-actions">
          <div className="search-filter">
            <div className="search-input-wrapper"><input type="text" placeholder="Search users..." value={userSearch} onChange={(event) => setUserSearch(event.target.value)} /></div>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="filter-select">
              <option value="">All roles</option>
              {SETTINGS_USER_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table full-width">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><IntegrationStatusBadge status={user.active ? 'Connected' : 'Not Connected'} /></td>
                  <td><button className="action-btn small" onClick={() => setUsers((prev) => prev.map((item) => item.id === user.id ? { ...item, active: !item.active } : item))}>Set {user.active ? 'inactive' : 'active'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      <SettingsSection title="Tracker Providers" description="Provider auth flow mock, persistent sync logs, and a safe frontend integration structure.">
        <div className="settings-mode-toggle">
          <button className={`action-btn small ${mode === TRACKING_MODES.DEMO ? 'primary' : ''}`} onClick={() => trackingService.setMode(TRACKING_MODES.DEMO)}>Demo Mode</button>
          <button className={`action-btn small ${mode === TRACKING_MODES.LIVE ? 'primary' : ''}`} onClick={() => trackingService.setMode(TRACKING_MODES.LIVE)}>Live Provider Mode</button>
          <button className="action-btn small" onClick={() => setShowLogs((prev) => !prev)}>{showLogs ? 'Hide Sync Logs' : 'View Sync Logs'}</button>
        </div>
        <div className="live-mode-warning">Real credentials must be stored and processed server-side in production.</div>
        <div className="tracker-provider-grid">
          {Object.values(providerConfigs).map((config) => (
            <TrackerProviderCard key={`${config.provider}-${config.status}-${config.lastSynced || 'never'}`} config={config} onSave={handleProviderSave} onTestConnection={handleProviderTest} />
          ))}
        </div>
        {showLogs && <SyncLogPanel logs={syncLogs} onRunSyncTest={handleRunSyncTest} onClearLogs={() => { clearSyncLogs(); setSyncLogs([]); }} />}
      </SettingsSection>

      <SettingsSection title="Notification Settings" description="Choose which operational events should raise visible alerts.">
        <div className="toggle-grid">
          {Object.entries({
            delayedDelivery: 'Delayed delivery',
            trackerOffline: 'Tracker offline',
            maintenanceDue: 'Maintenance due',
            licenceExpiring: 'Licence expiring',
            invoiceOverdue: 'Invoice overdue',
            podUploaded: 'POD uploaded',
            driverReportedIssue: 'Driver reported issue',
            quoteAccepted: 'Quote accepted',
          }).map(([key, label]) => (
            <button key={key} className={`toggle-card ${notifications[key] ? 'enabled' : ''}`} onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}>
              <span>{label}</span>
              <strong>{notifications[key] ? 'On' : 'Off'}</strong>
            </button>
          ))}
        </div>
      </SettingsSection>

      <div className="settings-two-column">
        <SettingsSection title="Invoice Settings" description="Finance defaults applied to billing documents.">
          <div className="settings-form-grid">
            <div className="form-group"><label>Default invoice terms</label><input type="text" value={invoiceSettings.defaultInvoiceTerms} onChange={(event) => setInvoiceSettings({ ...invoiceSettings, defaultInvoiceTerms: event.target.value })} /></div>
            <div className="form-group"><label>Payment due days</label><input type="number" value={invoiceSettings.paymentDueDays} onChange={(event) => setInvoiceSettings({ ...invoiceSettings, paymentDueDays: Number(event.target.value) })} /></div>
            <div className="form-group"><label>Invoice prefix</label><input type="text" value={invoiceSettings.invoicePrefix} onChange={(event) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: event.target.value })} /></div>
            <div className="form-group"><label>Quote prefix</label><input type="text" value={invoiceSettings.quotePrefix} onChange={(event) => setInvoiceSettings({ ...invoiceSettings, quotePrefix: event.target.value })} /></div>
          </div>
        </SettingsSection>

        <SettingsSection title="VAT Settings" description="Tax defaults used for invoicing and quotation calculations.">
          <div className="settings-form-grid">
            <div className="form-group"><label>VAT rate</label><input type="number" value={invoiceSettings.vatRate} onChange={(event) => setInvoiceSettings({ ...invoiceSettings, vatRate: Number(event.target.value) })} /></div>
          </div>
        </SettingsSection>
      </div>

      <SettingsSection title="Security Settings" description="Current access posture and placeholder notes for production hardening.">
        <div className="security-grid">
          <div className="security-item"><Shield size={18} /><div><strong>Role-based access control enabled</strong><p>Owner, ops, finance, driver, and maintenance responsibilities are separated.</p></div></div>
          <div className="security-item"><Shield size={18} /><div><strong>Driver portal limited access</strong><p>Drivers only see assigned jobs, vehicle tasks, and message updates.</p></div></div>
          <div className="security-item"><Shield size={18} /><div><strong>Customer portal limited access</strong><p>Customers only see their own deliveries, invoices, and portal actions.</p></div></div>
          <div className="security-item"><Shield size={18} /><div><strong>API keys stored server-side placeholder note</strong><p>Production credentials should live in secured backend secrets, not the client application.</p></div></div>
        </div>
      </SettingsSection>
    </div>
  );
}
