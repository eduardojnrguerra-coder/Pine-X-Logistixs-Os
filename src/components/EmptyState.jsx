import { Package } from 'lucide-react';

export default function EmptyState({ 
  title = 'No items found', 
  description = 'There are no items to display.',
  icon: Icon = Package 
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}