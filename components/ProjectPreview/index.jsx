import styles from "./index.module.css"
import Image from "next/image"

export default function ProjectPreview() {
  return (
    <div className={styles.project}>
      <header>
        user
      </header>
      <section>
        <Image
          width={200}
          height={200}
          alt='titre du projet'
          src='/project1.jpg'
        />
      </section>
      <footer>
        <div>Suivre</div>
        <div>Rejoindre</div>
      </footer>
    </div>
  )
}