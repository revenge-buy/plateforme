import styles from "./index.module.css"
import Image from "next/image"
import { RiUserFollowFill } from 'react-icons/ri'
import { MdJoinInner } from 'react-icons/md'
import Link from "next/link"
import client from "@/api/client"
import { deleteMembership, joinProject, updateMembership } from "@/helpers/projects"
import { useEffect, useState } from "react"
import { CgClose } from "react-icons/cg"
import { useRouter } from "next/router"
import ButtonContent from "../ButtonContent"
import getUser from "@/helpers/getUser"
import { useUser } from "@auth0/nextjs-auth0/client"

export default function ProjectPreview({ _id, creator, name, _createdAt, productImage, product }) {

  const { user } = useUser()

  const [joining, setJoining] = useState("")
  const [quantity, setQuantity] = useState(NaN)
  const [userEmail, setUserEmail] = useState("")
  const [members, setMembers] = useState([])
  const [userIsMember, setUserIsMember] = useState(false)
  const [membershipId, setMembershipId] = useState("")
  const [userIsCreator, setUserIsCreator] = useState(false)
  const [fetchingProcess, setFetchingProcess] = useState({
    loading: false,
    status: ""
  })
  const [definingProcess, setDefiningProcess] = useState({
    loading: false,
    status: ""
  })

  const router = useRouter()

  useEffect(() => {
    client.fetch(`
    *[_type == "project" && _id == "${_id}"][0]{
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

  useEffect(() => {
    if(user){
      if(user.email !== creator.email){
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
  
  

  if(product === null) {
    product = {
      realUnitValue: 0,
      projectUnitValue: 0
    }
  }

  const { realUnitValue, projectUnitValue } = product;

  const benef = parseInt(((realUnitValue - projectUnitValue)/realUnitValue)*100)

  function handleOpenJoin(){
    const localUser = getUser()

    if(localUser){
      if(!userIsCreator){
        setJoining(_id);
        if(userIsMember){
          setFetchingProcess({loading: true, status: "pending"})
          client.fetch(`
            *[_type == "project" && _id == "${_id}"][0]{
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
            setFetchingProcess({loading: false, status: "succeed"})
          })
          .catch(function(error){
            console.log({error1: error})
            setFetchingProcess({loading: false, status: "failed"})
          })
        } else {
          console.log("user not a member")
        }
      } else {
        router.push(`/projects/${_id}?edit=true`)
      }
    } else {
      router.push("/auth")
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
            joinProject(userId, _id, quantity, userIsMember, setDefiningProcess, router);
          })
          .catch(function(error){
            console.log(error)
          })
        } else {
          updateMembership(membershipId, quantity)
        }
      }
    } else {
      alert("Une erreur s'est produite !")
    }

  }

  function handleLeaveProject(){
    deleteMembership(membershipId);
    setJoining(false)
    userIsMember(false)

  }

  return (
    <div className={styles.project}>
      {joining === _id &&
        <div className="popup">
          <div className="popup-header" onClick={function(){setJoining("")}}>
              <h4>Combien en voulez vous ?</h4>
            <CgClose />
          </div>
          <div className="popup-box">
            <form action="">
              <div className="input-set">
                <label htmlFor="">Quantité</label>
                <input className="input-set input" type="number" value={quantity} onChange={function(e){setQuantity(parseInt(e.target.value))}} placeholder="Combien en voulez vous ?" />
                <p>Cela vous fera : {product?.projectUnitValue * parseInt(quantity) || "0"} XAF</p>
              </div>
              <div className="input-set">
                <div className="submit" onClick={handleJoin}>
                  <ButtonContent
                    loading={definingProcess.loading}
                    status={definingProcess.status}
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
      <header>
        <div className={styles.infos}>
          <Image
            width={40}
            height={40}
            alt={ name }
            src={creator?.picture ? creator?.picture : "/profile.png"}
          />
          <div>
            <h4>{creator && <Link href={`/${creator.userTag}`}>{`${creator?.firstName} ${creator?.lastName}`}</Link>}</h4>
            <p>{_createdAt && _createdAt}</p>
          </div>
        </div>
        <div className={styles.suppInfos}>
          <span>- {benef || 0}%</span>
        </div>
      </header>
      <section>
        <Image
          width={400}
          height={300}
          alt={ name }
          src={productImage ? productImage : "/product.jpg"}
        />
        <Link href={`/projects/${_id ? _id : "nothing"}`}>
          <div>
            <p>{`" ${name && name} "`}</p>
          </div>
        </Link>
      </section>
      <footer>
        <div onClick={handleOpenJoin}>
          <MdJoinInner />
          <p>{userIsMember ? "Mon offre" : userIsCreator ? "Éditer" : "Rejoindre"}</p>
        </div>
        <div>
          <RiUserFollowFill />
          <p>Suivre</p> 
        </div>
      </footer>
    </div>
  )
}