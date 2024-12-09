import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link } from "react-router-dom";
import image1 from '../assets/404.jpg';

export default function Error() {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
          padding: 2,
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid sx={{ xs: 12, sm: 6, textAlign: 'center' }}>
              <img
                src={image1}
                alt=""
                style={{ width: '100%', height: 'auto' }}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6, textAlign: 'center' }}>
              <Typography variant="h6">
                The page you’re looking for doesn’t exist.
              </Typography>
              <Link to={`/`}>
                <Button variant="contained" sx={{ mt: 2 }}>Back Home</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}