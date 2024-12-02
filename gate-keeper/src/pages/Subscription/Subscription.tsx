import { useEffect, useState } from 'react';
import SubscriptionModal from './SubscriptionModal';
// import { ListOrganizationTypes } from '../../libraries/OrgType'
import { EnhancedTable } from '../../components/Table/Table'
import { HeadCell } from '../../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CircularProgress from '@mui/material/CircularProgress';
import { ListSubscriptions } from '../../libraries/Subscription';
import { ListSubscriptionTiers } from '../../libraries/SubscriptionTier';

export function SubscriptionPage() {
  return (
    <div className = 'container'>
      <SubscriptionLoader />
    </div>
  );
}


function addSubTier(subscriptions: any, subTier: any) {
  return subscriptions.map((sub: any) => {
    const subT = subTier.find((type: any) => type.id === sub.subscription_tier_id);
    return {
      ...sub,
      tier: subT ? subT.name : '--'
    };
  });
}

export function SubscriptionLoader() {
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
//   const [organizations, setOrganizations] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [mappedsubscriptions, setMappedsubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);

  async function fetchSubscriptions() {
    try {
      const subData = await ListSubscriptions(1, 10);
      setSubscriptions(subData);
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
  
  async function fetchSubscriptionTiers() {
    try {
      const subTierData = await ListSubscriptionTiers(1, 10);
      setSubscriptionTiers(subTierData);
    } catch (error) {
      console.error("Error fetching subscription tier:", error);
      setSubscriptionTiers([]);
      setSnackbar({
        message: "Failed to load subscription tiers. Please try again later.",
        status: "error"
      });
    }
  }

  useEffect(() => {
    fetchSubscriptionTiers();
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0 && subscriptionTiers.length > 0) {
      const mappedSubData = addSubTier(subscriptions, subscriptionTiers);
      setMappedsubscriptions(mappedSubData);
    }
  }, [subscriptions, subscriptionTiers]);

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

  const handleSubscriptionCreated = (newSub: any) => {
    const mappedSubData = [...mappedsubscriptions, ...addSubTier([newSub], subscriptionTiers)];
    setMappedsubscriptions(mappedSubData);
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
        rows={mappedsubscriptions}
        headCells={headCells}
        defaultSort="id"
        defaultRows={10}
        stickyColumnIds={["id", "name"]}
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
    { id: 'id', label: 'ID', width: 20 },
    { id: 'name', label: 'Name', width: 20 },
    { id: 'tier', label: 'Tier' },
    { id: 'type', label: 'Type' },
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' },
    { id: 'start_date', label: 'Start Date' },
    { id: 'api_limit', label: 'API Limit' },
    { id: 'expiry_date', label: 'Expiry Date' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    // { id: 'organization_id', label: 'Organization ID' },
    // { id: 'subscription_tier_id', label: 'Subscription Tier ID' },
];