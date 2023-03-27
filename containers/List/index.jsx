import { ProjectPreview } from "@/components"
import style from "./index.module.css"

export default function List() {
  return (
    <div className={style.list}>
      <ProjectPreview />
    </div>
  )
}