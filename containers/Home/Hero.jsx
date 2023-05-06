import Link from "next/link"
import { useContext } from "react";
import { BiGroup, BiInfoSquare } from "react-icons/bi";

import style from "@/styles/Home.module.css"
import Exploder from "@/components/Exploder";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";

export default function Hero() {

  const { SetUser } = useContext(AuthContext)
  const router = useRouter()
  function Go() {
    const user = localStorage.getItem('revenge-user');
    if(!user) {
      router.push("/auth")
    } else {
      router.push("/projects/new")
      SetUser(JSON.parse(user))
    }
  }

  return (
    <div id="hero" className={`section ${style.hero}`}>
      <div className={`${style.heroContent}`}>
        <div className={`${style.heroMessages}`}>
          <h2>SIMPLIFIEZ VOS GROUPAGES !</h2>
          <p>FAITES <br /> <b><Exploder text="EXPLOSER" /></b> <br /> VOS VENTES !</p>
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