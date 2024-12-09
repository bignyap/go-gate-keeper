import React from 'react';
import { CreateOrganization } from '../../libraries/Organization';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OrganizationForm from './OrganizationForm';

interface OrganizationFormProps {
  onClose: () => void;
  onOrganizationCreated: (org: any) => void;
}

const OrganizationModal: React.FC<OrganizationFormProps> = ({ onClose, onOrganizationCreated }) => {
  const initialData = {
    name: '',
    realm: '',
    country: '',
    support_email: '',
    active: true,
    report_q: false,
    config: '',
    type_id: 0,
  };

  const handleSubmit = async (data: any) => {
    const newOrg = await CreateOrganization(data);
    onOrganizationCreated(newOrg);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <OrganizationForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          onCancel={onClose} 
          columns={3}
          includeConfig={true}
        />
      </Box>
    </Modal>
  );
};

export default OrganizationModal;