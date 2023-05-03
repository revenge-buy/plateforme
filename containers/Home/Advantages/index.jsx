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
        <h4><b>A/</b> Gagnes <b>tous les clients</b> sur le marché avec les meilleurs prix ! <br /><b>Lo miel 🤤 ... </b></h4>
        <BoxOne
          text={`Tes petites commandes éparpillées sont rassemblées en grosses commandes 📦, réduisant tes frais de port 👇🏾, ainsi que tes prix 👇🏾. Ce qui signifie que tu devient plus intéressant pour les clients 🛍️.`}
          type="price"
          button={button}
        />
      </div>
      <div className={style.advantage}>
        <h4><b>B/</b> Économises <b>la moitié de ton temps</b> en automatisant tes groupages !<b></b></h4>
        <BoxOne
          text={`Lances 2 ... 3 ... N groupages à la fois et laisses tes clients les rejoindre par eux même (après leur avoir partagé les liens 🔗), afin que tu  puisse utiliser ton temps pour les autres choses importantes de ton quotidien 😊!!`}
          type="time"
          button={button}
          dark
        />
      </div>
    </div>
  )
}

export default Advantages