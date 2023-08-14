import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Script from 'next/script'

import { UserProvider } from '@auth0/nextjs-auth0/client'

import Header from '@/containers/Header'
import Footer from '@/containers/Footer'
import AuthProvider from '@/context/auth'
import PageWaiter from '@/containers/PageWaiter'

import * as gtag from "../gtag"

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  const handleRouteChange = () => {
    setPageLoading(true);
  };

  const handleRouteComplete = () => {
    setPageLoading(false);
  };  

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteComplete)
  }, [])
  

  return (
    <div className='app'>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <AuthProvider>
      <UserProvider>
        <Header />
        {pageLoading
          ? <PageWaiter />
          : <Component {...pageProps} />}
        <Footer />
      </UserProvider>
      </AuthProvider>
    </div>
  )
}