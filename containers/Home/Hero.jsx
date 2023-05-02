import Link from "next/link"
import { useContext } from "react";
import { BiGroup, BiInfoSquare } from "react-icons/bi";

import style from "@/styles/Home.module.css"
import Exploder from "@/components/Exploder";
import { AuthContext } from "@/context/auth";

export default function Hero() {

  const { SetUser } = useContext(AuthContext)

  function Go() {
    const user = localStorage.getItem('revenge-user');
    if(!user) {
      location.replace("/auth")
    } else {
      location.replace("/projects/new")
      SetUser(JSON.parse(user))
    }
  }

  return (
    <div className={`section ${style.hero}`}>
      <div className={`${style.heroContent}`}>
        <div className={`${style.heroMessages}`}>
          <h2>SIMPLIFIES TES GROUPAGES !</h2>
          <p>FAIT <br /> <b><Exploder text="EXPLOSER" /></b> <br /> TES VENTES !</p>
        </div>
        <div className={style.heroButtons} id="explanations">
          <button>
            <Link href="/projects/new">
              <BiGroup />
              Créer un groupage !
            </Link>
          </button>
          <button>
            <Link href="#advantages">
              C'est quoi l'avantage ?
              <BiInfoSquare />
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}