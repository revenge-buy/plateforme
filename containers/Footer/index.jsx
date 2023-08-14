import Link from "next/link"
import { useContext } from "react"
import { useRouter } from "next/router"

import { useUser } from '@auth0/nextjs-auth0/client'

import { AuthContext } from "@/context/auth"
import { GiShinyPurse } from "react-icons/gi"
import { BiMenuAltLeft, BiUser } from "react-icons/bi"

import style from './index.module.css'

export default function Footer() {
  const { user } = useUser()

  const router = useRouter()
  const { SetUser } = useContext(AuthContext)

  function Go(){
    if(user) {
      console.log({footeruser: user})
      SetUser(user);
      router.push(`/account`);
    } else {
      router.push("/api/auth/login");
    }
  }

  return (
    <footer className={style.footer}>
      <nav>
        <ul>
          <li><Link href='/projects'>
            <BiMenuAltLeft />
          </Link></li>
          <li className={style.toggleMenu}>
            <button onClick={Go}>
              <BiUser />
            </button>
          </li>
          <li>
            <Link href='/updates'>
              <GiShinyPurse />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}