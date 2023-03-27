import Metas from '@/components/Metas'
import { List } from '@/containers'

import styles from "./index.module.css"

const metas = {
  title: "Tous les projets actifs d'acfat groupé",
  metas: [
    {
      name: "description",
      content: 'Rejoignez les projets qui correspondent à vos besoins'
    }
  ]
}

export default function Projects() {
  return (
    <>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={`page section ${styles.main}`}>
        <h2>Projets en cours</h2>
        <List />
      </main>
    </>
  )
}
