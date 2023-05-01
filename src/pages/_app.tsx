import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import { AuthConsumer, AuthProvider } from 'contexts/auth/jwt-context';
import { createEmotionCache } from 'utils/create-emotion-cache';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "nprogress/nprogress.css";

import type { AppProps } from 'next/app';
import theme from 'theme';
import {useState} from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { QueryClient, QueryClientProvider, useQuery, Hydrate } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import '../libs/nprogress';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = (props: AppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
      retry:-1
    }
  }}));


  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Github Demo</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => {
                const showSlashScreen = !auth.isInitialized;

                return (
                  <>
                    <Head>
                      <meta name="viewport" content="initial-scale=1, width=device-width" />
                    </Head>
                    <ThemeProvider theme={theme}>
                      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                      <CssBaseline />

                      {showSlashScreen ? <SplashScreen /> : getLayout(<Component {...pageProps} />)}
                    </ThemeProvider>
                  </>
                );
              }}
            </AuthConsumer>
          </AuthProvider>
        </Hydrate>
        <Toaster/>
      <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default App;
