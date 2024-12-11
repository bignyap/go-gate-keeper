import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListSubscriptionTiers, DeleteSubscriptionTier } from '../../libraries/SubscriptionTier';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../components/Table/Table'
import { HeadCell, FormatCellValue } from '../../components/Table/Utils';
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import TierModal from './TierModal';
import { TextField, InputAdornment }  from '@mui/material'; 

export function SubScriptionTierTab() {
    return (
      <div>
        <SubScriptionTierLoader />
      </div>
    );
  }

export function SubScriptionTierLoader() {
    const navigate = useNavigate();
    const [count, setCount] = useState<number>(-1);
    const [subTiers, setSubTiers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
  
    async function fetchTiers(newPage: number, itemsPerPage: number) {
      try {
        const subTierData = await ListSubscriptionTiers(newPage, itemsPerPage);
        const iCount = subTierData["total_items"];
        setCount(iCount);
        if (iCount > 0) {
          setSubTiers(subTierData["data"]);
        }; 
      } catch (error) {
        console.error("Error fetching tiers:", error);
        setSubTiers([]);
        setSnackbar({
          message: "Failed to load tiers. Please try again later.",
          status: "error"
        });
      } finally {
        setLoading(false);
      }
    }

    const onDeleteTier = async (row: any) => {
      try {
        await DeleteSubscriptionTier(row["id"]);
        fetchTiers(page + 1, itemsPerPage);
      } catch (error) {
        console.error("Error deleting organization:", error);
        setSnackbar({
          message: "Failed to delete organization. Please try again later.",
          status: "error"
        });
      }
    };
  
    useEffect(() => {
      fetchTiers(page + 1, itemsPerPage);
    }, [itemsPerPage, page]);
  
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
    
    const onPageChange = async (newPage: number) => {
      await fetchTiers(newPage, itemsPerPage)
    };

    const handleChangePage = (newPage: number) => {
      setPage(newPage);
      onPageChange(newPage + 1);
    };
    
    const handleRowsPerPageChange = (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      fetchTiers(1, newItemsPerPage);
    };
    
    const handleTierCreated = () => {
      fetchTiers(1, itemsPerPage);
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
          renderCell={(key, value, row) => {
            if (key === 'name') {
              return (
                <a href={`/subTier/${row.id}`} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                  {value}
                </a>
              );
            } else {
              return FormatCellValue(value)
            }
          }}
          headCells={headCells}
          defaultSort="id"
          defaultRows={10}
          stickyColumnIds={["name"]}
          page={page}
          onPageChange={handleChangePage}
          count={count}
          onRowsPerPageChange={handleRowsPerPageChange}
          stickyRight={true}
          menuOptions={['View', 'Delete']}
          onOptionSelect={(action, row) => {
            switch (action) {
              case 'View':
                navigate(`/subTier/${row["id"]}`);
                break;
              case 'Delete':
                onDeleteTier(row);
                break;
              default:
                break;
            }
          }}
          title={
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Search..."
                size="small"
                style={{ width: '400px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                // Add onChange handler if needed
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  // startIcon={<AddIcon />}
                  onClick={handleCreateTier}
                >
                  CREATE SUBSCRIPTION TIER
                </Button>
              </div>
            </div>
          }
          tableContainerSx= {{
            maxHeight: '70vh',
            overflowX: 'auto',
            overflowY: 'auto'
          }}
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
    // { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name', width: 20 },
    { id: 'archived', label: 'Archived' },
    { id: 'description', label: 'Description' },
    { id: 'created_at', label: 'created_at'},
    { id: 'updated_at', label: 'updated_at'}
  ];