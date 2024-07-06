import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#EFF0F1',
    },
    primary: {
      main: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#EFF0F1',
          color: '#000000',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#EFF0F1',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#EFF0F1',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#000000',
          fontSize: '16px',
          padding: '10px 15px',
          height: '40px',
        },
        head: {
          backgroundColor: '#F8F8FA',
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '18px',
        },
        body: {
          backgroundColor: '#fff',
          color: '#000000',
        },
      },
    },
    
  },
  typography: {
    fontFamily: 'system-ui',
    allVariants: {
      fontFamily: 'system-ui',
      fontWeight: 300,
    },
    button: {
      textTransform: 'unset',
      fontWeight: 700,
    },
  },
});



export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
