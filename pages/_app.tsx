import { useEffect } from 'react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp

