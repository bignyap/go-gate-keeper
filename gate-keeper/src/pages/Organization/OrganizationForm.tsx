import React, { useState } from 'react';
import { 
  Box, TextField, Button, 
  MenuItem, FormControl, 
  Select, InputLabel, 
  Tabs, Tab 
} from '@mui/material';
import OrganizationTypeSelect from './OrganizationTypeSelect';
import ConfigEditor from './ConfigEditor';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import Grid from '@mui/material/Grid2';
import { Cancel, Save } from '@mui/icons-material';

interface OrganizationFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  columns?: number;
  buttonAtTop?: boolean;
  includeConfig?: boolean;
}

function GridComponentInEdit({ value, size }: { value: React.ReactNode, size: { xs: number, sm: number } }) {
  return (
    <Grid size={{ xs: size.xs, sm: size.sm }}>
        {value}
    </Grid>
  );
}

const OrganizationForm: React.FC<OrganizationFormProps> = (
  { 
    initialData, onSubmit, onCancel, 
    columns = 2, buttonAtTop = false, 
    includeConfig = true 
  }
) => {
  
  const [formData, setFormData] = useState(initialData);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value, type, checked } = target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  console.log(formData);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const gridSize = columns === 3 ? { xs: 12, sm: 4 } : { xs: 12, sm: 6 };

  return (
    <>
      {/* Snackbar */}
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}

      {/* Top Buttons */}
      {buttonAtTop && <Box 
          display="flex" 
          justifyContent="flex-end" 
          alignItems="center" 
          mb={2} 
          position="relative" 
          top={8} 
          right={8}
      >
         <Box mr={2}>
            <Button
                variant="contained"
                startIcon={<Save />}
                color="primary"
                onClick={handleSubmit}
            >
                Save
            </Button>
          </Box>
          <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onCancel}
          >
              Cancel
          </Button>
          
      </Box>}

       {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="organization form tabs">
        <Tab label="INFO" />
        {includeConfig && <Tab label="Configuration" />}
      </Tabs>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <Grid 
          container 
          spacing={2} 
          justifyContent="flex-start" 
          alignItems="flex-start" 
          sx={{ 
            minHeight: '100px', 
            maxHeight: '300px', 
            minWidth: '800px',
            overflowY: 'auto' 
          }}
        >
          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          } size={gridSize} />
          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="realm"
              label="Realm"
              value={formData.realm}
              onChange={handleChange}
              required
            />
          } size={gridSize} />
          <GridComponentInEdit value={
            <OrganizationTypeSelect
              value={formData.type_id}
              onChange={(e) => setFormData({ ...formData, type_id: Number(e.target.value) })}
            />
          } size={gridSize} />
          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
            />
          } size={gridSize} />
          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="support_email"
              label="Support Email"
              value={formData.support_email}
              onChange={handleChange}
              required
            />
          } size={gridSize} />
          <GridComponentInEdit value={
            <FormControl 
                fullWidth
                margin="normal"
            >
                <InputLabel>Status</InputLabel>
                <Select
                    name="active"
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    label="Active"
                >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                </Select>
            </FormControl>
          } size={gridSize} />
          <GridComponentInEdit value={
            <FormControl 
                fullWidth
                margin="normal"
            >
                <InputLabel>Reporting</InputLabel>
                <Select
                    name="report_q"
                    value={formData.report_q ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, report_q: e.target.value === 'true' })}
                    label="Reporting"
                >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                </Select>
            </FormControl>
          } size={gridSize} />
        </Grid>
      )}

      {activeTab === 1 && includeConfig && (
        <Grid 
          container 
          spacing={2} 
          justifyContent="flex-start" 
          alignItems="flex-start" 
          sx={{ 
            mb:2, 
            minHeight: '270px', 
            maxHeight: '300px', 
            minWidth: '800px',
            overflowY: 'auto'
          }}
        >
          <GridComponentInEdit value={
            <ConfigEditor
              config={formData.config}
              onConfigChange={(newConfig) => setFormData({ ...formData, config: newConfig })}
              editorMode={false}
              alwaysEditMode={includeConfig}
            />
          } size={{ xs: 12, sm: 12 }} />
        </Grid>
      )}

      {/* Bottom Buttons */}
      {!buttonAtTop && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, ml: 'auto' }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleSubmit}>
          CREATE
        </Button>
        <Button type="button" onClick={onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
      </Box>}
    </>
  );
};

export default OrganizationForm;