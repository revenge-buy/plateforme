import styles from './project.module.css'
import Metas from '@/components/Metas';
import client from '@/api/client';
import Image from 'next/image';

import { FaSortAmountUp } from 'react-icons/fa'
import { GiPriceTag } from 'react-icons/gi'
import { TbDiscountCheckFilled } from 'react-icons/tb'
import Link from 'next/link';
 
export default function Project({ projects }) {
  const project = projects[0];
  console.log({ project })

  const metas = {
    title: project?.name || "",
    metas: [
      {
        name: "description",
        content: project?.product?.description || ""
      }
    ]
  }

  return (
    <div className={styles.project}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={`page ${styles.main}`}>
        <Image
          className={styles.back_image}
          width={100}
          height={100}
          alt={project?.product?.title || "Titre du projet"}
          src={project?.productImage || "/favicon.png"}
        />
        <div className={styles.content}>
          <div className={styles.contentBg}></div>
          <div className={styles.contentWrapper}>
            <div className={styles.header}>
              <div className={styles.imageSet}>
                <Image
                  className={styles.image}
                  width={800}
                  height={600}
                  alt={project?.product?.title || "Titre du projet"}
                  src={project?.productImage || "/favicon.png"}
                />
              </div>
              <h3>{project?.name}</h3>
              <div className={styles.infos}>
                <div>
                  <h4><GiPriceTag /></h4>
                  <p>{project?.product?.projectUnitValue} Fcfa</p>
                </div>
                <div>
                  <h3><TbDiscountCheckFilled /></h3>
                  <span>- {parseInt(((project?.product?.realUnitValue-project?.product?.projectUnitValue)/project?.product?.realUnitValue)*100)}%</span>
                </div>
                <div>
                  <h4><FaSortAmountUp /></h4>
                  <p>+ {project?.product?.quantity || "0"}</p>
                </div>
              </div>
            </div>
            <div className='separator1' />
            <div className={styles.product}>
              <h4>{project?.product?.title}</h4>
              <p>{project?.product?.description}</p>
              <Link target="_blank" href={project?.product?.url}>Voir le produit</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  
  var projects = []

  // const router = useRouter()
  const projectId = query.projectId

  return client.fetch( 
    `
      * [_type == "project" && _id == "${projectId}"]{
        _id,
        creator->{
          userTag,
          firstName,
          lastName,
          "picture": profilPicture.asset->url
        },
        name,
        private,
        "product": *[_type == "product" && references(^._id)][0],
        "productImage": *[_type == "product" && references(^._id)][0].image.asset->url,
        _createdAt,
        _updatedAt
      }
    `
  )
    .then(async (proj) => {
      projects = proj;

      return {
        props: {
          projects
        }
      }
    })
    .catch((error) => {
      console.log({ error })
      return {
        props: {
          projects: null
        }
      }
    })
}