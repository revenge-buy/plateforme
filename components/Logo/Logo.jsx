import styles from "./Logo.module.css"

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src="/revenge.png" alt="logo" />
      {/* <h1>ev<span>enge</span><p>BUY</p></h1> */}
    </div>
  )
}