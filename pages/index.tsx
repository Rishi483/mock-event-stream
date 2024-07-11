import { Box, AppBar, Toolbar, Typography, Grid, Stack } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import Card from "../components/Card";

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      style={{ backgroundColor: "#EFF0F1" }}
    >
      <AppBar position="sticky" style={{ backgroundColor: "#fff", borderBottom: "1px solid #F8F8FA" }} elevation={0}>
        <Toolbar>
          <Typography sx={{ flexGrow: 1,fontWeight: "500",
              fontSize: "20px",display:"flex",alignItems:"center",gap:"4px" }}>
                <HomeIcon/>
            Home
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack mt={5} px={3}>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            <Card/>
            <Card/>
            <Card/>
          </Grid>
        </Stack>
    </Box>
  );
}
