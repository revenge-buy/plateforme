import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {  RiGroupFill } from 'react-icons/ri'
import { SlArrowDown } from 'react-icons/sl'
import { RiUserFollowFill } from 'react-icons/ri'
import { MdJoinInner, MdSettings } from 'react-icons/md'



import styles from './index.module.css'
import { useRouter } from 'next/router'
import client from '@/api/client'
import Link from 'next/link'

export default function Account() {

  const router = useRouter();
  const tag = router.query.userTag;
  
  const [account, setAccount] = useState({})
  const [accIsUser, setAccIsUser] = useState(false)
  const [projects, setProjects] = useState([])
  const [joinedProjects, setJoinedProjects] = useState([])

  useEffect(() => {
    async function getAccount(){
      try{
        const resp = await client.fetch(`
          * [_type == "seller" && userTag == "${tag}"]{
            "name": firstName+" "+lastName,
            userTag,
            "picture": profilPicture.asset->url,
            "cover": coverPicture.asset->url,
            "projects": *[_type == "project"  && archived == ${false} && references(^._id)] | order(_updatedAt, desc){
              _id,
              name,
              "description": *[_type == "product" && references(^._id)][0].description,
              "image": *[_type == "product" && references(^._id)][0].image.asset->url
            }[0...3],
            "joinedProjects": *[_type == "ProjectMembership" && references(^._id)][0...3]{
              Project->{
                _id,
                name,
                "description": *[_type == "product" && references(^._id)][0].description,
                "image": *[_type == "product" && references(^._id)][0].image.asset->url
              }
            }.Project
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
          }})
          const user = JSON.parse(localStorage.getItem('revenge-user'))

          if(user && user.userTag === resp?.userTag){
            setAccIsUser(true)
          } else {
            setAccIsUser(false)
          }

          setProjects(resp?.projects)
          setJoinedProjects(resp?.joinedProjects)
          console.log({ joinedProjects })
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
            <p>{account?.userTag || "@"}</p>
            {/* <span>" Je vend TSOUU !! "</span> */}
          </div>
          <div className={styles.topButtons}>
            {/* <div className={styles.buttonSet}>
              <button className={styles.button}>
                Modifier
                <HiPencil />
              </button>
              <button className={`offIcon ${styles.miniButton}`}>
                <RiVipCrown2Fill />
                <div className='oblic-line'></div>
              </button>
            </div> */}
            {!accIsUser
              ?<button className={styles.button}>
                Suivre {account?.name?.split(" ")[0]}
              </button>
              : <Link className={styles.button} href={`/account?tag=${account.userTag}`}>
                <MdSettings /> paramètres
              </Link>
            }
          </div>
          {/* <div className={`insert-box ${styles.contactInfos}`}>
            <p>
              <BsWhatsapp />
              655061836
            </p>
            <p>
              <FiMail />
              temgoua484@gmail.com
            </p>
          </div> */}
        </div>
        <div className={`${styles.body}`}>
          <section>
            <div className={styles.sectionTop}>
              <h3><RiGroupFill /> A créé</h3>
              <p><SlArrowDown /></p>
            </div>
            <div className={styles.sectionContent}>
              {projects.length > 0 ?
                <div className={styles.items}>
                  {projects.map(function(project, index){
                    return (
                      <Link className='box2' href={`/projects/${project._id || ""}`} key={index}>
                        <Image 
                          width={80}
                          height={80}
                          src={project?.image || "/product.jpg"}
                          alt="mon alt"
                        />
                        <div>
                          <h4>{project.name || ""}</h4>
                          <p>{project.description || ""}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                :<p className={styles.nothingText}>Rien pour le moment !</p>
              }
            </div>
          </section>
          <section>
            <div className={styles.sectionTop}>
              <h3><MdJoinInner /> A rejoint</h3>
              <p><SlArrowDown /></p>
            </div>
            <div className={styles.sectionContent}>
              {joinedProjects.length > 0 ?
                <div className={styles.items}>
                  {joinedProjects.map(function(project, index){
                    return (
                      <Link className='box2' href={`/projects/${project._id || ""}`} key={index}>
                        <Image 
                          width={80}
                          height={80}
                          src={project?.image || "/product.jpg"}
                          alt="mon alt"
                        />
                        <div>
                          <h4>{project.name || ""}</h4>
                          <p>{project.description || ""}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                :<p className={styles.nothingText}>Rien pour le moment !</p>
              }
            </div>
          </section>
          <section>
            <div className={styles.sectionTop}>
              <h3><RiUserFollowFill /> Suit</h3>
              <p><SlArrowDown /></p>
            </div>
            <div className={styles.sectionContent}>
              <p className={styles.nothingText}>Rien pour le moment !</p>
            </div>
          </section>
          <section>
            <div className={styles.sectionTop}>
              <h3><RiUserFollowFill /> Est suivi par</h3>
              <p><SlArrowDown /></p>
            </div>
            <div className={styles.sectionContent}>
              <p className={styles.nothingText}>Rien pour le moment !</p>
            </div>
          </section>
          {/* <section>
            <div className={styles.sectionTop}>
              <h3><BsActivity /> Activité récente</h3>
              <p><SlArrowDown /></p>
            </div>
            <div className={styles.sectionContent}>
              <p className={styles.nothingText}>Rien pour le moment !</p>
            </div>
          </section> */}
        </div>
        {/* <footer>
          <button onClick={logout}>Deconnexion<HiLogout /></button> 
        </footer> */}
      </main>
    </>
  )
}
