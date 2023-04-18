import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { HiPencil, HiLogout } from 'react-icons/hi'
import { BiPlus } from 'react-icons/bi'
import { RiVipCrown2Fill, RiGroupFill, RiAlertFill } from 'react-icons/ri'
import { SlArrowDown } from 'react-icons/sl'
import { RiUserFollowFill } from 'react-icons/ri'
import { BsActivity, BsWhatsapp } from 'react-icons/bs'


import styles from './index.module.css'
import { useRouter } from 'next/router'
import client from '@/api/client'
import Link from 'next/link'
import { MdContactPage, MdContacts, MdDangerous, MdDelete, MdEmail, MdOutlineDangerous, MdOutlineEmail, MdSecurity } from 'react-icons/md'
import { GiSilence } from 'react-icons/gi'
import { CgDanger } from 'react-icons/cg'

export default function Account() {

  const router = useRouter();
  const tag = router.query.tag;
  
  const [account, setAccount] = useState({})
  const [projects, setProjects] = useState([])

  function logout(){
    localStorage.clear('revenge-user');
    router.push("/")
  }

  useEffect(() => {
    async function getAccount(){
      try{
        const resp = await client.fetch(`
          *[_type == "seller" && userTag == "${tag}"]{
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
            phone: resp?.phone
          }})

          setProjects(resp?.projects)
        }
      } catch (error) {
        console.log({ error })
      }
    };
  
    getAccount()
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
        <header>
          <div>
            <Image
              src={account?.cover || "/cover.jpg"}
              width={500}
              height={500}
              alt="mon alt"
            />
          </div>
          <Image
            src={account?.picture || "/profile.png"}
            width={80}
            height={80}
            alt="mon alt"
          />
        </header>
        <div className={styles.top}>
          <div className={styles.topInfos}>
            <h2>{account?.name || ""}</h2>
            <p className='box2'><Link href={`/${account?.userTag || "#"}`}>{account?.userTag || "@"}</Link></p>
          </div>
          <div className={styles.topButtons}>
            <div className={styles.buttonSet}>
              <button className={styles.button}>
                Modifier
                <HiPencil />
              </button>
              <button className={`offIcon ${styles.miniButton}`}>
                <RiVipCrown2Fill />
                <div className='oblic-line'></div>
              </button>
            </div>
            <button className={styles.button}>
              Ajouter un groupage !
              <BiPlus />
            </button>
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
                    <p>{account?.phone}</p>
                  </div>
                </div>
                <div className='box2 p2'>
                  <MdOutlineEmail />
                  <div>
                    <p>{account?.email}</p>
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
