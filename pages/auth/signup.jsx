import { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import client from '@/api/client'
import Metas from '@/components/Metas'
import AuthBox from '@/containers/Auth/AuthBox'
import styles from '@/styles/Auth.module.css'
import { AuthContext } from '@/context/auth'

const metas = {
  title: 'Sign Up',
  metas: [
    {
      name: "description",
      content: 'Créez n compte Gratuit et économisez dès maintenant surchacun de vos achats.'
    }
  ]
}

export default function SignUp() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: NaN,
    userTag: "",
    tagOk: NaN,
    emailOk: NaN,
    phoneOk: NaN
  })

  const { SetUser } = useContext(AuthContext)

  const router = useRouter()


  
  function checkTag() {
    setUser((user) => ({ ...user, userTag: user.userTag.trim() }))

    user.userTag !== "" &&
    user.userTag !== "@" &&
    !user.tagOk &&
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
              console.log({ tagTakenError: 'tag taken' });
            } else {
              setUser((user) => ({ ...user, tagOk: true }))
            }
        })
        .catch((tegError) => {
          console.log({ tegError })
        })    
  }

  function checkFieldUniq(e, fieldChecker, string) {
    string && handleBlur(e)
    const {name, value} = e.target
    console.log({e})
    console.log({name})

    value && value !== "" && value !== NaN &&
    client.fetch(
      `
        * [_type == "seller" && ${name} == ${string ? `"${value}"` : parseInt(value)}]{
          ${name}
        }
      `
    )
      .then((resp) => {
        console.log(resp, value)
        if(resp.length > 0)
          {
            setUser((user) => ({ ...user, [fieldChecker]: false }))
          } else {
            setUser((user) => ({ ...user, [fieldChecker]: true }))
          }
        })
        .catch((error) => {
          console.log({ error })
        })
  }

  function checkEmail(e) {
    handleBlur(e)

    user.email.trim() !== "" &&
    client.fetch(
      `
        * [_type == "seller" && email == "${user.email}"]{
          email
        }
      `
    )
      .then((resp) => {
          if(resp.length > 0)
            {
              setUser((user) => ({ ...user, emailOk: false }))
            } else {
              setUser((user) => ({ ...user, emailOk: true }))
            }
        })
        .catch((emailError) => {
          console.log({ emailError })
        })
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

    let _user = {
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      confirmPassword: user.confirmPassword,
      uesrTag: user.userTag,
      phone: user.phone,
      email: user.email
    }

    if (
      checkFields(_user)
      && checkPasswords()
      && user.tagOk
      && user.emailOk
      && user.phoneOk
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
            userTag: user.userTag.trim(),
            confirmed: false,
            verified: false
          }
        )
        if (resp) {
          let rbUser = {
            email: resp.email,
            firstName: resp.firstName,
            userTag: resp.userTag,
            verified: resp.verified,
            confirmed: resp.confirmed
          } 
          localStorage.setItem("revenge-user", JSON.stringify(rbUser));
          SetUser(rbUser)
          router.push(`/account?tag=${resp.userTag}`);
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
              <input className='input' name="userTag" type="text" placeholder={`Entrez un identifiant : ${"@"+(user.firstName).toLowerCase()}-${(user.lastName).toLowerCase()}`} value={user.userTag} onChange={handleChangeTag} onBlur={checkTag} />
              {user.tagOk === false 
                ? <p className="field-message">
                    <span className='field-message__wrong'>Déjà pris : </span>
                    Votre identifiant doit être unique !
                  </p> 
                : user.tagOk === true && 
                  <p className="field-message field-message__right">Identifiant disponible</p>
              }
              <input onBlur={(e) => checkEmail(e)} className='input' name="email" type="email" placeholder='Entrez votre email' value={user.email} onChange={handleChange} />
              {user.emailOk === false 
                ? <p className="field-message">
                    <span className='field-message__wrong'>Cet utilisateur existe déjà !</span>
                  </p> 
                : user.emailOk === true && 
                  <p className="field-message field-message__right">Email disponible</p>
              }
              <input onBlur={handleBlur} className='input' name="password" type="password" placeholder='Entrez votre mot de passe' value={user.password} onChange={handleChange} />
              <input onBlur={handleBlur} className='input' name="confirmPassword" type="password" placeholder='Confirmez votre mot de passe' value={user.confirmPassword} onChange={handleChange} />
              <input className='input' onBlur={(e) => checkFieldUniq(e, "phoneOk", false)} name="phone" type="number" placeholder="Entrez votre contact whatsapp" value={user.phone} onChange={handleChange} min={600000000} max={699999999} />
              {user.phoneOk === false 
                ? <p className="field-message">
                    <span className='field-message__wrong'>Déjà pris : </span>
                    Ce numéro est déjà utilisé !
                  </p> 
                : user.phoneOk === true && 
                  <p className="field-message field-message__right">Vous pouvez utiliser ce numéro !</p>
              }
              <p>{user.message}</p>

              <input className='submit' type="submit" value="S'inscrire" onClick={createUser} />
            </form>
          } />
      </main>
    </div>
  )
}