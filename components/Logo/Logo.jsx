import Image from "next/image"
import styles from "./Logo.module.css"

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Image width={80} height={80} src="/revenge.png" alt="logo" />
      {/* <h1>ev<span>enge</span><p>BUY</p></h1> */}
    </div>
  )
}