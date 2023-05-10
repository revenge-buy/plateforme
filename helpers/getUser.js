export default function getUser(field) {
  let user = JSON.parse(localStorage.getItem("revenge-user"))

  if(user){
    if(field){
      return user[field]
    }
    return user
  } else {
    return false
  }
}

export function setLocalUser(data){
  let user = getUser()

  data
    ? user = { ...user, ...data }
    : user = user

  localStorage.setItem('revenge-user', JSON.stringify(user))
}