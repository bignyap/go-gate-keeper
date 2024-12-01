import { useEffect, useState } from 'react';
import { ListEndpoints } from '../../../libraries/Endpoint';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table'
import { HeadCell } from '../../../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import EndpointModal from './EndpointModal';

export function EndpointTab() {
    return (
      <div>
        <EndpointLoader />
      </div>
    );
  }

export function EndpointLoader() {
    const [endpoints, setEndpoints] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  
    async function fetchEndoints() {
      try {
        const endpointData = await ListEndpoints(1, 10);
        setEndpoints(endpointData);
      } catch (error) {
        console.error("Error fetching endpoints:", error);
        setEndpoints([]);
        setSnackbar({
          message: "Failed to load endpoints. Please try again later.",
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
  
    const handleCreateEndpoint = async () => {
      setIsModalOpen(true);
    };
  
    const handleEndpointCreated = (newEndpoint: any) => {
      setEndpoints([...endpoints, newEndpoint]);
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
          rows={endpoints}
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
              onClick={handleCreateEndpoint}
            >
              CREATE ENDPOINT
            </Button>
          }
        />
        {isModalOpen && (
          <EndpointModal
            onClose={() => setIsModalOpen(false)}
            onEndpointCreated={handleEndpointCreated}
          />
        )}
      </div>
    );
  }
  
  const headCells: HeadCell[] = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
  ];