import React from 'react';
import { CreateEndpoint } from '../../../libraries/Endpoint';
import SettingsModal from '../Modal';

interface EndpointFormProps {
  onClose: () => void;
  onEndpointCreated: (org: any) => void;
}

const EndpointModal: React.FC<EndpointFormProps> = ({ onClose, onEndpointCreated }) => {
  return (
    <SettingsModal
      title="Create Endpoint"
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'description', label: 'Description', required: true },
      ]}
      onClose={onClose}
      onSubmit={CreateEndpoint}
      onSuccess={onEndpointCreated}
    />
  );
};

export default EndpointModal;