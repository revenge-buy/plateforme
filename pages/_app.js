import Header from '@/containers/Header'
import Footer from '@/containers/Footer'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div className='app'>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}