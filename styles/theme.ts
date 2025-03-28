import { DefaultTheme } from "react-native-paper";
import colors from "./colors";

export const theme = {
  ...DefaultTheme,
  // Custom property
  myOwnProperty: true,
  // Black and white theme with shades like zinc-200 and zinc-500
  colors: {
    ...DefaultTheme.colors,
    primary: colors["zinc-500"],
    background: colors["zinc-200"],
    surface: colors["zinc-200"],
    accent: colors["zinc-500"],
    text: colors["zinc-500"],
    disabled: colors["zinc-200"],
    placeholder: colors["zinc-200"],
    backdrop: colors["zinc-500"],
  },
};
