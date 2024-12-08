import React, { useState, useEffect } from 'react';
import { CreateSubscription } from '../../libraries/Subscription';
import { ListAllSubscriptionTiers } from '../../libraries/SubscriptionTier';
import { ListAllOrganizationTypes } from '../../libraries/OrgType';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { CustomizedSnackbars } from '../../components/Common/Toast';

interface SubscriptionFormProps {
    onClose: () => void;
    onSubscriptionCreated: (org: any) => void;
  }

interface OrganizationType {
    id: number;
    name: string;
}

interface SubTiers {
    id: number;
    name: string;
}

const SubscriptionModal: React.FC<SubscriptionFormProps> = ({ onClose, onSubscriptionCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        start_date: new Date().toISOString().split('T')[0],
        api_limit: 0,
        expiry_date: '',
        description: null,
        status: true,
        organization_id: 0,
        subscription_tier_id: 0,
    });

    const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
    const [subTiers, setSubTiers] = useState<SubTiers[]>([]);
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

    async function fetchSubTiers() {
      try {
        const subTiers = await ListAllSubscriptionTiers();
        setSubTiers(subTiers);
      } catch (error) {
        console.error("Error fetching subscription tiers:", error);
        setSubTiers([]);
        setSnackbar({
          message: "Failed to load subscription tiers. Please try again later.",
          status: "error"
        });
      }
    };

    useEffect(() => {
        fetchOrganizationTypes();
        fetchSubTiers();
      },
    [])

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
        const newSub = await CreateSubscription(formData);
        console.log("subscription created", newSub);
        onSubscriptionCreated(newSub);
        onClose();
        CustomizedSnackbars({
            message: `Subscription ${newSub.name} created successfully!`,
            status: "success",
            onClose: () => {},
            open: true
        });
        } catch (error) {
        console.error('Error creating subscription:', error);
        }
    };

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
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Create Subscription
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
                  name="type"
                  label="Type"
                  value={formData.type}
                  onChange={handleChange}
                  required
              />
              <TextField
                  fullWidth
                  margin="normal"
                  name="start_date"
                  label="Start Date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
              />
              <TextField
                  fullWidth
                  margin="normal"
                  name="api_limit"
                  label="API Limit"
                  type="number"
                  value={formData.api_limit}
                  onChange={handleChange}
                  required
              />
              <TextField
                  fullWidth
                  margin="normal"
                  name="expiry_date"
                  label="Expiry Date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
              />
              <TextField
                  fullWidth
                  margin="normal"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
              />
              <FormControl 
                  fullWidth
                  margin="normal"
              >
                  <InputLabel>Status</InputLabel>
                  <Select
                      name="status"
                      value={formData.status ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                      label="Status"
                  >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                  </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                  <InputLabel>Organization</InputLabel>
                  <Select
                      name="organization_id"
                      value={formData.organization_id}
                      onChange={(e) => setFormData({ ...formData, organization_id: Number(e.target.value) })}
                      label="Organization"
                      required
                  >
                      {organizationTypes.map((orgType) => (
                          <MenuItem key={orgType.id} value={orgType.id}>
                              {orgType.name}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                  <InputLabel>Subscription Tier</InputLabel>
                  <Select
                      name="subscription_tier_id"
                      value={formData.subscription_tier_id}
                      onChange={(e) => setFormData({ ...formData, subscription_tier_id: Number(e.target.value) })}
                      label="Subscription Tier"
                      required
                  >
                      {subTiers.map((subTier) => (
                          <MenuItem key={subTier.id} value={subTier.id}>
                              {subTier.name}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>
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

export default SubscriptionModal;