import { useEffect, useState } from 'react';
import { ListSubscriptionTiers } from '../../../libraries/SubscriptionTier';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table'
import { HeadCell } from '../../../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import TierModal from './TierModal';

export function SubScriptionTierTab() {
    return (
      <div>
        <SubScriptionTierLoader />
      </div>
    );
  }

export function SubScriptionTierLoader() {
    const [subTiers, setSubTiers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  
    async function fetchEndoints() {
      try {
        const subTierData = await ListSubscriptionTiers(1, 10);
        setSubTiers(subTierData);
      } catch (error) {
        console.error("Error fetching endpoints:", error);
        setSubTiers([]);
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
  
    const handleCreateTier = async () => {
      setIsModalOpen(true);
    };
  
    const handleTierCreated = (newTier: any) => {
      setSubTiers([...subTiers, newTier]);
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
          rows={subTiers}
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
              onClick={handleCreateTier}
            >
              CREATE SUBSCRIPTION TIER
            </Button>
          }
        />
        {isModalOpen && (
          <TierModal
            onClose={() => setIsModalOpen(false)}
            onTierCreated={handleTierCreated}
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