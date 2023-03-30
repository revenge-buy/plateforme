import AuthHeader from "./AuthHeader";
import styles from "@/styles/Auth.module.css"
import { useState } from "react";

export default function AuthBox({ title, text, component }) {
  return (
    <div className={`${styles.authBox}`}>
      <AuthHeader title={title} text={text} />
      { component }
    </div>
  )
}