import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CustomizedSnackbars } from '../Common/Toast';

interface GenericModalProps {
    title: string;
    renderFields: (formData: FormData, handleChange: (e: React.ChangeEvent<any>) => void) => React.ReactNode;
    onClose: () => void;
    onSubmit: (formData: Record<string, any>) => Promise<any>;
    onSuccess: (result: any) => void;
  }
  
  const GenericModal: React.FC<GenericModalProps> = ({ title, renderFields, onClose, onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState<FormData>(() => ({} as FormData));
  
    const handleChange = (e: React.ChangeEvent<any>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await onSubmit(formData);
        onSuccess(result);
        onClose();
        return (
          <CustomizedSnackbars
            message={`${title} created successfully!`}
            status="success"
            onClose={() => {}}
            open={true}
          />
        );
      } catch (error) {
        console.error(`Error creating ${title.toLowerCase()}:`, error);
      }
    };
  
    return (
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {title}
          </Typography>
          <form onSubmit={handleSubmit}>
            {renderFields(formData, handleChange)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
              <Button type="button" onClick={onClose} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    );
  };
  
export default GenericModal;