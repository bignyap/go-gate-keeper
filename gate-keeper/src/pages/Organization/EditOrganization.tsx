import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { GetOrganizationById } from '../../libraries/Organization';
import { CustomizedSnackbars } from '../../components/Common/Toast';

export function EditOrganizationPage() {
    const navigate = useNavigate();

    return (
        <div className='container'>
            {EditOrganizationLoader(navigate)}
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
}

function EditOrganizationLoader(navigate: (path: string) => void): JSX.Element {
    const { id } = useParams<{ id: string }>();

    const [organization, setOrganization] = useState<OrganizationRow | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);

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
                <Box display="flex" alignItems="center">
                    <Typography variant="h4" style={{ marginRight: '8px' }}>{organization?.name}</Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Save />}
                        onClick={() => {
                            // Implement save functionality here
                            console.log("Save button clicked");
                        }}
                    >
                        SAVE
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Cancel />}
                    onClick={() => navigate(`/organizations/${id}/view`)}
                >
                    CANCEL
                </Button>
            </Box>
            <Card>
                <CardContent>
                    {organization && <OrganizationDetails row={organization} />}
                </CardContent>
            </Card>
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

function OrganizationDetails({ row }: { row: OrganizationRow }) {
    return (
        <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start">
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
