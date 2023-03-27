import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Account() {
  return (
    <>
      <Head>
        <title>Compte</title>
        <meta name="description" content="page de compte" />
      </Head>
      <main className={styles.main}>
        <h1>account</h1>
      </main>
    </>
  )
}
