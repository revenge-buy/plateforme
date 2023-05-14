import client from "@/api/client";

export async function joinProject(userId, projectId, offer, userIsMember, setProcess, router){
    if(!userIsMember){
      setProcess({ loading: true, status: "pending" })
      try{
        const resp = await client.create(
          {
            _type: "ProjectMembership",
            Project: {
              _type: 'reference',
              _ref: projectId
            },
            seller: {
              _type: "reference",
              _ref: userId
            },
            offer: parseInt(offer)
          }
        )
        if(resp){
          setProcess({ loading: false, status: "succeed"})
          router ? router.push("/projects/"+projectId) :location.replace("/projects/"+projectId)
          return resp
        } else {
          setProcess({ loading: false, status: "failed"})
        }
      } catch(error) {
        setProcess({ loading: false, status: "failed"})
        console.log({ error })
      }
    } else {
      alert("Vous êtes déjà membre")
      setProcess({ loading: false, status: "failed"})
    }
}

export async function getMembershipsByProject(projectId){
  let proj = await client.fetch(`
    [_type == "project" && _id == ${projectId}]{
      "memberships": *[_type == "ProjectMembership" && references(^._id)]{
        _id
      }
    }
  `)

  if(proj){
    return proj.memberships
  } else {
    return []
  }
}

export async function updateMembership(projectId, _id, quantity, setProcess, router){
  try {
    setProcess({ loading: true, status: "pending" })
    const updated = await client.patch(_id).set({offer: quantity}).commit()

    if(updated){
      console.log({updated})
      setProcess({ loading: false, status: "succeed" })
      router.push(`/projects/${projectId}`);
      return updated;
    } else {
      setProcess({ loading: false, status: "failed" })
      return null
    }
  } catch (error) {
    setProcess({ loading: false, status: "failed" })
    console.log({ error })
    return null
  }
}

export async function archiveProject(projectId, process, setProcess, mode, router){
  if(!process.loading){
    setProcess({ loading: true, status: "pending" })
    try{
      const archived = await client.patch(projectId)
        .set({archived: mode === "unArchiving" ? false : true})
        .commit()

      if(archived){
        if(mode === "unArchiving"){
          try{
            let memberships = await getMembershipsByProject(projectId)

            if(memberships){
              while(memberships.length !== 0){
                memberships.map(function({_id}){
                  client.delete(_id)
                  let otherMs = memberships.filter((ms) => ms._id !== _id);
                  memberships = otherMs
                })
              }

              if(memberships.length === 0){
                setProcess({ loading: false, status: "succeed" })
                router && router.push(`/projects/${projectId}`);
              }
            }
          } catch {
            setProcess({ loading: false, status: "failed" })
          }
        } else {
          setProcess({ loading: false, status: "succeed" })
          router && router.push(`/projects/${projectId}`);
        }
        return { data: archived }
      } else {
        setProcess({ loading: false, status: "failed" })
      }
    } catch(error) {
      setProcess({ loading: false, status: "failed" })
      return { error }
    }
  } else {
    alert("Processus en cours, merci de patienter !")
  }
}

export function deleteMembership(_id, process, setProcess){
  if(!process.loading){
    setProcess(function(process){return { ...process, loading: true, status: "pending" }})
    client.delete(_id)
    .then(function(deleted){
      setProcess(function(process){return { ...process, loading: false, status: "succeed" }})
      location.reload()
    })
    .catch(function(){
      setProcess(function(process){return { ...process, loading: false, status: "failed" }})
    })
  } else {
    alert("Processus en cours, veuillez patienter !")
  }
}