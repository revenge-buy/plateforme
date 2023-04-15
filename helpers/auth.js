import client from "@/api/client"

export function checkTag(user, setUser) {
  setUser((user) => ({ ...user, userTag: user.userTag.trim() }))

  user.userTag !== "" &&
  user.userTag !== "@" &&
  user.userTag !== user.prevUserTag &&
  client.fetch(
    `
      * [_type == "seller" && userTag == "${user.userTag}"]{
        userTag
      }
    `
  )
    .then((resp) => {
      console.log(resp, user.userTag)
        if(resp.length > 0)
          {
            setUser((user) => ({ ...user, tagOk: false }))
            console.log(resp)
            console.log({ tagTakenError: 'tag taken' });
            alert("Ce tag est déjà pris")
          } else {
            setUser((user) => ({ ...user, tagOk: true }))
            console.log("tag available")
          }
      })
      .catch((tegError) => {
        console.log({ tegError })
      })
  
  setUser((user) => ({ ...user, prevUserTag: user.userTag }))
}