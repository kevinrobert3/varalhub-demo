import '../styles/index.css'
import { AuthProvider } from '../lib/auth';
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
    <SnackbarProvider maxSnack={2}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }}
    hideIconVariant
      >
      <Component {...pageProps} />
      </SnackbarProvider>
  </AuthProvider>

  );
}

export default MyApp
