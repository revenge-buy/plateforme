import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { FaSortAmountUp } from 'react-icons/fa'
import { GiPodiumWinner, GiPriceTag } from 'react-icons/gi'
import { TbDiscountCheckFilled, TbInfoSquareRoundedFilled, TbOutbound } from 'react-icons/tb'
import { RiUserFollowFill, RiCloseLine } from 'react-icons/ri'
import { MdJoinInner, MdOutlineProductionQuantityLimits } from 'react-icons/md'
import { BiArchiveOut, BiTrash } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';

import Metas from '@/components/Metas';
import client from '@/api/client';
import { archiveProject, deleteMembership, joinProject, updateMembership } from '@/helpers/projects';

import styles from './project.module.css'
import ShareButton from '@/containers/ShareButton';
import ButtonContent from '@/components/ButtonContent';
import Confirmer from '@/containers/Confirmer';
import ArchiveButton from '@/components/ArchiveButton';
import { useUser } from '@auth0/nextjs-auth0/client';
 
export default function Project({ projects }) {
  const {user} = useUser()

  const project = projects[0];
  const [joining, setJoining] = useState(false)
  const [quantity, setQuantity] = useState(NaN)
  const [userEmail, setUserEmail] = useState()
  const [members, setMembers] = useState([])
  const [fullMembers, setFullMembers] = useState([])
  const [userIsMember, setUserIsMember] = useState(false)
  const [userIsCreator, setUserIsCreator] = useState(false)
  const [membershipId, setMembershipId] = useState("")
  const [joiningProcess, setJoiningProcess] = useState({
    loading: false,
    status: ""
  })
  const [deleteProcess, setDeleteProcess] = useState({
    loading: false,
    status: ""
  })
  const [unArchiveProcess, setUnArchiveProcess] = useState({
    loading: false,
    status: ""
  })

  const [confirmer, setConfirmer] = useState({
    on: false,
    setOn: function(on){
      setConfirmer((confirmer) => ({ ...confirmer, on }))
    },
    title: "",
    message: "",
    handleConfirm: null,
    handleCancel: null,
    type: "",
    process: deleteProcess
  })
  
  const router = useRouter()

  // run this to update membership status when the page loads for the 
  useEffect(() => {
    if(user && user?.email){
      setUserEmail(user.email)
      console.log({userEmail})
    }

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
    if(user){
      if(user.email !== project?.creator?.email){
        const filteredMembers = members?.filter(function(member){ return member?.seller?.email === user.email });
    
        if(filteredMembers.length > 0){
          setUserIsMember(true)
        }
      } else {
        setUserIsCreator(true)
       }
    } 
    
  }, [members, userEmail])

  // run this if user is project member or creator, to reset full  members value
  useEffect(() => {
    (userIsMember || userIsCreator) && client.fetch(`
      *[_type == "project" && _id == "${project?._id}"][0]{
        _id,
        "memberships": *[_type == "ProjectMembership" && references(^._id)]{
          seller->{
            userTag,
            email,
            phone,
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
  }, [userIsMember, userIsCreator, userEmail])
  

  // run this when user clicks on join button
  function handleOpenJoin(){
    // checking if user is logged in
    if(userEmail){
      // if user is project autor, do this :
      if(!userIsCreator){
        setJoining(true);
        if(userIsMember){
          client.fetch(`
            *[_type == "project" && _id == "${project?._id}"][0]{
              _id,
              "memberships": *[_type == "ProjectMembership" && references(^._id)]{
                seller->{
                  email,
                  userTag,
                  _id,
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
        router.push(`/projects/new?editedId=${project?._id}`)
      }
    } else {
      // if user is not logged in go to log in page
      alert("Vous n'êtes pas connecté !")
      router.push("/auth");

    }
  }

  function handleJoin(){
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
            joinProject(userId, project?._id, quantity, userIsMember, setJoiningProcess, router);
            setJoining(false)
          })
          .catch(function(error){
            console.log(error)
          })
        } else {
          updateMembership(project?._id, membershipId, quantity, setJoiningProcess, router);
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

  const archiveProjectSetUp = {
    title: "Voulez vous vraiment archiver ce projet ?",
    message: "Vous pourrez toujours consulter vos groupages archivés ! Cependant, les membres y seront définitivement retirés !",
    handleConfirm: function(){
      archiveProject(project._id, deleteProcess, setDeleteProcess, "archiving", router);
    },
    handleCancel: () => {
      const { setOn } = confirmer;
      setOn(false)
    },
    type: "deletion",
  }

  function handleConfirmDeleteMembership(_id, name){
    setConfirmer((confirmer) => ({
      ...confirmer,
      on: true,
      title: `Retirer ${name} du groupage ?`,
      message: "Vous ne pourrez pas revenir en arrière !",
      handleConfirm: () => {
        deleteMembership(_id, deleteProcess, setDeleteProcess);
      },
      type: "deletion",
    }))
  }

  async function handleUnarchive(){
    archiveProject(project?._id, unArchiveProcess, setUnArchiveProcess, "unArchiving", router)
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
        content: project?.productImage || "/product.jpg"
      }
    ]
  }

  return (
    <div className={styles.project}>
      <Metas title={metas.title} metas={metas.metas} />
      <Confirmer
        { ...confirmer }
        process={deleteProcess}
      />
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
              {project?.product?.url && <Link target="_blank" className={styles.image_up_button} href={project?.product?.url}>
                Voir le produit
                <TbOutbound /> 
              </Link>}
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
                  <div className="submit" onClick={handleJoin}>
                    <ButtonContent
                      loading={joiningProcess.loading}
                      status={joiningProcess.status}
                      originalText={userIsMember ? "Modifier" : "Rejoindre"}
                    />
                  </div>
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
              <button onClick={project?.archived ? handleUnarchive : handleOpenJoin}>
                {project?.archived ? <BiArchiveOut /> : <MdJoinInner />}
                {(userIsCreator && project?.archived)
                  ? <ButtonContent { ...unArchiveProcess } originalText="Désarchiver" />
                  : (userIsMember 
                  ? "Mon offre" 
                  : userIsCreator
                    ? project?.archived
                      ? "Désarchiver"
                      : "Éditer" 
                    : "Rejoindre")
                }
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
              {!project?.archived && ((userIsCreator === true || userIsMember) ?
              <div className={styles.knownMembers}>
                <h4><span>{members.length}</span> Participant{members.length>1 && "s"}</h4>
                <div className={styles.members}>
                  {fullMembers.map(function({ seller, _createdAt, offer, _id }, index){
                    return(
                      <div className="box2" key={index}>
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
                          {/* <p>{_createdAt || ""}</p> */}
                          {userIsCreator && <p>{seller?.phone || ""}</p>}
                          {userIsCreator &&
                            <span className={styles.memberOffer}>
                              <MdOutlineProductionQuantityLimits />
                              {offer}
                            </span>
                          }
                        </div>
                        {
                          userIsCreator ? 
                          <div className={`box2-red ${styles.memberTrash}`} onClick={() => handleConfirmDeleteMembership(_id, seller?.name)}>
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
                </p>)
              }
              {!project?.archived && <ShareButton link={`https://revengebuy.vercel.app/projects/${project?._id}`} />}
              {(userIsCreator && !project?.archived) &&
                <>
                  <div className="separator1"></div>
                  <ArchiveButton handleClick={() => setConfirmer((confirmer) => ({
                    ...confirmer,
                    on: true,
                    ...archiveProjectSetUp
                  }))} />
                </>
              }
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
          email,
          firstName,
          lastName,
          "picture": profilPicture.asset->url
        },
        name,
        private,
        archived,
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