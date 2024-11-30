import { useEffect, useState } from 'react';
import { ListOrganizations, CreateOrganization } from '../libraries/Organization';
import { ListOrganizationTypes } from '../libraries/OrgType'
import { EnhancedTable } from '../components/Table/Table'
import { HeadCell } from '../components/Table/Utils';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';

export function OrganizationPage() {
  return (
    <div 
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
            height: '90vh',
            padding: '50px',
            maxWidth: '90vw'
        }}
    >
      <OrganizationLoader />
    </div>
  );
}

export function OrganizationLoader() {
  
  const [organizationTypes, setOrganizationTypes] = useState<any[]>([]);  
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrganizationTypes() {
        try {
          const orgTypeData = await ListOrganizationTypes(1, 10);
          console.log(orgTypeData);
          setOrganizationTypes(orgTypeData);
        } catch (error) {
          console.error('Error fetching organizations:', error);
        } finally {
          // setLoading(false);
        }
      }

    async function fetchOrganizations() {
      try {
        const orgData = await ListOrganizations(1, 10);
        console.log(orgData);
        setOrganizations(orgData);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizationTypes();

    fetchOrganizations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const mappedOrganizations = organizations.map(org => {
    const orgType = organizationTypes.find(type => type.id === org.type_id);
    return {
      ...org,
      type: orgType ? orgType.name : '--'
    };
  });

  const handleCreateOrganization = async () => {
    const newOrganizationData = {
      name: "New Organization",
      type_id: 1
    };

    try {
      const response = await CreateOrganization(newOrganizationData);
      console.log('Organization created:', response);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  return (
    <EnhancedTable 
        rows={mappedOrganizations}
        headCells={headCells}
        defaultSort="id"
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
  );
}

const headCells: HeadCell[] = [
    {
      id: 'id',
      label: 'ID',
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
        id: 'type',
        label: 'Type',
    },
    {
      id: 'created_at',
      label: 'Created At',
    },
    {
      id: 'updated_at',
      label: 'Updated At',
    },
    {
      id: 'realm',
      label: 'Realm',
    },
    {
      id: 'country',
      label: 'Country',
    },
    {
      id: 'support_email',
      label: 'Support Email',
    },
    {
      id: 'active',
      label: 'Active',
    },
    {
      id: 'report_q',
      label: 'Reporting',
    },
    {
      id: 'config',
      label: 'Config',
    },
];