import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Metas from '@/components/Metas';
import { useEffect, useState } from 'react';
import client from '@/api/client';
import { useRouter } from 'next/router';
// import Metas from '@/components/Metas'


const initialMetas = {
  title: "Ensemble Fendi Femme",
  metas: [
    {
      name: "description",
      description: "Projet de groupage, peut être celui qu'il vous faut !"
    }
  ]
}

export default function Project() {
  const [metas, setMetas] = useState(initialMetas)

  const [project, setProject] = useState({})

  const router = useRouter()

  useEffect(() => {
    async function getProject() {
      try{
        const proj = await client.fetch(
          `
            * [_type == "project" && _id == "${router.query.projectId}"]{
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

        if(proj && proj !== []){
          console.log({ proj });
          setProject(proj[0]);
          console.log({ project })
        }
      } catch(error) {
        console.log({ error })
      }
    };
  
    getProject();
  }, [])
  
  
  return (
    <>
      <Metas title={metas.title} metas={metas.metas} />
      <main className={`page ${styles.main}`}>
        <h3><u></u></h3>
      </main>
    </>
  )
}