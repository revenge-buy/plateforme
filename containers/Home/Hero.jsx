import style from "@/styles/Home.module.css"
import Link from "next/link"
import { useContext } from "react";
import { AuthContext } from "@/context/auth";

export default function Hero() {

  const { SetUser } = useContext(AuthContext)

  function Go() {
    const user = localStorage.getItem('rb-user');
    if(!user) {
      location.replace("/auth")
    } else {
      location.replace("/projects/new")
      SetUser(JSON.parse(user))
    }
  }

  return (
    <div className={`section ${style.hero}`}>
      <h2>REVENGE <span>BUY</span></h2>
      <p>Économisez en faisant vos achats en groupe</p>
      <div>
        <button onClick={Go}>
          <Link href="#">Go !</Link>
        </button>
        <button>
          <Link href="/projects">Projets</Link>
        </button>
      </div>
    </div>
  )
}