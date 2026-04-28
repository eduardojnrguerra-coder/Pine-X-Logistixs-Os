import StatusBadge from './StatusBadge';

const timelineSteps = [
  'Job Created',
  'Scheduled',
  'Dispatched',
  'At Pickup',
  'Loaded',
  'On Route',
  'Delivered',
  'POD Uploaded',
  'Invoiced',
];

const statusIndexMap = {
  Draft: 0,
  Quoted: 0,
  Approved: 1,
  Scheduled: 1,
  Dispatched: 2,
  'At Pickup': 3,
  Loaded: 4,
  'On Route': 5,
  'At Dropoff': 5,
  Delivered: 6,
  Delayed: 5,
  Cancelled: 0,
};

export default function DeliveryTimeline({ job, hasInvoice = false }) {
  const currentIndex = statusIndexMap[job.status] ?? 0;
  const podIndex = job.status === 'Delivered' || hasInvoice ? 7 : -1;
  const invoiceIndex = hasInvoice ? 8 : -1;

  return (
    <div className="delivery-timeline">
      <div className="delivery-timeline-header">
        <div>
          <strong>{job.jobNumber}</strong>
          <p>
            {job.pickupLocation} to {job.dropoffLocation}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="timeline-steps">
        {timelineSteps.map((step, index) => {
          const completed =
            index <= currentIndex ||
            (podIndex >= 0 && index <= podIndex && step === 'POD Uploaded') ||
            (invoiceIndex >= 0 && index <= invoiceIndex && step === 'Invoiced');
          const active =
            index === currentIndex ||
            (step === 'POD Uploaded' && podIndex === index) ||
            (step === 'Invoiced' && invoiceIndex === index);

          return (
            <div
              key={`${job.id}-${step}`}
              className={`timeline-step ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}
            >
              <span className="timeline-dot" />
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
