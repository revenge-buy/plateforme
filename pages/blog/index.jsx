import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Un nouvel article chaque jour. L'ecommerce n'aura plus aucun secret pour vous !" />
      </Head>
      <main className={styles.main}>
        <h1>Blog</h1>
      </main>
    </>
  )
}
