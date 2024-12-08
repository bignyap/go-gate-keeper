import React, { useState, useEffect } from 'react';
import { CreateOrganization } from '../../libraries/Organization';
import { ListAllOrganizationTypes } from '../../libraries/OrgType'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import MenuItem from '@mui/material/MenuItem';

interface OrganizationFormProps {
  onClose: () => void;
  onOrganizationCreated: (org: any) => void;
}

interface OrganizationType {
  id: number;
  name: string;
}

const OrganizationModal: React.FC<OrganizationFormProps> = ({ onClose, onOrganizationCreated }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    realm: '',
    country: '',
    support_email: '',
    active: true,
    report_q: false,
    config: '',
    type_id: 0,
  });

  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  async function fetchOrganizationTypes() {
    try {
      const orgTypeData = await ListAllOrganizationTypes();
      setOrganizationTypes(orgTypeData);
    } catch (error) {
      console.error("Error fetching organization types:", error);
      setOrganizationTypes([]);
      setSnackbar({
        message: "Failed to load organization types. Please try again later.",
        status: "error"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value, type, checked } = target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrg = await CreateOrganization(formData);
      console.log("org created", newOrg);
      onOrganizationCreated(newOrg);
      onClose();
      setSnackbar({
        message: `Organization ${newOrg.name} created successfully!`,
        status: "success",
      });
    } catch (error) {
      setSnackbar({
        message: `Error creating organization!!`,
        status: "error",
      });
      console.error('Error creating organization:', error);
    }
  };

  useEffect(() => {
    fetchOrganizationTypes();
  }, []);

  return (
    <>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}
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
            Create Organization
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="realm"
              label="Realm"
              value={formData.realm}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="support_email"
              label="Support Email"
              value={formData.support_email}
              onChange={handleChange}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="report_q"
                  checked={formData.report_q}
                  onChange={handleChange}
                />
              }
              label="Reporting"
            />
            <TextField
              fullWidth
              margin="normal"
              name="config"
              label="Config"
              value={formData.config}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="type_id"
              label="Organization Type"
              select
              value={formData.type_id}
              onChange={handleChange}
              required
            >
              {organizationTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  onClick={handleSubmit} 
              >
                Create
              </Button>
              <Button 
                  type="button" 
                  onClick={onClose} 
                  variant="outlined" 
                  color="secondary"
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default OrganizationModal;