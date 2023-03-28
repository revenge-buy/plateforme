import styles from "./index.module.css"
import Image from "next/image"
// import { RiUserFollowFill } from 'react-icons/ri'
// import { MdJoinInner } from 'react-icons/md'
import Link from "next/link"

export default function ProjectPreview({ _id, creator, name, _createdAt, productImage }) {

  return (
    <div className={styles.project}>
      <header>
        <div className={styles.infos}>
          <Image
            width={40}
            height={40}
            alt={ name }
            src={creator.picture}
          />
          <div>
            <h4><Link href={`/${creator.userTag}`}>{`${creator?.firstName} ${creator?.lastName}`}</Link></h4>
            <p>{_createdAt && _createdAt}</p>
          </div>
        </div>
        <div className={styles.suppInfos}>
          <span>70%</span>
        </div>
      </header>
      <section>
        <Image
          width={200}
          height={200}
          alt={ name }
          src={productImage}
        />
        <Link href={`/projects/${_id}`}>
          <div>
            <p>{`" ${name} "`}</p>
          </div>
        </Link>
      </section>
      <footer>
        <div>
          {/* <RiUserFollowFill /> */}
          <p>Suivre</p> 
        </div>
        <div>
          {/* <MdJoinInner /> */}
          <p>Rejoindre</p>
        </div>
      </footer>
    </div>
  )
}