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
    phone: 0,
    prevUserTag: "",
    userTag: "",
    tagOk: false,
  })

  const router = useRouter()
  
  function checkTag() {
    setUser((user) => ({ ...user, userTag: user.userTag.trim() }))

    user.userTag !== "" &&
    user.userTag !== "@" &&
    user.userTag !== user.prevUserTag &&
    client.fetch(
      `
        * [_type == "seller" && userTag == "${user.userTag}"]{
          userTag
        }
      `
    )
      .then((resp) => {
        console.log(resp, user.userTag)
          if(resp.length > 0)
            {
              setUser((user) => ({ ...user, tagOk: false }))
              console.log(resp)
              console.log({ tagTakenError: 'tag taken' });
              alert("Ce tag est déjà pris")
            } else {
              setUser((user) => ({ ...user, tagOk: true }))
              console.log("tag available")
            }
        })
        .catch((tegError) => {
          console.log({ tegError })
        })
    
    setUser((user) => ({ ...user, prevUserTag: user.userTag }))
  }

  function checkFields(object) {
    let entries = Object.entries(object)

    let result = true
    entries.map((entry) => {
      if (entry[1] === "") {
        result = false;
      }
    })

    result === false && alert("Tous les champs sont obligatoires")
    return result
  }

  async function checkUnics() {
    var emailOk = null;
    var phoneOk = null;
    // checking email uniqueness
    try {
      const emailRes = await client.fetch(
        `
          * [_type == "seller" && email == "${user.email}"]{
            email
          }
        `
      )
      if (emailRes) {
        if (emailRes.length > 0) {
          console.log(emailRes)
          console.log(false)
          console.log("Email Déjà pris !")
          emailOk = false
          return false
        } else {
          emailOk = true
          if (phoneOk !== null && phoneOk == true) {
            console.log("phone")
            console.log("email dispo")
            return true
          }
          console.log("email dispo")
        }
      }
    } catch(error) {
        console.log({ error })
    }
    
    // checking phone uniqueness
    try {
      const phoneRes = await client.fetch(
        `
          * [_type == "seller" && phone == "${parseInt(user.phone)}"]{
            phone
          }
        `
      )
      if (phoneRes) {
        if (phoneRes.length > 0) {
          console.log(phoneRes)
          console.log(false)
          console.log("Téléphones Déjà pris !")
          phoneOk = false
          return false
        } else {
          phoneOk = true
          if (emailOk !== null && emailOk == true) {
            console.log("phone dispo")
            console.log("email")
            return true
          }
          console.log("phone dispo")
        }
      }
    } catch (error) {
      console.log({ error })
      alert("Une erreur s'est produite lors de la vérification de votre téléphone")
    }
  }

  function checkPasswords() {
    if (user.password !== user.confirmPassword) {
      alert("Les mots de passes doivent être identiques")
      return false
    } 
    return true
  }
    
  function handleChange(e) {
    const name = e.target.name;
    setUser((user) => ({ ...user, [name]: e.target.value}))
  }
    
  function handleChangeTag(e) {
    var noAtValue = (((e.target.value.split("@").join("")).toLowerCase()).split(" ").join("-")).split("--").join("-")
    setUser((user) => ({ ...user, userTag: "@"+noAtValue}))
  }

  function handleBlur(e) {
    const name = e.target.name;
    setUser((user) => ({ ...user, [name]: user[name].trim()}))
  }

  async function createUser(e) {
    e.preventDefault();

    if (
      checkFields(user)
      && checkPasswords()
      // && checkUnics()
      && user.tagOk
    ) {
      try {
        const resp = await client.create(
          {
            _type: "seller",
            email: user.email.trim(),
            password: user.password.trim(),
            firstName: user.firstName.trim(),
            lastName: user.lastName.trim(),
            phone: parseInt(user.phone),
            userTag: user.userTag.trim()
          }
        )
        if (resp) {
          let rbUser = {
            email: resp.email,
            firstName: resp.firstName
          } 
          localStorage.setItem("rb-user", JSON.stringify(rbUser));
          router.push("/projects");
        }
      } catch (error) {
        alert("Une erreur s'est produite lors de la création de votre compte !")
        console.log({ error })
      }
    } else {
      alert("Veuillez Vérifier vos informations !")
    }
  }

  return (
    <div className={`page ${styles.auth}`}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className="section">
        <AuthBox
          title="Inscription" text="Créez votre compte en 5 minutes."
          component={
            <form>
              <input onBlur={handleBlur} className='input' name="firstName" type="text" placeholder='Prénom' value={user.firstName} onChange={handleChange} />
              <input onBlur={handleBlur} className='input' name="lastName" type="text" placeholder='Nom' value={user.lastName} onChange={handleChange} />
              <input className='input' name="userTag" type="text" placeholder={`Entrez un tag : ${"@"+(user.firstName).toLowerCase()}-${(user.lastName).toLowerCase()}`} value={user.userTag} onChange={handleChangeTag} onBlur={checkTag} />
              <input onBlur={handleBlur} className='input' name="email" type="email" placeholder='Entrez votre email' value={user.email} onChange={handleChange} />
              <input onBlur={handleBlur} className='input' name="password" type="password" placeholder='Entrez votre mot de passe' value={user.password} onChange={handleChange} />
              <input onBlur={handleBlur} className='input' name="confirmPassword" type="password" placeholder='Confirmez votre mot de passe' value={user.confirmPassword} onChange={handleChange} />
              <input className='input' name="phone" type="number" placeholder="Entrez votre contact whatsapp" value={user.phone} onChange={handleChange} />
              <p>{user.message}</p>
              <input className='submit' type="submit" value="S'inscrire" onClick={createUser} />
            </form>
          } />
      </main>
    </div>
  )
}