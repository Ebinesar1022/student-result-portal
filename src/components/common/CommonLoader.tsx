import { Box } from "@mui/material";
import { PropagateLoader } from "react-spinners";

interface Props {
  size?: number;
}

const CommonLoader: React.FC<Props> = ({ size = 15 }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PropagateLoader size={size} />
    </Box>
  );
};

export default CommonLoader;
