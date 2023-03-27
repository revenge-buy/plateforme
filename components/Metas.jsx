import Head from 'next/head'

export default function Metas({ title, metas }) {
  return (
    <Head>
      <title>{title && title}</title>
      {
        metas && metas.map((metaAttr, index) => {
          return <meta {...metaAttr} key={index} />
        })
      }
    </Head>
  )
}
