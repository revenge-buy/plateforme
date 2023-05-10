export function copyText(text){
  navigator.clipboard.writeText(text)
}

export function isValidURL(str) {
  if(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str)) {
       console.log('YES');
       return true
   } else {
       console.log('NO');
       return false
   }
}

export function somethingLoading(){
  alert("Enregistrement en cours. Merci de patienter !");
}

export function equalObjects(obj1, obj2){
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}