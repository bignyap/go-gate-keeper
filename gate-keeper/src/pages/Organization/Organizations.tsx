import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { ListOrganizations, DeleteOrganization } from '../../libraries/Organization';
import OrganizationModal from './OrganizationModal';
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

export function OrganizationLoader() {
  
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [count, setCount] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const navigate = useNavigate();

  async function fetchOrganizations(newPage: number, itemsPerPage: number) {
    try {
      const orgData = await ListOrganizations(newPage, itemsPerPage);
      const iCount = orgData["total_items"];
      setCount(iCount);
      if (iCount > 0) {
        setOrganizations(orgData["data"]);
      }; 
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
  };

  const onDeleteOrg = async (row: any) => {
    try {
      await DeleteOrganization(row["id"]);
      fetchOrganizations(page + 1, itemsPerPage);
    } catch (error) {
      console.error("Error deleting organization:", error);
      setSnackbar({
        message: "Failed to delete organization. Please try again later.",
        status: "error"
      });
    }
  };

  useEffect(() => {
    fetchOrganizations(page + 1, itemsPerPage);
  }, [itemsPerPage, page]);

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

  const onPageChange = async (newPage: number) => {
    await fetchOrganizations(newPage, itemsPerPage)
  };

  const handleRowsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchOrganizations(1, newItemsPerPage);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    onPageChange(newPage + 1);
  };

  const handleOrganizationCreated = () => {
    fetchOrganizations(1, itemsPerPage);
  };

  return (
    <div>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}
      <EnhancedTable
        rows={organizations}
        headCells={headCells}
        defaultSort="id"
        defaultRows={10}
        stickyColumnIds={["id", "name"]}
        page={page}
        onPageChange={handleChangePage}
        count={count}
        onRowsPerPageChange={handleRowsPerPageChange}
        stickyRight={true}
        menuOptions={['View', 'Edit', 'Delete']}
        onOptionSelect={(action, row) => {
          switch (action) {
            case 'View':
              navigate(`/organizations/${row["id"]}/view`);
              break;
            case 'Edit':
              navigate(`/organizations/${row["id"]}/edit`);
              break;
            case 'Delete':
              onDeleteOrg(row);
              break;
            default:
              break;
          }
        }}
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
  // { id: 'id', label: 'ID', width: 20 },
  { id: 'name', label: 'Name', width: 20 },
  { id: 'type', label: 'Type' },
  { id: 'realm', label: 'Realm' },
  { id: 'country', label: 'Country' },
  { id: 'support_email', label: 'Support Email' },
  { id: 'active', label: 'Active' },
  { id: 'report_q', label: 'Reporting' },
  // { id: 'config', label: 'Config' },
  { id: 'created_at', label: 'Created At' },
  { id: 'updated_at', label: 'Updated At' },
];