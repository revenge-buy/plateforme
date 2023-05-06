import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { AuthContext } from '@/context/auth'
import client from '@/api/client'
import Metas from '@/components/Metas'
import AuthBox from '@/containers/Auth/AuthBox'
import styles from '@/styles/Auth.module.css'
import ButtonContent from '@/components/ButtonContent'

const metas = {
  title: 'Connexion',
  metas: [
    {
      name: "description",
      content: 'Connectez vous à votre compte et rejoignez votre réseau.'
    }
  ]
}

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    message: "",
  })

  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    status: ""
  })

  const router = useRouter()
  const { SetUser } = useContext(AuthContext)
  
  function getUser(e) {
    e.preventDefault();
    if(!loadingStatus.loading){
      setLoadingStatus((ls) => ({ ...ls, loading: true, status: "pending" }))
      client.fetch(
        `
          * [_type == "seller" && email == "${user.email}"]{
            password,
            firstName,
            userTag,
            verified,
            confirmed
          }
        `
      )
        .then((resp) => {
          console.log(resp)
          
          if (resp[0]?.password == user.password) {
            let rbUser = {
              firstName: resp[0]?.firstName,
              email: user.email,
              userTag: resp[0]?.userTag,
              verified: resp[0]?.verified,
              confirmed: resp[0]?.confirmed
            }
            localStorage.setItem("revenge-user", JSON.stringify(rbUser));
            SetUser(rbUser)
            setLoadingStatus((ls) => ({ ...ls, loading: false, status: "succeed" }))
            router.push("/projects");
          } else {
            setUser((user) => ({ ...user, message: 'Mot de passe incorrecte' }))
            setLoadingStatus((ls) => ({ ...ls, loading: false, status: "failed" }))
            alert(user.message)
          }
        })
        .catch((error) => {
          console.log({ error })
          setUser("no user")
          setLoadingStatus((ls) => ({ ...ls, loading: false, status: "failed" }))
        })
    } else {
      alert("Connexion en cours, Veuillez patienter svp !")
    }
  }
    
  function handleChange(e) {
    const name = e.target.name;
    setUser((user) => ({ ...user, [name]: e.target.value}))
  }

  return (
    <div className={`page ${styles.auth}`}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className="section">
        <AuthBox
          title="Connexion" text="Connectez vous à votre compte."
          component={
            <form>
              <input className='input' name="email" type="email" placeholder='Entrez votre email' value={user.email} onChange={handleChange} />
              <input className='input' name="password" type="password" placeholder='Entrez votre mot de passe' value={user.password} onChange={handleChange} />
              {user.message !== "" && <p>{user.message}</p>}

              <button className='submit' type="submit" value="Connexion" onClick={getUser}>
                <ButtonContent
                  loading={loadingStatus.loading}
                  status={loadingStatus.status}
                  originalText="Connexion"
                />
              </button>
              <Link href='/auth/signup'>Créer un compte</Link>
            </form>
          } />
      </main>
    </div>
  )
}