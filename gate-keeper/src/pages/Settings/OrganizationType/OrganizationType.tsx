import { useEffect, useState } from 'react';
import { ListOrganizationTypes } from '../../../libraries/OrgType';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table'
import { HeadCell } from '../../../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import OrgTypeModal from './OrgTypeModal';

export function OrganizationTypeTab() {
    return (
      <div>
        <OrganizationTypeLoader />
      </div>
    );
  }

export function OrganizationTypeLoader() {
    const [orgTypes, setOrgTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  
    async function fetchEndoints() {
      try {
        const orgTypeData = await ListOrganizationTypes(1, 10);
        setOrgTypes(orgTypeData);
      } catch (error) {
        console.error("Error fetching organization types:", error);
        setOrgTypes([]);
        setSnackbar({
          message: "Failed to load organization types. Please try again later.",
          status: "error"
        });
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      fetchEndoints();
    }, []);
  
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </div>
      );
    }
  
    const handleCreateOrgType = async () => {
      setIsModalOpen(true);
    };
  
    const handleOrgTypeCreated = (newOrgType: any) => {
      const mappedOrgData = [...orgTypes, newOrgType];
      setOrgTypes(mappedOrgData);
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
          rows={orgTypes}
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
              onClick={handleCreateOrgType}
            >
              CREATE Orgnatization Types
            </Button>
          }
        />
        {isModalOpen && (
          <OrgTypeModal
            onClose={() => setIsModalOpen(false)}
            onOrgTypeCreated={handleOrgTypeCreated}
          />
        )}
      </div>
    );
  }
  
  const headCells: HeadCell[] = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
  ];