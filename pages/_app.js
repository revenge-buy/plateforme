import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Header from '@/containers/Header'
import Footer from '@/containers/Footer'
import AuthProvider from '@/context/auth'

import '@/styles/globals.css'
import PageWaiter from '@/containers/PageWaiter'

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);

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
      <AuthProvider>
        <Header />
        {pageLoading
          ? <PageWaiter />
          : <Component {...pageProps} />}
        <Footer />
      </AuthProvider>
    </div>
  )
}