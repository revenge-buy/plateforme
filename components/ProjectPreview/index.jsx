import styles from "./index.module.css"
import Image from "next/image"
import { RiUserFollowFill } from 'react-icons/ri'
import { MdJoinInner } from 'react-icons/md'
import Link from "next/link"

export default function ProjectPreview({ _id, creator, name, _createdAt, productImage, product }) {

  if(product === null) {
    product = {
      realUnitValue: 0,
      projectUnitValue: 0
    }
  }

  const { realUnitValue, projectUnitValue } = product;

  const benef = parseInt(((realUnitValue - projectUnitValue)/realUnitValue)*100)

  return (
    <div className={styles.project}>
      <header>
        <div className={styles.infos}>
          <Image
            width={40}
            height={40}
            alt={ name }
            src={creator?.picture ? creator?.picture : "/favicon.png"}
          />
          <div>
            <h4>{creator && <Link href={`/${creator.userTag}`}>{`${creator?.firstName} ${creator?.lastName}`}</Link>}</h4>
            <p>{_createdAt && _createdAt}</p>
          </div>
        </div>
        <div className={styles.suppInfos}>
          <span>- {benef || 0}%</span>
        </div>
      </header>
      <section>
        <Image
          width={400}
          height={300}
          alt={ name }
          src={productImage ? productImage : "/favicon.png"}
        />
        <Link href={`/projects/${_id ? _id : "nothing"}`}>
          <div>
            <p>{`" ${name && name} "`}</p>
          </div>
        </Link>
      </section>
      <footer>
        <div>
          <RiUserFollowFill />
          <p>Suivre</p> 
        </div>
        <div>
          <MdJoinInner />
          <p>Rejoindre</p>
        </div>
      </footer>
    </div>
  )
}