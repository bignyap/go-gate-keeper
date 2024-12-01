import { useEffect, useState } from 'react';
import { ListOrganizations } from '../../libraries/Organization';
import OrganizationModal from './OrganizationModal';
import { ListOrganizationTypes } from '../../libraries/OrgType'
import { EnhancedTable } from '../../components/Table/Table'
import { HeadCell } from '../../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CircularProgress from '@mui/material/CircularProgress';

export function OrganizationPage() {
  return (
    <div className = 'container'>
      <OrganizationLoader />
    </div>
  );
}


function addOrgType(organizations: any, organizationTypes: any) {
  return organizations.map((org: any) => {
    const orgType = organizationTypes.find((type: any) => type.id === org.type_id);
    return {
      ...org,
      type: orgType ? orgType.name : '--'
    };
  });
}

export function OrganizationLoader() {
  const [organizationTypes, setOrganizationTypes] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [mappedOrganizations, setMappedOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);

  async function fetchOrganizations() {
    try {
      const orgData = await ListOrganizations(1, 10);
      setOrganizations(orgData);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
      setSnackbar({
        message: "Failed to load organizations. Please try again later.",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchOrganizationTypes() {
    try {
      const orgTypeData = await ListOrganizationTypes(1, 10);
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

  useEffect(() => {
    fetchOrganizationTypes();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (organizations.length > 0 && organizationTypes.length > 0) {
      const mappedOrgData = addOrgType(organizations, organizationTypes);
      setMappedOrganizations(mappedOrgData);
    }
  }, [organizations, organizationTypes]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  const handleCreateOrganization = async () => {
    setIsModalOpen(true);
  };

  const handleOrganizationCreated = (newOrg: any) => {
    const mappedOrgData = [...mappedOrganizations, ...addOrgType([newOrg], organizationTypes)];
    setMappedOrganizations(mappedOrgData);
  };

  return (
    <div>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true} // Ensure the snackbar opens automatically
          onClose={() => setSnackbar(null)}
        />
      )}
      <EnhancedTable
        rows={mappedOrganizations}
        headCells={headCells}
        defaultSort="id"
        defaultRows={10}
        title={
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<AddIcon />}
            onClick={handleCreateOrganization}
          >
            CREATE ORGANIZATION
          </Button>
        }
      />
      {isModalOpen && (
        <OrganizationModal
          onClose={() => setIsModalOpen(false)}
          onOrganizationCreated={handleOrganizationCreated}
        />
      )}
    </div>
  );
}

const headCells: HeadCell[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'created_at', label: 'Created At' },
  { id: 'updated_at', label: 'Updated At' },
  { id: 'realm', label: 'Realm' },
  { id: 'country', label: 'Country' },
  { id: 'support_email', label: 'Support Email' },
  { id: 'active', label: 'Active' },
  { id: 'report_q', label: 'Reporting' },
  { id: 'config', label: 'Config' },
  // { id: 'type', label: 'TypeID' }
];