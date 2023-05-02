import style from "@/styles/Home.module.css"
import Link from "next/link"
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import { BiGroup, BiInfoSquare, BiPlus } from "react-icons/bi";

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
          <p>FAIT <br /> <b>EXPLOSER TES VENTES</b> <br /> avec des groupages automatisés !</p>
          {/* <div className={style.heroBoxes}>
            <div>
              <h3>Plus de clients</h3>
              <p>Nous faisons <b>Gratuitement</b> la promotion de vos produits !</p>
            </div>
            <div>
              <h3>Plus de</h3>
              <p>Lancez et gérez plusieurs groupages à la fois !</p>
            </div>
          </div> */}
          {/* <h3>Obtenez plus de clients</h3>
          <h3>Gérez plus de groupages</h3> */}
        </div>
        <div className={style.heroButtons} id="explanations">
          <button>
            <Link href="/projects/new">
              <BiGroup />
              Créer un groupage !
            </Link>
          </button>
          <button>
            <Link href="#advantage">
              Je comprend pas bien !
              <BiInfoSquare />
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}