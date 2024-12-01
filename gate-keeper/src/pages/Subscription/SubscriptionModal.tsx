import React, { useState } from 'react';
import { CreateSubscription } from '../../libraries/Subscription';
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
            <TextField
                fullWidth
                margin="normal"
                name="organization_id"
                label="Organization ID"
                type="number"
                value={formData.organization_id}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                name="subscription_tier_id"
                label="Subscription Tier ID"
                type="number"
                value={formData.subscription_tier_id}
                onChange={handleChange}
                required
            />
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
  );
};

export default SubscriptionModal;