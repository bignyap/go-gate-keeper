import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../../components/Table/Table'
import { DeleteTierPricing, GetTierPricingBySubTierId } from '../../libraries/TierPricing';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment }  from '@mui/material';
import { HeadCell, FormatCellValue } from '../../components/Table/Utils';
import TierPricingModal from "./PricingModal";

export function ViewTierPricingPage() {
    const navigate = useNavigate();

    return (
        <div className='container'>
            {ViewTierPricingLoader(navigate)}
        </div>
    );
}

function ViewTierPricingLoader(navigate: (path: string) => void): JSX.Element {
    const { id } = useParams<{ id: string }>();

    const [tierPricing, setTierPricing] = useState<any[]>([]);
    const [count, setCount] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    async function fetchTierPricing(tierId: number, newPage: number, itemsPerPage: number) {
        try {
          const tierPricingData = await GetTierPricingBySubTierId(tierId, newPage, itemsPerPage);
          const iCount = tierPricingData["total_items"];
          setCount(iCount);
          if (iCount > 0) {
            setTierPricing(tierPricingData["data"]);
          }; 
        } catch (error) {
          console.error("Error fetching tier pricing:", error);
          setTierPricing([]);
          setSnackbar({
            message: "Failed to load tier pricings. Please try again later.",
            status: "error"
          });
        } finally {
          setLoading(false);
        }
      };

      const onDeleteTierPricing = async (row: any) => {
        try {
          await DeleteTierPricing(row["id"]);
          fetchTierPricing(Number(id), page + 1, itemsPerPage);
        } catch (error) {
          console.error("Error deleting tier pricing:", error);
          setSnackbar({
            message: "Failed to delete tier pricing. Please try again later.",
            status: "error"
          });
        }
      };
    
      useEffect(() => {
        fetchTierPricing(Number(id), page + 1, itemsPerPage);
      }, [itemsPerPage, page]);
    
      if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </div>
        );
      }
    
      const handleCreateTierPricing = async () => {
        setIsModalOpen(true);
      };
    
      const onPageChange = async (newPage: number) => {
        await fetchTierPricing(Number(id), newPage, itemsPerPage)
      };
    
      const handleRowsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        fetchTierPricing(Number(id), 1, newItemsPerPage);
      };
    
      const handleChangePage = (newPage: number) => {
        setPage(newPage);
        onPageChange(newPage + 1);
      };
    
      const handleTierPricingCreated = () => {
        fetchTierPricing(Number(id), 1, itemsPerPage);
      };

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">{"Add the tier name here"}</Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/subTier')}
                >
                    Back
                </Button>
            </Box>
            <EnhancedTable
                rows={tierPricing}
                renderCell={(key, value, row) => {
                    return FormatCellValue(value)
                }}
                headCells={headCells}
                defaultSort="id"
                defaultRows={10}
                stickyColumnIds={["endpoint_name"]}
                page={page}
                onPageChange={handleChangePage}
                count={count}
                onRowsPerPageChange={handleRowsPerPageChange}
                stickyRight={true}
                menuOptions={['Edit', 'Delete']}
                onOptionSelect={(action, row) => {
                switch (action) {
                    case 'Edit':
                        break;
                    case 'Delete':
                        onDeleteTierPricing(row);
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
                        onClick={handleCreateTierPricing}
                    >
                        CREATE Tier Pricings
                    </Button>
                    </div>
                </div>
                }
            />
            {isModalOpen && (
                <TierPricingModal
                    onClose={() => setIsModalOpen(false)}
                    onTierPricingCreated={handleTierPricingCreated}
                    tierId={Number(id)}
                />
            )}
        </>
    );
}

const headCells: HeadCell[] = [
    { id: 'endpoint_name', label: 'Endpoint', width: 20 },
    { id: 'base_cost_per_call', label: 'Base Cost / Call' },
    { id: 'base_rate_limit', label: 'Rate Limit / Sec' },
  ];
