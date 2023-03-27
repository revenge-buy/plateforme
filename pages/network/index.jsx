import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Network() {
  return (
    <>
      <Head>
        <title>Votre réseau</title>
        <meta name="description" content="Élargissez quotidiennement votre réseau." />
      </Head>
      <main className={styles.main}>
        <h1>Réseau</h1>
      </main>
    </>
  )
}