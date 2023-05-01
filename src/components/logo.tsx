import { useTheme } from "@mui/material/styles";
import Image from "next/image";

export const Logo = () => {
  const theme = useTheme();

  return <Image height={ 30 } width={ 30 } alt="logo" src={"/assets/logos/Github-Mark.png"} />;
};
