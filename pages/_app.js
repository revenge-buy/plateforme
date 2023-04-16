import Header from '@/containers/Header'
import Footer from '@/containers/Footer'
import AuthProvider from '@/context/auth'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div className='app'>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </div>
  )
}