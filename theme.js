import { createTheme } from '@mui/material/styles';

const themeConfig = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2', contrastText: '#ffffff' },
          secondary: { main: '#9c27b0', contrastText: '#ffffff' },
          background: { default: '#f5f5f5', paper: '#ffffff' },
          text: { primary: '#000000', secondary: '#555555' },
        }
      : {
          primary: { main: '#90caf9', contrastText: '#000000' },
          secondary: { main: '#ce93d8', contrastText: '#000000' },
          background: { default: '#121212', paper: '#1e1e1e' },
          text: { primary: '#ffffff', secondary: '#aaaaaa' },
        }),
  },
  typography: {
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    subtitle1: { fontSize: '1rem', fontWeight: 400 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 400 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 500 },
    caption: { fontSize: '0.75rem' },
    overline: { fontSize: '0.75rem', textTransform: 'uppercase' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
  },
});

const themeCache = {};

export const getTheme = (mode) => {
  const validatedMode = mode === 'dark' ? 'dark' : 'light';
  if (!themeCache[validatedMode]) {
    themeCache[validatedMode] = createTheme(themeConfig(validatedMode));
  }
  return themeCache[validatedMode];
};