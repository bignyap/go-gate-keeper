import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { ArrowBack, Edit, Cancel, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { GetOrganizationById } from '../../libraries/Organization';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import { SubscriptionLoader } from '../Subscription/Subscription';
import { Tabs, Tab } from '@mui/material';
import { TextField } from '@mui/material';

export function ViewOrganizationPage() {
    const navigate = useNavigate();

    return (
        <div className='container'>
            {ViewOrganizationLoader(navigate)}
        </div>
    );
}

interface OrganizationRow {
    id: string;
    name: string;
    type: string;
    realm: string;
    country: string;
    support_email: string;
    active: boolean;
    report_q: string;
    created_at: string;
    updated_at: string;
    config: string;
}

function ViewOrganizationLoader(navigate: (path: string) => void): JSX.Element {
    const { id } = useParams<{ id: string }>();

    const [organization, setOrganization] = useState<OrganizationRow | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);

    const [activeTab, setActiveTab] = useState(0);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    async function fetchOrganization(id: number) {
        try {
            const orgData = await GetOrganizationById(id);
            setOrganization(orgData); 
        } catch (error) {
            console.error("Error fetching organizations:", error);
            setOrganization(null);
            setSnackbar({
                message: "Failed to load organizations. Please try again later.",
                status: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrganization(Number(id));
        }
    }, [id]);

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
                <Typography variant="h4">{organization?.name}</Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/organizations')}
                >
                    Back
                </Button>
            </Box>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="organization tabs">
                <Tab label="Details" />
                <Tab label="Subscription" />
                <Tab label="Usage" />
            </Tabs>
            {activeTab === 0 && (
                <Box mt={2}>
                    <Card>
                        <CardContent>
                            {organization && (
                                <>
                                    <Box 
                                        display="flex" 
                                        justifyContent="flex-end" 
                                        alignItems="center" 
                                        mb={2} 
                                        position="relative" 
                                        top={8} 
                                        right={8}
                                    >
                                       {isEditMode && (
                                            <Box mr={2}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Save />}
                                                    color="primary"
                                                    onClick={() => {
                                                        // Add your save logic here
                                                        setIsEditMode(false);
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        )}
                                       <Button
                                            variant="outlined"
                                            startIcon={isEditMode ? <Cancel /> : <Edit />}
                                            onClick={() => setIsEditMode(!isEditMode)}
                                        >
                                            {isEditMode ? "Cancel" : "Edit"}
                                        </Button>
                                        
                                    </Box>
                                    {isEditMode ? (
                                        <OrganizationDetailsInEditMode row={organization} />
                                    ) : (
                                        <OrganizationDetails row={organization} />
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            {organization && (
                                <>
                                    <Box 
                                        display="flex" 
                                        justifyContent="flex-end" 
                                        alignItems="center" 
                                        mb={2} 
                                        position="relative" 
                                        top={8} 
                                        right={8}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            onClick={() => navigate(`/organizations/${id}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                    <Typography 
                                        align="left"
                                        sx={{ height: '100px', overflow: 'auto' }}
                                    >
                                        {organization["config"] || "No config available"}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            )}
            {activeTab === 1 && organization && (
                <Box mt={2}>
                    <SubscriptionLoader 
                        orgId={Number(id)} 
                        tableContainerSx={{
                            maxHeight: '50vh',
                            overflowX: 'auto',
                            overflowY: 'auto'
                        }}
                    />
                </Box>
            )}
            {activeTab === 2 && (
                <Box mt={2}>
                    {/* Add your Usage component or content here */}
                    <Typography variant="body1">Usage data will be displayed here.</Typography>
                </Box>
            )}
        </>
    );
}

function GridComponent({ label, value }: { label: string; value: string | boolean }) {
    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <Typography align="left"><strong>{label}:</strong> {value}</Typography>
        </Grid>
    );
}

function OrganizationDetails({ row }: { row: OrganizationRow & { config: string } }) {
    return (
        <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start">
            <GridComponent label="Name" value={row.name} />
            <GridComponent label="Type" value={row.type} />
            <GridComponent label="Realm" value={row.realm} />
            <GridComponent label="Country" value={row.country} />
            <GridComponent label="Support Email" value={row.support_email} />
            <GridComponent label="Active" value={row.active ? 'Yes' : 'No'} />
            <GridComponent label="Reporting" value={row.report_q} />
            <GridComponent label="Created At" value={row.created_at} />
            <GridComponent label="Updated At" value={row.updated_at} />
        </Grid>
    );
}

function OrganizationDetailsInEditMode({ row }: { row: OrganizationRow & { config: string } }) {
    return (
        <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start">
            <GridComponent label="Name" value={row.name} />
            <GridComponent label="Type" value={row.type} />
            <GridComponent label="Realm" value={row.realm} />
            <GridComponent label="Country" value={row.country} />
            <GridComponent label="Support Email" value={row.support_email} />
            <GridComponent label="Active" value={row.active ? 'Yes' : 'No'} />
            <GridComponent label="Reporting" value={row.report_q} />
        </Grid>
    );
}
