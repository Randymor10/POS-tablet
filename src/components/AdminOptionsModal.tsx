import React, { useEffect } from 'react';
import { BarChart3, Package, Settings, Users } from 'lucide-react';

interface AdminOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAction: (action: string) => void;
}

const AdminOptionsModal: React.FC<AdminOptionsModalProps> = ({
  isOpen,
  onClose,
  onAdminAction,
}) => {
  console.log('AdminOptionsModal render - isOpen:', isOpen);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const adminOptions = [
    {
      id: 'sales-tracking',
      title: 'Sales Tracking',
      description: 'View sales reports and analytics',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'inventory-tracking',
      title: 'Inventory Tracking',
      description: 'Manage inventory and stock levels',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'employee-management',
      title: 'Employee Management',
      description: 'Manage employee accounts and roles',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Admin Options</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="admin-options-grid">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                className="admin-option-card"
                onClick={() => onAdminAction(option.id)}
              >
                <div className={`admin-option-icon ${option.bgColor}`}>
                  <IconComponent className={`w-6 h-6 ${option.color}`} />
                </div>
                <div className="admin-option-content">
                  <h3 className="admin-option-title">{option.title}</h3>
                  <p className="admin-option-description">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOptionsModal;