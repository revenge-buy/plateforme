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

export function deleteMembership(_id){
  client.delete(_id)
    .then(function(deleted){
      console.log({deleted})
      location.reload()
    })
    .catch(function(deletionError){
      console.log(deletionError)
    })
}