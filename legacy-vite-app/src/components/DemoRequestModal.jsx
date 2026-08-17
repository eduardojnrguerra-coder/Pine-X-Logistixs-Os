import { Mail, MessageCircle, Phone, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { trackDemoEvent } from '../services/demoAnalytics';

const DEFAULT_WHATSAPP_LINK =
  'https://wa.me/27638035628?text=Hi%20Eddy%2C%20I%20saw%20the%20Pine%20X%20Logistics%20Command%20Centre%20demo%20and%20I%20would%20like%20to%20book%20a%20demo%20or%20system%20audit%20for%20my%20business.';

const DEFAULT_EMAIL_LINK =
  'mailto:eddy@pinexsystems.co.za?subject=Pine%20X%20Logistics%20System%20Demo%20Request&body=Hi%20Eddy%2C%0A%0AI%20saw%20the%20Pine%20X%20Logistics%20Command%20Centre%20demo%20and%20would%20like%20to%20book%20a%20demo%20or%20system%20audit.%0A%0ABusiness%20name%3A%20%0AFleet%20size%3A%20%0ACurrent%20tracker%20provider%3A%20%0ABiggest%20logistics%20challenge%3A%20%0AContact%20number%3A%20%0A';

const initialLead = {
  name: '',
  businessName: '',
  fleetSize: '',
  mainProblem: '',
  preferredContactMethod: '',
};

const hasLeadDetails = (lead) => Object.values(lead).some((value) => value.trim().length > 0);

const buildLeadLines = (lead) => [
  `Name: ${lead.name || ''}`,
  `Business name: ${lead.businessName || ''}`,
  `Fleet size: ${lead.fleetSize || ''}`,
  `Main problem: ${lead.mainProblem || ''}`,
  `Preferred contact method: ${lead.preferredContactMethod || ''}`,
];

const buildWhatsAppLink = (lead) => {
  if (!hasLeadDetails(lead)) return DEFAULT_WHATSAPP_LINK;

  const message = [
    'Hi Eddy, I saw the Pine X Logistics Command Centre demo and I would like to book a demo or system audit for my business.',
    '',
    ...buildLeadLines(lead),
  ].join('\n');

  return `https://wa.me/27638035628?text=${encodeURIComponent(message)}`;
};

const buildEmailLink = (lead) => {
  if (!hasLeadDetails(lead)) return DEFAULT_EMAIL_LINK;

  const subject = 'Pine X Logistics System Demo Request';
  const body = [
    'Hi Eddy,',
    '',
    'I saw the Pine X Logistics Command Centre demo and would like to book a demo or system audit.',
    '',
    ...buildLeadLines(lead),
    'Current tracker provider: ',
    'Contact number: ',
  ].join('\n');

  return `mailto:eddy@pinexsystems.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export default function DemoRequestModal({ open, onClose, ctaLabel = 'Demo request' }) {
  const [lead, setLead] = useState(initialLead);
  const whatsappLink = useMemo(() => buildWhatsAppLink(lead), [lead]);
  const emailLink = useMemo(() => buildEmailLink(lead), [lead]);

  if (!open) return null;

  const updateLead = (field) => (event) => {
    setLead((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleWhatsApp = () => {
    trackDemoEvent('whatsapp_clicked', { ctaLabel, hasLeadDetails: hasLeadDetails(lead) });
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    trackDemoEvent('email_clicked', { ctaLabel, hasLeadDetails: hasLeadDetails(lead) });
    window.location.href = emailLink;
  };

  return (
    <div className="demo-request-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="demo-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-request-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="demo-request-shell">
          <div className="demo-request-header">
            <div>
              <span className="demo-request-kicker">Pine X Systems</span>
              <h2 id="demo-request-title">Book Your Logistics System Demo</h2>
              <p>Choose how you would like to contact Pine X Systems.</p>
            </div>
            <button type="button" className="demo-request-close" onClick={onClose} aria-label="Close demo request modal">
              <X size={20} />
            </button>
          </div>

          <div className="demo-request-copy">
            <Phone size={18} />
            <p>
              Most logistics companies do not need more spreadsheets. They need one control layer for trucks, jobs,
              drivers, customers, invoices, and delivery risk. Let&apos;s look at where your operation is leaking time or money.
            </p>
          </div>

          <div className="demo-request-options">
            <button type="button" className="demo-request-option whatsapp" onClick={handleWhatsApp}>
              <span><MessageCircle size={20} /></span>
              <div>
                <strong>Continue on WhatsApp</strong>
                <small>Fastest way to book with Eddy: +27 63 803 5628</small>
              </div>
            </button>
            <button type="button" className="demo-request-option email" onClick={handleEmail}>
              <span><Mail size={20} /></span>
              <div>
                <strong>Send Email Enquiry</strong>
                <small>Send details to eddy@pinexsystems.co.za</small>
              </div>
            </button>
          </div>

          <div className="demo-request-form">
            <div className="demo-request-form-heading">
              <Send size={17} />
              <div>
                <strong>Optional lead details</strong>
                <span>Fill this in to pre-populate the WhatsApp or email message.</span>
              </div>
            </div>
            <div className="demo-request-field-grid">
              <label>
                Name
                <input value={lead.name} onChange={updateLead('name')} placeholder="Your name" />
              </label>
              <label>
                Business name
                <input value={lead.businessName} onChange={updateLead('businessName')} placeholder="Company name" />
              </label>
              <label>
                Fleet size
                <input value={lead.fleetSize} onChange={updateLead('fleetSize')} placeholder="e.g. 12 trucks" />
              </label>
              <label>
                Preferred contact method
                <select value={lead.preferredContactMethod} onChange={updateLead('preferredContactMethod')}>
                  <option value="">Choose one</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone call">Phone call</option>
                  <option value="Email">Email</option>
                </select>
              </label>
              <label className="demo-request-wide">
                Main problem
                <textarea
                  value={lead.mainProblem}
                  onChange={updateLead('mainProblem')}
                  placeholder="What is currently costing time, money, or control?"
                  rows={3}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
