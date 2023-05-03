import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { AuthContext } from '@/context/auth'
import client from '@/api/client'
import Metas from '@/components/Metas'
import AuthBox from '@/containers/Auth/AuthBox'
import styles from '@/styles/Auth.module.css'

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
    // loading: "false"
  })

  const router = useRouter()
  const { SetUser } = useContext(AuthContext)
  
  function getUser(e) {
    e.preventDefault();

    // setUser((user) => ({ ...user, loading: true }))
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
          router.push("/projects");
        } else {
          setUser((user) => ({ ...user, message: 'Mot de passe incorrecte' }))
          alert(user.message)
        }
        // return {
        //   props: {
        //     user: resp?.data?.userTag
        //   }
        // }
      })
      .catch((error) => {
        console.log({ error })
        // return {
        //   props: {
        //     user: ""
        //   }
        // }
        setUser("no user")
      }) 
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

              <input className='submit' type="submit" value="Connexion" onClick={getUser} />
              <Link href='/auth/signup'>Créer un compte</Link>
            </form>
          } />
      </main>
    </div>
  )
}

// export async function getStaticProps() {
//   try {
//     const user = await client.fetch(
//       `
//         * [_type == "seller" && email="temgoua484@gmail.com"]{
//           userTag
//         }
//       `
//     );

//     return {
//       props: {
//         user
//       }
//     }
//   } catch (error) {
//     console.log({ error })
//     return {
//       props: {
//         user: ""
//       }
//     }
//   }
// }