import { useEffect, useState } from 'react';
import SubscriptionModal from './SubscriptionModal';
import { EnhancedTable } from '../../components/Table/Table'
import { HeadCell } from '../../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CircularProgress from '@mui/material/CircularProgress';
import { ListSubscriptionByOrgIds, ListSubscriptions } from '../../libraries/Subscription';

interface SubscriptionProps {
  orgId: number | null;
  tableContainerSx?: object;
}

export function SubscriptionPage({ orgId }: SubscriptionProps) {
  return (
    <div className = 'container'>
      <SubscriptionLoader orgId={orgId}/>
    </div>
  );
}

export function SubscriptionLoader({ orgId, tableContainerSx }: SubscriptionProps) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [count, setCount] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  async function fetchSubscriptions(newPage: number, itemsPerPage: number) {
    try {
      const subData = orgId == null 
        ? await ListSubscriptions(newPage, itemsPerPage) 
        : await ListSubscriptionByOrgIds(orgId, newPage, itemsPerPage);
      const iCount = subData["total_items"];
      setCount(iCount);
      if (iCount > 0) {
        setSubscriptions(subData["data"]);
      }; 
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
      setSnackbar({
        message: "Failed to load subscriptions. Please try again later.",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscriptions(page + 1, itemsPerPage);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  const handleCreateSubscription = async () => {
    setIsModalOpen(true);
  };

  const onPageChange = async (newPage: number, itemsPerPage: number) => {
    await fetchSubscriptions(newPage, itemsPerPage)
  };

  const handleRowsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchSubscriptions(1, newItemsPerPage);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    onPageChange(newPage + 1, itemsPerPage);
  };

  const handleSubscriptionCreated = (newSub: any) => {
    setSubscriptions([...subscriptions, newSub]);
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
        rows={subscriptions}
        headCells={headCells}
        defaultSort="id"
        defaultRows={10}
        stickyColumnIds={["id", "name"]}
        page={page}
        onPageChange={handleChangePage}
        count={count}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableContainerSx={tableContainerSx}
        title={
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<AddIcon />}
            onClick={handleCreateSubscription}
          >
            CREATE SUBSCRIPTION
          </Button>
        }
      />
      {isModalOpen && (
        <SubscriptionModal
          onClose={() => setIsModalOpen(false)}
          onSubscriptionCreated={handleSubscriptionCreated}
        />
      )}
    </div>
  );
}

const headCells: HeadCell[] = [
    // { id: 'id', label: 'ID', width: 20 },
    { id: 'name', label: 'Name', width: 20 },
    // { id: 'tier', label: 'Tier' },
    { id: 'type', label: 'Type' },
    { id: 'start_date', label: 'Start Date' },
    { id: 'api_limit', label: 'API Limit' },
    { id: 'expiry_date', label: 'Expiry Date' },
    { id: 'status', label: 'Status' },
    { id: 'description', label: 'Description' },
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' },
    // { id: 'organization_id', label: 'Organization ID' },
    // { id: 'subscription_tier_id', label: 'Subscription Tier ID' },
];