import { useEffect } from 'react';
import { AppProps } from 'next/app';

// Remove Facebook _=_ hash fragments on page load
function cleanFacebookHash() {
  if (typeof window !== 'undefined') {
    // Check if the URL contains Facebook's _=_ hash
    if (window.location.hash === '#_=_') {
      // Remove the hash without causing a page reload
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  // Run hash cleanup on initial page load
  useEffect(() => {
    cleanFacebookHash();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 