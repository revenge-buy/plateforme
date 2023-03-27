import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Project() {
  return (
    <>
      <Head>
        <title>Projet</title>
        <meta name="description" content="page de compte" />
      </Head>
      <main className={styles.main}>
        <h1>projet</h1>
      </main>
    </>
  )
}