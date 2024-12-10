import React from 'react';
import { CreateOrganizationType } from '../../libraries/OrgType';
import SettingsModal from '../Settings/Modal';

interface OrgTypeFormProps {
  onClose: () => void;
  onOrgTypeCreated: (org: any) => void;
}

const OrgTypeModal: React.FC<OrgTypeFormProps> = ({ onClose, onOrgTypeCreated }) => {
  return (
    <SettingsModal
      title="Create Organization Type"
      fields={[
        { name: 'name', label: 'Name', required: true }
      ]}
      onClose={onClose}
      onSubmit={CreateOrganizationType}
      onSuccess={onOrgTypeCreated}
    />
  );
};

export default OrgTypeModal;