import { useState } from 'react'
import { useRouter } from 'next/router'

import client from '@/api/client'
import Metas from '@/components/Metas'
import AuthBox from '@/containers/Auth/AuthBox'
import styles from '@/styles/Auth.module.css'

const metas = {
  title: 'Sign Up',
  metas: [
    {
      name: "description",
      content: 'Créez n compte Gratuit et économisez dès maintenant surchacun de vos achats.'
    }
  ]
}

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    whatsapp: "",
    userTag: "",
    tagOk: false
  })

  const router = useRouter()
  
  function checkTag() {
    console.log(process.env.NEXT_SANITY_ID)
    client.fetch(
      `
        * [_type == "seller" && userTag == ${user.userTag}]{
          userTag
        }
      `
    )
      .then((resp) => {
          if(resp[0].userTag)
            {
            setUser((user) => ({ ...user, tagOk: false }))
            console.log(resp)
            console.log({ tagError: 'tag taken' });
            } else {
              setUser((user) => ({ ...user, tagOk: true }))
            }
        })
        .catch((error) => {
          console.log({ error })
        }) 
  }

  function createUser(e) {
    e.preventDefault();

    if (
      (user.email !== "" &&
      user.password !== "" &&
      user.confirmPassword !== "" &&
      user.firstName !== "" &&
      user.lastName !== "" &&
      user.userTag !== "") && user.password === user.confirmPassword && user.tagOk
    ) {
      client.create(
        {
          _type: "seller",
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.whatsapp,
          userTag: user.userTag
        }
      )
        .then((resp) => {
          console.log(ok)
        })
        .catch((error) => {
          console.log({ error })
        }) 
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
          title="Inscription" text="Créez votre compte en 5 minutes."
          component={
            <form>
              <input className='input' name="firstName" type="text" placeholder='Prénom' value={user.firstName} onChange={handleChange} />
              <input className='input' name="lastName" type="text" placeholder='Nom' value={user.lastName} onChange={handleChange} />
              <input className='input' name="userTag" type="text" placeholder={`Entrez un tag : ${user.firstName}-${user.lastName}`} value={user.userTag} onChange={handleChange} onBlur={checkTag} />
              <input className='input' name="email" type="email" placeholder='Entrez votre email' value={user.email} onChange={handleChange} />
              <input className='input' name="password" type="password" placeholder='Entrez votre mot de passe' value={user.password} onChange={handleChange} />
              <input className='input' name="confirmPassword" type="password" placeholder='Confirmez votre mot de passe' value={user.confirmPassword} onChange={handleChange} />
              <input className='input' name="whatsapp" type="number" placeholder="Entrez votre contact whatsapp" value={user.whatsapp} onChange={handleChange} />
              <p>{user.message}</p>
              <input className='submit' type="submit" value="S'inscrire" onClick={createUser} />
            </form>
          } />
      </main>
    </div>
  )
}