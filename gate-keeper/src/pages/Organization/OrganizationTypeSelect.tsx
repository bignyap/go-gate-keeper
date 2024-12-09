import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { ListAllOrganizationTypes } from '../../libraries/OrgType';
import { CustomizedSnackbars } from '../../components/Common/Toast';

interface OrganizationType {
  id: number;
  name: string;
}

interface OrganizationTypeSelectProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrganizationTypeSelect: React.FC<OrganizationTypeSelectProps> = ({ value, onChange }) => {
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  useEffect(() => {
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
    }
    fetchOrganizationTypes();
  }, []);

    console.log(organizationTypes);
    console.log(value);
  // Ensure the value is valid or set to an empty string
  const selectedValue = organizationTypes.some(type => type.id === value) ? value : '';

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
      <TextField
        fullWidth
        margin="normal"
        name="type_id"
        label="Organization Type"
        select
        value={selectedValue}
        onChange={onChange}
        required
      >
        {organizationTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};

export default OrganizationTypeSelect;