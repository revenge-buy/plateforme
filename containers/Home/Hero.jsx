import style from "@/styles/Home.module.css"
import Link from "next/link"
import { useState } from "react";

export default function Hero() {

  function Go() {
    const user = localStorage.getItem('rb-user');
    if(!user) {
      location.replace("/auth")
    } else {
      location.replace("/projects/new")
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