import GoToTop from '@/components/GoToTop'
import Metas from '@/components/Metas'
import { Hero, Steps, Advantages } from '@/containers/Home'

import styles from '@/styles/Home.module.css'

const metas = {
  title: 'Revenge Buy',
  metas: [
    {
      name: "description",
      content: 'Revenge-Buy, Économisez en faisant vos achats en groupe'
    },
    {
      property: 'og:image',
      content:"/favicon.png"
    }
  ]
}

export default function Home() {
  return (
    <div className={`${styles.home} page`}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={styles.main}>
        <Hero />
        {/* <Steps />
        <Partners /> */}
        <div className="section-gap" id="advantages"></div>
        <div className={`section page ${styles.homeContent}`}>
          <Advantages />
          <div className="section-gap" id="steps"></div>
          <Steps />
          <GoToTop tag="hero" />
        </div>
      </main>
    </div>
  )
}