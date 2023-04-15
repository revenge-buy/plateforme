import { ProjectPreview } from "@/components"
import style from "./index.module.css"

export default function List({ projects }) {

  return (
    <div className={style.list}>
      {
        projects.map(({ _id, creator, name, _createdAt, productImage, product }, index) => 
          <ProjectPreview product={product}  _id={_id} creator={creator} name={name} _createdAt={_createdAt} productImage={productImage}  key={index} />
        )
      }
    </div>
  )
}