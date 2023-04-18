import styles from './project.module.css'
import Metas from '@/components/Metas';
import client from '@/api/client';
import Image from 'next/image';

import { FaFirstOrder, FaSortAmountDownAlt, FaSortAmountUp } from 'react-icons/fa'
import { GiConsoleController, GiPodiumWinner, GiPriceTag, GiPrivateFirstClass } from 'react-icons/gi'
import { TbDiscountCheckFilled, TbInfoSquareRoundedFilled, TbOutbound } from 'react-icons/tb'
import { RiUserFollowFill, RiCloseLine } from 'react-icons/ri'
import { MdJoinInner, MdOutlineProductionQuantityLimits } from 'react-icons/md'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CgClose, CgRowFirst } from 'react-icons/cg';
import { deleteMembership, joinProject, updateMembership } from '@/helpers/projects';
import { BiFirstAid, BiFirstPage, BiShare, BiTrash } from 'react-icons/bi';
import { BsShare } from 'react-icons/bs';
 
export default function Project({ projects }) {
  const project = projects[0];
  const [joining, setJoining] = useState(false)
  const [quantity, setQuantity] = useState(NaN)
  const [userEmail, setUserEmail] = useState("")
  const [members, setMembers] = useState([])
  const [fullMembers, setFullMembers] = useState([])
  const [userIsMember, setUserIsMember] = useState(false)
  const [userIsCreator, setUserIsCreator] = useState(false)
  const [membershipId, setMembershipId] = useState("") 
  
  const router = useRouter()

  // run this to update membership status when the page loads for the firs time
  useEffect(() => {
    client.fetch(`
    *[_type == "project" && _id == "${project?._id}"][0]{
      _id,
      "members": *[_type == "ProjectMembership" && references(^._id)]{
        seller->{
          email
        }
      }
    }
    `)
    .then(function(resp){
      console.log({ resp })
      setMembers(resp?.members)
      console.log({members})
    })
    .catch(function(error){
      console.log({ error })
    })
  }, [router])

  // Run this after we've found the members list of the project, in other to determine if the current user is part of them

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('revenge-user'))

    if(user){
      if(user.userTag !== project?.creator?.userTag){
        setUserEmail(user.email)
        console.log({ userEmail })
        const filteredMembers = members?.filter(function(member){ return member?.seller?.email === user.email });
        console.log({filteredMembers})
    
        if(filteredMembers.length > 0){
          setUserIsMember(true)
          console.log({userIsMember})
        }
      } else {
        setUserIsCreator(true)
       }
    } 
    
  }, [members])

  // run this if user is project member
  useEffect(() => {
    client.fetch(`
      *[_type == "project" && _id == "${project?._id}"][0]{
        _id,
        "memberships": *[_type == "ProjectMembership" && references(^._id)]{
          seller->{
            userTag,
            email,
            "name": firstName + " " + lastName,
            "picture": profilPicture.asset->url
          },
          _createdAt,
          offer,
          _id
        }
      }
    `)
    .then(function(resp){
      console.log({fullMembers: resp})
      setFullMembers(resp?.memberships)
      console.log({fullStateMembers: fullMembers})
    })
    .catch(function(recallingMembersError){
      console.log({recallingMembersError})
    })
  }, [userIsMember, userEmail])
  

  // run this when user clicks on join button
  function handleOpenJoin(){
    if(!userIsCreator){
      setJoining(true);
      // if(userIsMember){
      //   client.fetch(`
      //     *[_type == "seller" && email == "${userEmail}"]{
      //       _id,
      //       "membership": *[_type == "ProjectMembership" && references(^._id)][0]{
      //         _id,
      //         offer
      //       } 
      //     }[0]
      //   `)
      //   .then(function(resp){
      //     setQuantity(resp?.membership?.offer);
      //     setMembershipId(resp?.membership?._id);
      //   })
      // }
      if(userIsMember){
        client.fetch(`
          *[_type == "project" && _id == "${project?._id}"][0]{
            _id,
            "memberships": *[_type == "ProjectMembership" && references(^._id)]{
              seller->{
                email,
                userTag,
                _id
              },
              _id,
              offer
            } 
          }
        `)
        .then(function(resp){
          console.log({resp1: resp})
          resp?.memberships?.map(function(ms){
            if(ms.seller.email === userEmail){
              setQuantity(ms?.offer);
              setMembershipId(ms?._id);
            }
          })
        })
        .catch(function(error){
          console.log({error1: error})
        })
      } else {
        console.log("user not a member")
      }
    } else {
      router.push(`/projects/${project?._id}?edit=true`)
    }
  }

  function handleJoin(){
    const user = JSON.parse(localStorage.getItem("revenge-user"))
    let userId = ""

    if (quantity > 1) {
      if(user?.email){
        if(!userIsMember){
          client.fetch(`
            *[_type == "seller" && email == "${user?.email}"]{
              _id
            }[0]
          `)
          .then((resp) => {
            userId = resp._id;
            joinProject(userId, project?._id, quantity, userIsMember);
            setJoining(false)
          })
          .catch(function(error){
            console.log(error)
          })
        } else {
          updateMembership(membershipId, quantity);
          setJoining(false)
        }
      }
    } else {
      alert("Vous devez acheter au minimum 1e unité pour rejoindre ce projet !")
    }

  }

  function handleLeaveProject(){
    deleteMembership(membershipId);
    setJoining(false)
    setUserIsMember(false)

  }


  const [imageUp, setImageUp] = useState(false)

  const metas = {
    title: project?.name || "",
    metas: [
      {
        name: "description",
        content: project?.product?.description || ""
      },
      {
        property: 'og:image',
        content: project?.product?.productImage || "/product.jpg"
      }
    ]
  }

  return (
    <div className={styles.project}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={`page ${styles.main}`}>
        <Image
          className={styles.back_image}
          width={100}
          height={100}
          alt={project?.product?.title || "Titre du projet"}
          src={project?.productImage || "/product.jpg"}
        />
        {imageUp && 
          <div className={`popup ${styles.image_up_wrapper}`}>
            <div className="popup-header">
              <h3>{project?.product?.title}</h3>
              <RiCloseLine onClick={() => setImageUp(false)} />
            </div>
            <div className="popup-box2">
              <Image
                className={styles.image_up}
                width={800}
                height={600}
                alt={project?.product?.title || "Titre du projet"}
                src={project?.productImage || "/product.jpg"}
              />
              <Link target="_blank" className={styles.image_up_button} href={project?.product?.url}>
                Voir le produit
                <TbOutbound /> 
              </Link>
            </div>
          </div>
        }
        {joining &&
          <div className="popup">
            <div className="popup-header" onClick={function(){setJoining(false)}}>
                <h4>Combien en voulez vous ?</h4>
              <CgClose />
            </div>
            <div className="popup-box">
              <form action="">
                <div className="input-set">
                  <label htmlFor="">Quantité</label>
                  <input className="input-set input" type="number" value={quantity} onChange={function(e){setQuantity(parseInt(e.target.value))}} placeholder="Combien en voulez vous ?" />
                  <p>Cela vous fera : {project?.product?.projectUnitValue * parseInt(quantity) || "0"} XAF</p>
                </div>
                <div className="input-set">
                  <div className="submit" onClick={handleJoin}>{userIsMember ? "Modifier" : "Rejoindre"}</div>
                </div>
              </form>
            </div>
            {userIsMember && <div className="popup-box-footer" onClick={handleLeaveProject}>
              Quitter le projet
            </div>}
          </div>
        }
        <div className={styles.content}>
          <div className={styles.contentBg}></div>
          <div className={styles.contentWrapper}>
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <div className={styles.imageSet} onClick={() => setImageUp(true)}>
                  <Image
                    className={styles.image}
                    width={800}
                    height={600}
                    alt={project?.product?.title || "Titre du projet"}
                    src={project?.productImage || "/product.jpg"}
                  />
                </div>
                <Link href={`/${project?.creator?.userTag}`} className={styles.profile}>
                  <Image
                    width={200}
                    height={200}
                    alt={project?.creator?.firstName || "Titre du projet"}
                    title={project?.creator?.firstName || "Titre du projet"}
                    src={project?.creator?.picture  || "/profile.png"}
                  />
                </Link>
              </div>
              <p>{project?.product?._createdAt}</p>
              <h3>{project?.product?.title}</h3>
              <div className={styles.infos}>
                <div>
                  <h4><GiPriceTag /></h4>
                  <p>{project?.product?.projectUnitValue} Fcfa</p>
                </div>
                <div>
                  <h3><TbDiscountCheckFilled /></h3>
                  <span>- {parseInt(((project?.product?.realUnitValue-project?.product?.projectUnitValue)/project?.product?.realUnitValue)*100)}%</span>
                </div>
                <div>
                  <h4><FaSortAmountUp /></h4>
                  <p>{project?.product?.quantity || "0"}</p>
                </div>
              </div>
            </div>
            <div className='separator1' />
            <div className={styles.buttons}>
              <button onClick={handleOpenJoin}>
                <MdJoinInner />
                {userIsMember ? "Mon offre" : userIsCreator ? "Éditer" : "Rejoindre"}
              </button>
              <button>
                <RiUserFollowFill />
                Suivre
              </button>
            </div>
            <div className={styles.product}>
              <TbInfoSquareRoundedFilled />
              <p>{project?.product?.description}</p>
              <Link target="_blank" href={project?.product?.url}>
                Voir le produit
                <TbOutbound /> 
              </Link>
            </div>
            <div className='separator1'/>
            <div className={styles.pageBottom}>
              {userIsMember || userIsCreator ?
              <div className={styles.knownMembers}>
                <h4><span>{members.length}</span> Participant{members.length>1 && "s"}</h4>
                <div className={styles.members}>
                  {fullMembers.map(function({ seller, _createdAt, offer, _id }, index){
                    return(
                      <div className="box2" key={index} onClick={seller?.email === userEmail && handleOpenJoin}>
                        <Link href={`/${seller?.userTag}`} className="image">
                          <Image 
                            width={80}
                            height={80}
                            alt="membre"
                            src={seller?.picture || "/profile.png"}
                          />
                        </Link>
                        <div>
                          <h4>{seller?.name || ""}</h4>
                          <p>{_createdAt || ""}</p>
                          {userIsCreator &&
                            <span className={styles.memberOffer}>
                              <MdOutlineProductionQuantityLimits />
                              {offer}
                            </span>
                          }
                        </div>
                        {
                          userIsCreator ? 
                          <div className={`box2-red ${styles.memberTrash}`} onClick={function(){deleteMembership(_id)}}>
                            <BiTrash />
                          </div> :
                          seller?.email === userEmail && <div className={styles.memberTrash}>
                            <p className={styles.myMemberOffer}>{offer}</p>
                          </div>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
              : <p className={styles.anonymeMembers}>
                  {members.length === 0 ? "Aucun" : members.length} participants
                  {members.length === 0 && <button onClick={handleOpenJoin}><GiPodiumWinner /> Soyez le premier</button>}
                </p>
              }
              <button className="btn-share"><BsShare /> Partager</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  
  var projects = []

  // const router = useRouter()
  const projectId = query.projectId

  return client.fetch( 
    `
      * [_type == "project" && _id == "${projectId}"]{
        _id,
        creator->{
          userTag,
          firstName,
          lastName,
          "picture": profilPicture.asset->url
        },
        name,
        private,
        "product": *[_type == "product" && references(^._id)][0],
        "productImage": *[_type == "product" && references(^._id)][0].image.asset->url,
        _createdAt,
        _updatedAt
      }
    `
  )
    .then(async (proj) => {
      projects = proj;

      return {
        props: {
          projects
        }
      }
    })
    .catch((error) => {
      console.log({ error })
      return {
        props: {
          projects: null
        }
      }
    })
}