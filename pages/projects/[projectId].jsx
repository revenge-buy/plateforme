import Head from 'next/head'
import styles from '@/styles/Home.module.css'
// import Metas from '@/components/Metas'


// const metas = {
//   title: "Ensemble Fendi Femme"
// }

export default function Project() {
  return (
    <>
      {/* <Metas title={metas.title} metas={metas.metas} /> */}
      <Head>
        <title></title>
        <meta name="description" content="page de compte" />
      </Head>
      <main className={styles.main}>
        <h1>projet</h1>
      </main>
    </>
  )
}