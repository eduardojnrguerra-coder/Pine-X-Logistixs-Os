import { useState } from 'react';
import {
  MapPin,
  Package,
  User,
  Phone,
  Camera,
  FileSignature,
  Clock,
  AlertTriangle,
  Navigation,
  Fuel,
  ClipboardList,
  Lightbulb,
  FileText,
  Check,
} from 'lucide-react';
import { JOBS, DRIVERS, getCustomerById, getVehicleById } from '../data/demoData';

export default function DriverPortal() {
  const [jobs, setJobs] = useState(JOBS);
  const [selectedDriverId, setSelectedDriverId] = useState('D001');
  const [currentJob, setCurrentJob] = useState(null);
  const [showPOD, setShowPOD] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [podData, setPodData] = useState({
    photo: null,
    signature: null,
    notes: '',
    timestamp: null,
    gpsLat: null,
    gpsLng: null,
  });
  const [checklist, setChecklist] = useState({
    tyres: false,
    lights: false,
    fuel: false,
    loadSecured: false,
    documents: false,
  });

  const driver = DRIVERS.find((d) => d.id === selectedDriverId);
  const vehicle = driver ? getVehicleById(driver.assignedVehicleId) : null;
  const assignedJobs = jobs.filter(
    (j) => j.assignedDriverId === selectedDriverId && 
    ['Scheduled', 'Dispatched', 'On Route', 'At Pickup', 'Loaded', 'At Dropoff'].includes(j.status)
  );
  const activeJob = currentJob || assignedJobs[0];
  const customer = activeJob ? getCustomerById(activeJob.customerId) : null;

  const getNextActions = () => {
    if (!activeJob) return [];
    const status = activeJob.status;
    
    if (status === 'Scheduled') {
      return [{ key: 'dispatch', label: 'Dispatched', action: 'Dispatched' }];
    }
    if (status === 'Dispatched') {
      return [{ key: 'start', label: 'Start Job', status: 'On Route', action: 'On Route' }];
    }
    if (status === 'On Route') {
      return [{ key: 'arrived_pickup', label: 'Arrived at Pickup', status: 'At Pickup', action: 'At Pickup' }];
    }
    if (status === 'At Pickup') {
      return [{ key: 'loaded', label: 'Loaded', status: 'Loaded', action: 'Loaded' }];
    }
    if (status === 'Loaded') {
      return [{ key: 'start_delivery', label: 'Start Delivery', status: 'On Route', action: 'On Route' }];
    }
    if (status === 'On Route') {
      return [{ key: 'arrived_dropoff', label: 'Arrived at Dropoff', status: 'At Dropoff', action: 'At Dropoff' }];
    }
    if (status === 'At Dropoff') {
      return [{ key: 'delivered', label: 'Mark Delivered', status: 'Delivered', action: 'Delivered' }];
    }
    return [];
  };

  const handleStatusUpdate = (newStatus) => {
    if (!activeJob) return;
    setJobs((prev) =>
      prev.map((job) =>
        job.id === activeJob.id ? { ...job, status: newStatus } : job
      )
    );
  };

  const handleSubmitPOD = () => {
    const now = new Date();
    setPodData({
      ...podData,
      timestamp: now.toISOString(),
      gpsLat: -26.2041 + (Math.random() - 0.5) * 0.01,
      gpsLng: 28.0473 + (Math.random() - 0.5) * 0.01,
    });
    if (activeJob) {
      handleStatusUpdate('Delivered');
    }
    setShowPOD(false);
  };

  const handleToggleChecklist = (item) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const canSubmitPOD = Object.values(checklist).every(Boolean);

  return (
    <div className="driver-portal">
      <div className="page-header">
        <h1>Driver App</h1>
        <p>Mobile Portal</p>
      </div>

      <div className="driver-selector">
        <label>Select Driver</label>
        <select
          value={selectedDriverId}
          onChange={(e) => {
            setSelectedDriverId(e.target.value);
            setCurrentJob(null);
          }}
        >
          {DRIVERS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} - {d.status}
            </option>
          ))}
        </select>
      </div>

      {driver && (
        <div className="driver-info-card">
          <div className="driver-avatar-large">
            {driver.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="driver-details">
            <h3>{driver.name}</h3>
            <p>Licence: {driver.licenceCode}</p>
            {vehicle && <p>Vehicle: {vehicle.registration}</p>}
            <span className={`status-badge ${driver.status === 'On Duty' || driver.status === 'Available' ? 'active' : 'idle'}`}>
              {driver.status}
            </span>
          </div>
        </div>
      )}

      <div className="assigned-jobs-list">
        <h3>Today's Jobs ({assignedJobs.length})</h3>
        {assignedJobs.map((job) => {
          const cust = getCustomerById(job.customerId);
          return (
            <div
              key={job.id}
              className={`job-summary-card ${activeJob?.id === job.id ? 'active' : ''}`}
              onClick={() => setCurrentJob(job)}
            >
              <div className="job-header">
                <span className="job-number">{job.jobNumber}</span>
                <span className={`status-badge ${job.status.toLowerCase().replace(' ', '-')}`}>
                  {job.status}
                </span>
              </div>
              <div className="job-customer">{cust?.name}</div>
              <div className="job-route-mini">
                {job.pickupLocation} → {job.dropoffLocation}
              </div>
            </div>
          );
        })}
        {assignedJobs.length === 0 && (
          <div className="empty-jobs">No jobs assigned</div>
        )}
      </div>

      {activeJob && customer && (
        <div className="current-job-card">
          <div className="current-job-header">
            <h3>Current Job</h3>
            <span className="job-number">{activeJob.jobNumber}</span>
          </div>

          <div className="job-section">
            <h4>
              <MapPin size={16} />
              Pickup
            </h4>
            <p className="location">{activeJob.pickupLocation}</p>
          </div>

          <div className="job-section">
            <h4>
              <MapPin size={16} />
              Drop-off
            </h4>
            <p className="location">{activeJob.dropoffLocation}</p>
          </div>

          <div className="job-section">
            <h4>
              <Package size={16} />
              Cargo
            </h4>
            <p>{activeJob.cargo}</p>
            <p className="qty">{activeJob.quantity}</p>
          </div>

          <div className="job-section">
            <h4>
              <User size={16} />
              Customer
            </h4>
            <p>{customer.name}</p>
            <p className="contact">{customer.contact}</p>
            <a href={`tel:${customer.phone}`} className="call-btn">
              <Phone size={16} />
              Call
            </a>
          </div>

          <div className="status-actions">
            <h4>Status Actions</h4>
            <div className="action-buttons">
              {getNextActions().map((action) => (
                <button
                  key={action.key}
                  className={`status-btn ${action.status === 'Delivered' ? 'success' : ''}`}
                  onClick={() => {
                    if (action.status === 'Delivered') {
                      setShowPOD(true);
                    } else {
                      handleStatusUpdate(action.action);
                    }
                  }}
                >
                  <Navigation size={20} />
                  {action.label}
                </button>
              ))}
              <button
                className="status-btn delay"
                onClick={() => handleStatusUpdate('Delayed')}
              >
                <AlertTriangle size={20} />
                Report Delay
              </button>
            </div>
          </div>

          <button
            className="checklist-toggle"
            onClick={() => setShowChecklist(!showChecklist)}
          >
            <ClipboardList size={18} />
            Vehicle Checklist
          </button>

          {showChecklist && (
            <div className="checklist-panel">
              <h4>Pre-Trip Vehicle Checklist</h4>
              <div className="checklist-items">
                <button
                  className={`checklist-item ${checklist.tyres ? 'checked' : ''}`}
                  onClick={() => handleToggleChecklist('tyres')}
                >
                  <span className="check-icon">
                    {checklist.tyres ? <Check size={18} /> : <span className="empty-check" />}
                  </span>
                  <span className="check-icon-wrap">
                    <span className="check-icon-svg">
                      <Lightbulb size={16} />
                    </span>
                  </span>
                  <span>Tyres checked</span>
                </button>
                <button
                  className={`checklist-item ${checklist.lights ? 'checked' : ''}`}
                  onClick={() => handleToggleChecklist('lights')}
                >
                  <span className="check-icon">
                    {checklist.lights ? <Check size={18} /> : <span className="empty-check" />}
                  </span>
                  <span>Lights checked</span>
                </button>
                <button
                  className={`checklist-item ${checklist.fuel ? 'checked' : ''}`}
                  onClick={() => handleToggleChecklist('fuel')}
                >
                  <span className="check-icon">
                    {checklist.fuel ? <Check size={18} /> : <span className="empty-check" />}
                  </span>
                  <span className="check-icon-wrap">
                    <Fuel size={16} />
                  </span>
                  <span>Fuel level checked</span>
                </button>
                <button
                  className={`checklist-item ${checklist.loadSecured ? 'checked' : ''}`}
                  onClick={() => handleToggleChecklist('loadSecured')}
                >
                  <span className="check-icon">
                    {checklist.loadSecured ? <Check size={18} /> : <span className="empty-check" />}
                  </span>
                  <span className="check-icon-wrap">
                    <Package size={16} />
                  </span>
                  <span>Load secured</span>
                </button>
                <button
                  className={`checklist-item ${checklist.documents ? 'checked' : ''}`}
                  onClick={() => handleToggleChecklist('documents')}
                >
                  <span className="check-icon">
                    {checklist.documents ? <Check size={18} /> : <span className="empty-check" />}
                  </span>
                  <span className="check-icon-wrap">
                    <FileText size={16} />
                  </span>
                  <span>Documents checked</span>
                </button>
              </div>
              <p className="checklist-status">
                {canSubmitPOD ? 'All items checked ✓' : 'Complete all items to deliver'}
              </p>
            </div>
          )}
        </div>
      )}

      {showPOD && (
        <div className="pod-modal">
          <div className="pod-content">
            <h3>Proof of Delivery</h3>
            
            <div className="pod-section">
              <h4>
                <Camera size={18} />
                Delivery Photo
              </h4>
              <div className="upload-placeholder">
                {podData.photo ? (
                  <img src={podData.photo} alt="Delivery" className="uploaded-img" />
                ) : (
                  <>
                    <Camera size={32} />
                    <span>Tap to upload photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const mockUrl = URL.createObjectURL(file);
                      setPodData({ ...podData, photo: mockUrl });
                    }
                  }}
                />
              </div>
            </div>

            <div className="pod-section">
              <h4>
                <FileSignature size={18} />
                Signature
              </h4>
              <div className="signature-placeholder">
                {podData.signature ? (
                  <div className="signature-display">{podData.signature}</div>
                ) : (
                  <>
                    <p>Customer signature here</p>
                    <span>Tap to sign</span>
                  </>
                )}
                <button
                  className="sign-btn"
                  onClick={() => setPodData({ ...podData, signature: driver?.name || 'Signed' })}
                >
                  Sign with my name
                </button>
              </div>
            </div>

            <div className="pod-section">
              <h4>
                <FileText size={18} />
                Delivery Notes
              </h4>
              <textarea
                placeholder="Add notes about the delivery..."
                value={podData.notes}
                onChange={(e) => setPodData({ ...podData, notes: e.target.value })}
              />
            </div>

            <div className="pod-section">
              <h4>
                <Clock size={18} />
                Timestamp
              </h4>
              <p className="pod-timestamp">
                {podData.timestamp
                  ? new Date(podData.timestamp).toLocaleString('en-ZA')
                  : 'Pending...'}
              </p>
            </div>

            <div className="pod-section">
              <h4>
                <Navigation size={18} />
                GPS Location
              </h4>
              <p className="pod-timestamp">
                {podData.gpsLat
                  ? `${podData.gpsLat.toFixed(4)}, ${podData.gpsLng.toFixed(4)}`
                  : 'Pending...'}
              </p>
            </div>

            <div className="pod-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPOD(false)}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmitPOD}
                disabled={!canSubmitPOD}
              >
                Submit POD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}