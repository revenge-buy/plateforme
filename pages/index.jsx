import Image from 'next/image'

import Metas from '@/components/Metas'
import { Hero, Steps, Partners } from '@/containers/Home'

import styles from '@/styles/Home.module.css'

const metas = {
  title: 'Revenge-Buy, Achats groupés, maximiser les profits.',
  metas: [
    {
      name: "description",
      content: 'Revenge-Buy, Achats groupés, maximiser les profits.'
    }
  ]
}

export default function Home() {
  return (
    <div className={`page ${styles.home}`}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={styles.main}>
        <Hero />
        <Steps />
        <Partners />
      </main>
    </div>
  )
}