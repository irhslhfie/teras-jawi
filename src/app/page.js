import DashboardContent from "@/components/DashboardContent";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function Home() {
  return (
    <DashboardContent>
      <Typography>This is specific content for Some Page.</Typography>
      <Button variant="text" color="primary">
        Anam
      </Button>
    </DashboardContent>
  );
}

