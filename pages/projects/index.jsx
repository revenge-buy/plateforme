import Metas from '@/components/Metas'
import { List } from '@/containers'

// import { getProjects } from '@/api/projects'

import styles from "./index.module.css"
import client from '@/api/client'
import Image from 'next/image'
import Link from 'next/link'

const metas = {
  title: "Tous les projets actifs d'acfat groupé",
  metas: [
    {
      name: "description",
      content: 'Rejoignez les projets qui correspondent à vos besoins'
    }
  ]
}

export default function Projects({ allProjects }) {

  return (
    <div className={styles.projects}>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={`page ${styles.main}`}>
        <h2>Projets en cours</h2>
        {
          allProjects.length === 0 ?
          <div className={styles.nothing}>
            <Image
              width={1000}
              height={1000}
              alt={"Aucun projet !"}
              src={"/no-project.jpg"}
            />
            <p>Aucun projet pour le moment</p>
            <Link href="/projects/new" className="btn">Soyez le premier ;) !</Link>
          </div>
          : <List projects={ allProjects } />
        }
      </main>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  try {
    const allProjects = await client.fetch(
      `
        * [_type == "project"]{
          _id,
          creator->{
            userTag,
            firstName,
            lastName,
            "picture": profilPicture.asset->url
          },
          name,
          _createdAt,
          "product": *[_type == "product" && references(^._id)][0]{
            realUnitValue,
            projectUnitValue
          },
          "productImage": *[_type == "product" && references(^._id)][0].image.asset->url,
        }
      `
    );

    return {
      props: {
        allProjects
      }
    }
  } catch (error) {
    // console.log({ error })
    return {
      props: {
        allProjects: []
      }
    }
  }
}