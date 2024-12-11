import React from 'react';
import { CreateSubscriptionTier } from '../../libraries/SubscriptionTier';
import SettingsModal from '../Settings/Modal';

interface TierFormProps {
  onClose: () => void;
  onTierCreated: (org: any) => void;
}

const TierModal: React.FC<TierFormProps> = ({ onClose, onTierCreated }) => {
  return (
    <SettingsModal
      title="Create Subscription Tier"
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'description', label: 'Description', required: true },
      ]}
      onClose={onClose}
      onSubmit={CreateSubscriptionTier}
      onSuccess={onTierCreated}
    />
  );
};

export default TierModal;