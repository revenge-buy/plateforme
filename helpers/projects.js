import client from "@/api/client";

export async function joinProject(userId, projectId, offer){
  
  try{
    const res = client.fetch(`
      *[_type == "ProjectMembership" && Project._ref == "${projectId}" &&  seller._ref == "${userId}"][0]{
        _id
      }
    `)
    if (!res){
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
    
      location.replace("/projects/"+projectId)
      return resp
    } else {
      const wantToQuit = prompt("Vous avez déjà rejoint ce groupage !\n Souhaitez vous en sortir ?");
      if(wantToQuit){
        deleteMembership(res._id)
      }
    }
  } catch(error) {
    console.log({ error })
    return null
  }
}

export async function updateMembership(_id, quantity){
  try {
    const updated = client.patch(_id).set({offer: quantity}).commit()
    console.log({updated})
    return updated;
  } catch (error) {
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