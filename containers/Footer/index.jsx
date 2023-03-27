import Link from "next/link"
import { useState } from "react";

import style from './index.module.css'

export default function Footer() {
  const [toggleMenu, setToggleMenu] = useState(false)

   // checking if code is from client or server side
  let WINDOW = {};

  if (typeof window !== "undefined") {
    // When code is on client-side. So we need to use actual methods and data.
    WINDOW = window;
  } else {
    // When code is on server-side.

    // Other component are mostly server-side and need to match their logic and check their variable with other server-side components and logics.
    // So following code will be use for them to pass the logic checking.
    WINDOW = {
      document: {
        location: {},
      },
      localStorage: {
        getItem :() => {},
        setItem :() => {}
      },
    };
  }
  WINDOW.localStorage.setItem('rb-user', 'durin')
  const user = WINDOW.localStorage.getItem('rb-user')
  return (
    <footer className={style.footer}>
      <nav>
        <ul>
          <li><Link href='/'>Home</Link> </li>
          <li><Link href='/projects'>projets</Link></li>
          <li class={style.toggleMenu}>
            <button>profile</button>
            <menu>
              <h4>menu</h4>
              <div>
                {/* <span></span><span></span><span></span> */}
              </div>
            </menu>
          </li>
          <li class={style.toggleMenu}>
            <button>Compte</button>
            <menu>
              <Link href='/account'>Paramètres</Link>
              <p>mode</p>
              <div>
                <span className={style.narrowSpan}></span><span className={style.narrowSpan}></span><span className={style.narrowSpan}></span>
              </div>
            </menu>
          </li>
        </ul>
      </nav>
    </footer>
  )
}