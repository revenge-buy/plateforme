import Link from "next/link"
import { useContext } from "react"
import { AuthContext } from "@/context/auth"
// import { useState } from "react";
import { GiShinyPurse } from "react-icons/gi"
import { BiMenuAltLeft, BiUser } from "react-icons/bi"
// import { CiSettings } from 'react-icons/ci'

import style from './index.module.css'
import { useRouter } from "next/router"

export default function Footer() {

  const router = useRouter()
  const { SetUser } = useContext(AuthContext)

  function Go(){
    const user = JSON.parse(localStorage.getItem('revenge-user'));

    if(user !== null) {
      SetUser(user);
      router.push(`/account`);
    } else {
      router.push("/auth");
    }
  }

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

  // const [user, setUser] = useState(WINDOW.localStorage.getItem('revenge-user'))
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
                <button onClick={Go}>
                  {/* compte */}
                  <BiUser />
                </button>
                {/* <menu>
                  <Link onClick={() => Go("account")} href='#'><CiSettings /> Paramètres</Link>
                  <Link onClick={() => Go("profile")} href='#'><BiUser />Profile</Link>
                  <div />
                </menu> */}
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