export default function () {
  let user = JSON.parse(localStorage.getItem("revenge-user"))

  if(user){
    return user
  } else {
    return false
  }
}