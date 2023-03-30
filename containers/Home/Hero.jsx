import style from "@/styles/Home.module.css"
import Link from "next/link"

export default function Hero() {
  return (
    <div className={`section ${style.hero}`}>
      <h2>REVENGE <span>BUY</span></h2>
      <p>Économisez en faisant vos achats en groupe</p>
      <div>
        <button>
          <Link href="/auth">Connexion</Link>
        </button>
        <button>
          <Link href="/projects">Projets</Link>
        </button>
      </div>
    </div>
  )
}