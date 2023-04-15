import Link from "next/link"
// import { useState } from "react";
import { GiShinyPurse } from "react-icons/gi"
import { BiMenuAltLeft, BiUser } from "react-icons/bi"
import { CiSettings } from 'react-icons/ci'

import style from './index.module.css'
import { useState } from "react";

export default function Footer() {

   // checking if code is from client or server side
  // let WINDOW = {};

  // if (typeof window !== "undefined") {
  //   // When code is on client-side. So we need to use actual methods and data.
  //   WINDOW = window;
  // } else {
  //   // When code is on server-side.

  //   // Other component are mostly server-side and need to match their logic and check their variable with other server-side components and logics.
  //   // So following code will be use for them to pass the logic checking.
  //   WINDOW = {
  //     document: {
  //       location: {},
  //     },
  //     localStorage: {
  //       getItem :() => {},
  //       setItem :() => {}
  //     },
  //   };
  // }

  // const [user, setUser] = useState(WINDOW.localStorage.getItem('rb-user'))
  // console.log(user)

  return (
    <footer className={style.footer}>
      <nav>
        <ul>
          <li><Link href='/projects'>
            {/* menu */}
            <BiMenuAltLeft />
          </Link></li>
          <li className={style.toggleMenu}>
            {/* {
              user ? 
              <> */}
                <button>
                  {/* compte */}
                  <BiUser />
                </button>
                <menu>
                  <Link href='/account'><CiSettings /> Paramètres</Link>
                  <Link href='/account'><BiUser />Profile</Link>
                  <div />
                </menu>
              {/* </> : <Link className={style.loginBtn} href="/auth">Connexion</Link>
            } */}
          </li>
          <li><Link href='/updates'>
            {/* updates */}
            <GiShinyPurse />
          </Link> </li>
          {/* <li className={style.toggleMenu}>
            <button>profile</button>
            <menu>
              <h4>menu</h4>
              <div />
            </menu>
          </li> */}
        </ul>
      </nav>
    </footer>
  )
}