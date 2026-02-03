import { Box, CircularProgress } from "@mui/material";

interface Props {
  height?: string | number;
}

const PageLoader: React.FC<Props> = ({ height = "70vh" }) => {
  return (
    <Box
      sx={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default PageLoader;
