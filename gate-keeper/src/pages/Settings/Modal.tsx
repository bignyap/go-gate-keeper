import React from 'react';
import TextField from '@mui/material/TextField';
import GenericModal from '../../components/Modal/GenericModal';

interface GenericModalProps {
  title: string;
  fields: { name: string; label: string; required?: boolean }[];
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => Promise<any>;
  onSuccess: (result: any) => void;
}

const SettingsModal: React.FC<GenericModalProps> = ({ title, fields, onClose, onSubmit, onSuccess }) => {
  const renderFields = (formData: Record<string, any>, handleChange: (e: React.ChangeEvent<any>) => void) => (
    <>
      {fields.map((field) => (
        <TextField
          key={field.name}
          fullWidth
          margin="normal"
          name={field.name}
          label={field.label}
          value={formData[field.name] || ''}
          onChange={handleChange}
          required={field.required}
        />
      ))}
    </>
  );

  return (
    <GenericModal
      title={title}
      renderFields={renderFields}
      onClose={onClose}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
};

export default SettingsModal;