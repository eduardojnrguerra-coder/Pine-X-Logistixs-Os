import { useState } from 'react';
import DemoRequestModal from './DemoRequestModal';
import { trackDemoEvent } from '../services/demoAnalytics';

export default function CTAButton({
  children,
  label,
  className = 'primary-button',
  type = 'button',
  source = 'cta',
}) {
  const [open, setOpen] = useState(false);
  const ctaLabel = label || (typeof children === 'string' ? children : 'Demo request');

  const handleClick = () => {
    trackDemoEvent('cta_clicked', { label: ctaLabel, source });
    setOpen(true);
  };

  return (
    <>
      <button type={type} className={className} onClick={handleClick}>
        {children || ctaLabel}
      </button>
      <DemoRequestModal open={open} onClose={() => setOpen(false)} ctaLabel={ctaLabel} />
    </>
  );
}
