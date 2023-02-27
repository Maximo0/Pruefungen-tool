import { TextField } from "@mui/material";
import { Box } from "@mui/system";

const FilterControls = () => {
  return (
    <Box sx={{marginBottom: "1rem"}}>
      <TextField label="Search" fullWidth />
    </Box>
  );
};

export default FilterControls;
