import React from 'react'

import style from './style.module.css'
import BoxOne from '@/components/BoxOne'

const button = {
  text: "voir les étapes",
  type: "link",
  link: "#steps"
}

const Advantages = () => {
  return (
    <div className={`flexed ${style.advantages}`}>
      <h3>Avantages</h3>
      <div className={style.advantage}>
        <h4><b>A/</b> Gagnes <b>tous les clients</b> sur le marché avec <b>les meilleurs prix 🤤!</b></h4>
        <BoxOne
          text={`Tes petites commandes éparpillées sont rassemblées en grosses commandes 📦 afin de réduire tes frais et d'élargir ta marge 👇🏾, Ce qui signifie que tu peux offrir à tes clients des prix concurrentiels 🛍️.`}
          type="price"
          button={button}
        />
      </div>
      <div className={style.advantage}>
        <h4><b>B/</b> Économises <b>la moitié de ton temps</b> en automatisant tes groupages !<b></b></h4>
        <BoxOne
          text={`Lances 2 ... 3 ... N groupages à la fois, pour pouvoir élargir tes gains sans travailler plus, ce qui t'offrira plus de temps et d'énergie pour les autres choses importantes de ton business et de ton quotidien 😊!!`}
          type="time"
          button={button}
          dark
        />
      </div>
    </div>
  )
}

export default Advantages