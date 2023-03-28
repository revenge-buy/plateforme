import { useEffect, useState } from 'react'

import Metas from '@/components/Metas'
import { List } from '@/containers'

// import { getProjects } from '@/api/projects'

import styles from "./index.module.css"
import client from '@/api/client'

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
    <>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={`page section ${styles.main}`}>
        <h2>Projets en cours</h2>
        <List projects={ allProjects } />
      </main>
    </>
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
          "productImage": *[_type == "product" && references(^._id)][0].image.asset->url
        }
      `
    );

    return {
      props: {
        allProjects
      }
    }
  } catch (error) {
    console.log({ error })
    return {
      props: {
        allProjects: []
      }
    }
  }
}