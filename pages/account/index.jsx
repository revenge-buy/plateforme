import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HiPencil, HiLogout } from 'react-icons/hi'
import { BiCheck, BiPlus } from 'react-icons/bi'
import { RiVipCrown2Fill, RiAlertFill } from 'react-icons/ri'
import { BsEyeFill, BsWhatsapp } from 'react-icons/bs'
import { MdChangeCircle, MdContacts, MdDelete, MdOutlineEmail, MdSecurity } from 'react-icons/md'
import { GiSilence } from 'react-icons/gi'
import { CgClose } from 'react-icons/cg'

import styles from './index.module.css'
import client from '@/api/client'
import Loader from '@/components/Loader'
import DarkLoader from '@/components/DarkLoader'
import ButtonContent from '@/components/ButtonContent'
import GoToTop from '@/components/GoToTop'

export default function Account() {

  const router = useRouter();
  const tag = router.query.tag;
  
  const [account, setAccount] = useState({})
  const [projects, setProjects] = useState([])
  const [editor, setEditor] = useState(null)
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  // used in pupup, in case if fileDataURL is null
  const [popImage, setPopImage] = useState(null)

  const [process, setProcess] = useState({
    loading: false,
    status: ""
  })

  const [editing, setEditing] = useState({
    phone: null,
    email: "",
    editingNames: false,
    firstName: "",
    lastName:  "",
    checkingPassword: false,
    currentPassword: "",
    currPassOk: false,
    password: "",
    passwordConfirm: "",
    passwordMessage: "",
    type: "",
    loading: false,
    status: ""
  })

  function logout(){
    localStorage.clear('revenge-user');
    router.push("/")
  }

  function viewPicture(type){
    setFileDataURL(null)
    setPopImage(function(image) {
      return (
        type === "cover"
        ? (account?.cover || "/cover.jpg")
        : (account?.picture || "/profile.png")
      )
    })
    setEditor(type)
  }

  function setPicture(e){
    const _file = e.target.files[0];
    setFile(_file);
    setEditor(e.target.name);
    console.log(editor)
  }

  function changeCover(){
    console.log({file})
    console.log({fileDataURL})
    client.assets
      .upload('image', file, {
        contentType: file.type,
        filename: file.name
      })
      .then(async function(imageAsset){
        try {
          const resp = await client.patch(account._id)
            .set({
              coverPicture: {
                _type: 'image',
                asset: {
                  _type: "reference",
                  _ref: imageAsset?._id
                }
              }
            })
            .commit()
          console.log({ changeCoverResp: resp })
          router.reload()
        } catch (updateError) {
          console.log({ updateError })
        }
      })
      .catch(function(assetError){
        console.log({ assetError })
      })
  }

  function updatePicture(imageType){
    if(!process.loading){
      setProcess({ loading: true, status: "pending" })
      client.assets
        .upload('image', file, {
          contentType: file.type,
          filename: file.name
        })
        .then(async function(imageAsset){
          try {
            const resp = await client.patch(account._id)
              .set({
                [imageType]: {
                  _type: 'image',
                  asset: {
                    _type: "reference",
                    _ref: imageAsset?._id
                  }
                }
              })
              .commit()
            setProcess({ loading: false, status: "succeed" })
            console.log({ changeCoverResp: resp })
            router.reload()
          } catch (updateError) {
            setProcess({ loading: false, status: "failed" })
            console.log({ updateError })
          }
        })
        .catch(function(assetError){
          setProcess({ loading: false, status: "failed" })
          console.log({ assetError })
        })
    } else {
      alert("Modification en cours, veuillez patienter !")
    }
  }

  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader?.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [file])
  

  useEffect(() => {async function getAccount(){
      try{
        const resp = await client.fetch(`
          *[_type == "seller" && userTag == "${tag}"]{
            _id,
            firstName,
            lastName,
            "name": firstName+" "+lastName,
            userTag,
            email,
            phone,
            password,
            "picture": profilPicture.asset->url,
            "cover": coverPicture.asset->url,
            "projects": *[_type == "project" && references(^._id)] | order(_updatedAt, desc){
              _id,
              name,
              "description": *[_type == "product" && references(^._id)][0].description,
              "image": *[_type == "product" && references(^._id)][0].image.asset->url
            }[0...3],
          }[0]
        `)

        if(resp){
          console.log({ resp })
          setAccount(function(acc){return { 
            ...acc, 
            name: resp?.name,
            userTag: resp?.userTag,
            picture: resp?.picture,
            cover: resp?.cover,
            email: resp?.email,
            phone: resp?.phone,
            _id: resp?._id,
            password: resp?.password,
            firstName: resp?.firstName,
            lastName: resp?.lastName
          }})

          setProjects(resp?.projects)

          setEditing(function(ed){
            return {
              ...ed,
              firstName: resp?.firstName,
              lastName: resp?.lastName,
              phone: resp?.phone,
              email: resp?.email,
            }
          })
        }
      } catch (error) {
        console.log({ error })
      }
    };
  
    tag && getAccount()
    console.log({ account });
    console.log({ projects });
  }, [router])
  
  function checkPassword(){
    const result = editing.currentPassword === account?.password
    setEditing(function(ed){
      return {
        ...ed,
        currPassOk: result,
        passwordMessage: result ? "" : "Mauvais mot de passe !",
        checkingPassword: result
      }
    })
  }

  function handleEdit(type){
    setEditing((e) => ({ 
      ...e,
      type,
      loading: false,
      status: ""
    }))
  }

  function handleUpdate(type, value){
    if(!editing.loading){
      setEditing((e) => ({
        ...e,
        loading: true,
        status: "pending"
      }))
      client
        .patch(account?._id)
        .set({[type]: value})
        .commit()
        .then(function(resp){
          setEditing((e) => ({
            ...e,
            loading: false,
            status: "succeed",
            type: ""
          }))

          setAccount(function(acc){return { 
            ...acc,
            [type]: value
          }})
          return {resp}
        })
        .catch(function(error){
          setEditing((e) => ({
            ...e,
            loading: false,
            status: "failed"
          }))

          return {error}
        })
    }
  }

  async function updatePassword(e){
    e.preventDefault()
    if(editing.password === editing.passwordConfirm){
      if(editing.password.length > 5){
        const resp = handleUpdate("password", editing.password)

        await resp?.resp && setEditing(function(ed){
          return { ...ed, passwordMessage: "", checkingPassword: false, password:"", currentPassword: "", passwordConfirm: "", type: "", currPassOk: false}
        })
      } else {
        setEditing(function(ed){
          return { ...ed, passwordMessage: "Le mot de passe doit contenir plus de 5 caractères." }
        })
      }
    } else {
      setEditing(function(ed){
        return { ...ed, passwordMessage: "Les mots de passes doivent être identiques."}
      })
    }
    
  }

  return (
    <>
      <Head>
        <title>{account.name}</title>
        <meta name="description" content="page de compte" />
      </Head>
      <main id="top" className={`page ${styles.main}`}>
        { editor !== null && 
          <div className="popup">
            <div className="popup-header">
              <h4>
                Éditez votre profile !
              </h4>
              <CgClose onClick={() => setEditor(null)} />
            </div>
            <div>
              { 
                <div className={`popup-box ${styles.editorBox}`}>
                {
                  fileDataURL ?
                    <Image src={fileDataURL} alt="preview" width={200} height={200} />
                    : <Image src={popImage || "/cover.jpg"} alt="preview" width={200} height={200} />
                }
                  <div className={styles.editorBoxButtons}>
                    {fileDataURL && <div className={`box2 ${styles.editorBoxButton}`}>
                      {!process.loading
                        ? <BiCheck onClick={function(){updatePicture(editor === "cover" ? "coverPicture" : "profilPicture")}} />
                        : <Loader />
                      }
                    </div>}
                    <div className={`box2 ${styles.editorBoxButton}`}>
                      <MdChangeCircle />
                      <input type="file" accept='image/*' name="cover" multiple={false} onChange={setPicture} />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        <header>
          <div className={styles.coverPicture}>
            <Image
              src={account?.cover || "/cover.jpg"}
              width={500}
              height={500}
              alt="mon alt"
            />
            <div className={`${styles.toggleMenu}`}>
              <BsEyeFill className='box2' onClick={function(){viewPicture("cover")}} />
              <div className={`box2 ${styles.toggleMenuInput}`}>
                <HiPencil />
                <input type="file" accept='image/*' name="cover" multiple={false} onChange={setPicture} />
              </div>
            </div>
          </div>
          <div className={styles.profilePicture}>
            <Image
              src={account?.picture || "/profile.png"}
              width={80}
              height={80}
              alt="mon alt"
            />
            <div className={`${styles.profileMenu}`}>
              <BsEyeFill className='box2' onClick={function(){viewPicture("profile")}} />
              <div className={`box2 ${styles.profileMenuInput}`}>
                <HiPencil />
                <input type="file" accept='image/*' name="profile" multiple={false} onChange={setPicture} />
              </div>
            </div>
          </div>
        </header>
        <div className={styles.top}>
          <div className={styles.topInfos}>
            <h2>{account?.name || ""}</h2>
            <p className='box2 box2-blue'><Link href={`/${account?.userTag || "#"}`}>
              {account?.userTag || "@"}
              <BsEyeFill />
            </Link></p>
          </div>
          {/* Names editing */}
          {editing.editingNames &&
            <section>
              <div className={styles.sectionContent}>
                <div className={styles.items}>
                  <div className='box2 p2'>
                    <BsWhatsapp />
                    <div className={styles.itemValue}>
                      {editing.type !== "firstName"
                        ? <p>{account?.firstName || "Donnée absente !"}</p>
                        : <input
                        onBlur={function(){
                          setEditing(function(ed){
                            return {
                              ...ed,
                              type: ""
                            }
                          })
                        }} type="text" value={editing.firstName} onChange={function(e){setEditing(function(ed){
                          return {
                            ...ed,
                            firstName: e.target.value
                          }
                        })}} />
                      }
                    </div>
                    {editing.type !== "firstName"
                      ? <HiPencil onClick={function(){handleEdit("firstName")}} />
                      : editing.loading 
                        ? <DarkLoader />
                        : <BiCheck onClick={function(){handleUpdate("firstName", editing.firstName.trim())}} />
                    } 
                  </div>

                  <div className='box2 p2'>
                    <MdOutlineEmail />
                    <div className={styles.itemValue}>
                      {editing.type !== "lastName"
                        ? <p>{account?.lastName || "Donnée absente !"}</p>
                        : <input
                        onBlur={function(){
                          setEditing(function(ed){
                            return {
                              ...ed,
                              type: ""
                            }
                          })
                        }} type="string" value={editing.lastName} onChange={function(e){setEditing(function(ed){
                          return {
                            ...ed,
                            lastName: e.target.value
                          }
                        })}} />
                      }
                    </div>
                    {editing.type !== "lastName"
                      ? <HiPencil onClick={function(){handleEdit("lastName")}} />
                      : editing.loading 
                        ? <DarkLoader />
                        : <BiCheck onClick={function(){handleUpdate("lastName", editing.lastName.trim())}} />
                    } 
                  </div>
                </div>
              </div>
            </section>
          }
          <div className={styles.topButtons}>
            <div className={styles.buttonSet}>
              <button className={styles.button} onClick={() => {
                setEditing(function(ed){
                return { ...ed, editingNames: !ed.editingNames }
                })
              }}>
                {editing.editingNames ? "Fermer" : "Modifier"}
                <HiPencil />
              </button>
              <button className={`offIcon ${styles.miniButton}`}>
                <RiVipCrown2Fill />
                <div className='oblic-line'></div>
              </button>
            </div>
            <Link href="/projects/new" id="names" className={styles.button}>
              Ajouter un groupage
              <BiPlus />
            </Link>
          </div>
        </div>
        <div className={`${styles.body}`}>
          <section>
            <div className={styles.sectionTop}>
              <h3><MdContacts /> Contacts</h3>
              
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.items}>
                <div className='box2 p2'>
                  <BsWhatsapp />
                  <div className={styles.itemValue}>
                    {editing.type !== "phone"
                      ? <p>{account?.phone || "Donnée absente !"}</p>
                      : <input
                      onBlur={function(){
                        setEditing(function(ed){
                          return {
                            ...ed,
                            type: ""
                          }
                        })
                      }} type="number" value={editing.phone} onChange={function(e){setEditing(function(ed){
                        return {
                          ...ed,
                          phone: e.target.value
                        }
                      })}} />
                    }
                  </div>
                  {editing.type !== "phone"
                    ? <HiPencil onClick={function(){handleEdit("phone")}} />
                    : editing.loading 
                      ? <DarkLoader />
                      : <BiCheck onClick={function(){handleUpdate("phone", parseInt(editing.phone))}} />
                  } 
                </div>

                <div className='box2 p2'>
                  <MdOutlineEmail />
                  <div className={styles.itemValue}>
                    {editing.type !== "email"
                      ? <p>{account?.email || "Donnée absente !"}</p>
                      : <input
                      onBlur={function(){
                        setEditing(function(ed){
                          return {
                            ...ed,
                            type: ""
                          }
                        })
                      }} type="email" value={editing.email} onChange={function(e){setEditing(function(ed){
                        return {
                          ...ed,
                          email: e.target.value
                        }
                      })}} />
                    }
                  </div>
                  {editing.type !== "email"
                    ? <HiPencil onClick={function(){handleEdit("email")}} />
                    : editing.loading 
                      ? <DarkLoader />
                      : <BiCheck onClick={function(){handleUpdate("email", editing.email)}} />
                  } 
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className={styles.sectionTop}>
              <h3><MdSecurity /> Sécurité</h3>
              
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.items}>
                <div className='box2 p2' onClick={function(){
                  setEditing(function(ed){
                    return { ...ed, type: "password", checkingPassword: true }
                  })
                }}>
                  <GiSilence />
                  <div className={`${editing.type === "password" && styles.itemValue}`}>
                    {(editing.type !== "password" || !editing.checkingPassword)
                      ? <p>Modifier mon mot de passe</p>
                      : <input
                        type="password" 
                        name="pass" 
                        placeholder='Mot de passe actuel' 
                        value={editing.currentPassword} onChange={function(e){
                          setEditing(function(ed){
                            return { ...ed, currentPassword: e.target.value }
                          })
                        }} 
                        onBlur={function(){
                          setEditing(function(ed){
                            return { ...ed, checkingPassword: false }
                          })
                        }}
                      />
                    }
                  </div>
                  {(editing.type !== "password" || !editing.checkingPassword)
                    ? <HiPencil />
                    : (editing.loading && editing.checkingPassword)
                      ? <DarkLoader />
                      : <BiCheck onClick={checkPassword} />
                  }
                </div>

                {editing.type === "password" && editing.passwordMessage !== "" && <p>{editing.passwordMessage}</p>}
                
                {(editing.type === "password" && editing.currPassOk) && 
                <form>
                  <input type="password" className="input-set input" placeholder='Nouveau mot de passe' value={editing.password} onChange={function(e){
                    setEditing(function(ed){
                      return {
                        ...ed,
                        password: e.target.value
                      }
                    })
                  }} />
                  <input type="password" className="input-set input" placeholder='Confirmez mot de passe' value={editing.passwordConfirm} onChange={function(e){
                    setEditing(function(ed){
                      return {
                        ...ed,
                        passwordConfirm: e.target.value
                      }
                    })
                  }} />
                  <div>
                    <button 
                      type="submit" 
                      className="submit"
                      onClick={updatePassword}
                    >
                      <ButtonContent
                        loading={editing.loading}
                        status={editing.status}
                        originalText="Confirmer"
                      />
                    </button>
                    <button 
                      className="submit submit__empty"
                      onClick={function(e){
                        e.preventDefault()
                        setEditing(function(ed){
                          return { ...ed, type: "", currPassOk: false, checkingPassword: false, currentPassword: "", passwordConfirm: "", password: "", passwordMessage: "" }
                        })
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </form> }
              </div>
            </div>
          </section>
          <footer>
            <button onClick={logout}>Deconnexion<HiLogout /></button> 
          </footer>
          <section>
            <div className={styles.sectionTop}>
              <h3><RiAlertFill /> Zone de danger</h3>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.items}>
                <p className='box2 p2 box2-red'>
                  <MdDelete />
                  <div>
                  <p>Supprimer mon compte</p>
                  </div>
                </p>
              </div>
            </div>
          </section>
          {/* <footer> */}
            <GoToTop noGap tag="top" />
          {/* </footer> */}
        </div>
      </main>
    </>
  )
}
