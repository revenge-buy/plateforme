import React from 'react'

import style from './style.module.css'
import BoxOne from '@/components/BoxOne'

const button = {
  text: "voir les étapes",
  type: "link",
  link: "#steps"
}

const Advantage = () => {
  return (
    <div className={style.advantage}>
      <h3>L'avantage</h3>
      <h4>Gagnes <b>tous les clients</b> sur le marché avec les meilleurs prix ! <br /><b>Lo miel 🤤 ... </b></h4>
      <BoxOne
        text={`Tes petites commandes éparpillées sont rassemblées en grosses commandes, réduisant tes frais de port, ainsi que tes prix`}
        type="price"
        button={button}
      />
    </div>
  )
}

export default Advantage