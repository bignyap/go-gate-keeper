import React from 'react';
import { CreateResourceType } from '../../../libraries/ResourceType';
import SettingsModal from '../Modal';

interface ResourceTypeFormProps {
  onClose: () => void;
  onResourceTypeCreated: (org: any) => void;
}

const ResourceTypeModal: React.FC<ResourceTypeFormProps> = ({ onClose, onResourceTypeCreated }) => {
  return (
    <SettingsModal
      title="Create Resource Type"
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'code', label: 'Code', required: true },
        { name: 'description', label: 'Description', required: true },
      ]}
      onClose={onClose}
      onSubmit={CreateResourceType}
      onSuccess={onResourceTypeCreated}
    />
  );
};

export default ResourceTypeModal;