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
            "name": firstName+" "+lastName,
            userTag,
            email,
            phone,
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
            _id: resp?._id
          }})

          setProjects(resp?.projects)
        }
      } catch (error) {
        console.log({ error })
      }
    };
  
    tag && getAccount()
    console.log({ account });
    console.log({ projects });
  }, [router])
  

  return (
    <>
      <Head>
        <title>{account.name}</title>
        <meta name="description" content="page de compte" />
      </Head>
      <main className={`page ${styles.main}`}>
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
                      <BiCheck onClick={function(){updatePicture(editor === "cover" ? "coverPicture" : "profilPicture")}} />
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
          <div className={styles.topButtons}>
            <div className={styles.buttonSet}>
              <button className={styles.button} onClick={() => setEditor("infos")}>
                Modifier
                <HiPencil />
              </button>
              <button className={`offIcon ${styles.miniButton}`}>
                <RiVipCrown2Fill />
                <div className='oblic-line'></div>
              </button>
            </div>
            <Link href="/projects/new" className={styles.button}>
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
                  <div>
                    <p>{account?.phone || "Donnée absente !"}</p>
                  </div>
                </div>
                <div className='box2 p2'>
                  <MdOutlineEmail />
                  <div>
                    <p>{account?.email || "Donnée absente !"}</p>
                  </div>
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
                <div className='box2 p2'>
                  <GiSilence />
                  <div>
                    <p>Modifier mon mot de passe</p>
                  </div>
                </div>
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
                <div className='box2 p2 box2-red'>
                  <MdDelete />
                  <div>
                    <p>Supprimer mon compte</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
