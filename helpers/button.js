export function setButtonText(
  loading, status, originalText
){
  // this function is usefull to define a text in a button according to the operation loading value and status
  if(loading === false && status === ""){
    // if the operation is not started yet
    return originalText
  } else if(status === "failed"){
    // if the operation has been launched, but has failed for whatever reason
    return "Echec. Réessayer !"
  } else if(loading === false) {
    // if the operation has been launched, has not failed, and has finished loading
    return "Opération réussie !"
  } else {
    // if the operation has been launched, has not failed, but is still loading
    return "Veuillez patienter..."
  }
}