import Logo from "@/components/Logo/Logo";
import styles from "@/styles/Auth.module.css"

export default function AuthHeader({ title, text }){
  return (
  <div className={styles.authHeader}>
    <h2 v-if="title">{ title || '' }</h2>

    <div>
      <p className={styles.authHeaderText} v-if="text">{ text || '' }</p>
      {/* <p className={styles.authHeaderText}>Et profitez d'un essai gratuit pendant 30 jours sans engagement. 🎁</p> */}
    </div>
  </div>
  )
}