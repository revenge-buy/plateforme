import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Account() {
  return (
    <>
      <Head>
        <title>article</title>
        <meta name="description" content="page de compte" />
      </Head>
      <main className={styles.main}>
        <h1>article</h1>
      </main>
    </>
  )
}