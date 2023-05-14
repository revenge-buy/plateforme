import React from 'react'
import { BiArchive } from 'react-icons/bi'
import style from './style.module.css'

const ArchiveButton = ({handleClick}) => {
  return (
    <button onClick={handleClick} className={`bg-red ${style.archiveButton}`}>
      <BiArchive />
      <p>Archiver</p>
    </button>
  )
}

export default ArchiveButton
