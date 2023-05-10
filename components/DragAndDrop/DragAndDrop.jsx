import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { BiImport, BiPencil } from 'react-icons/bi';
import { BsPencil } from 'react-icons/bs';
import { MdChangeCircle } from 'react-icons/md';
import Reload from '../Reload';

import styles from './DragAndDrop.module.css'

const DragAndDrop = ({ file, setFile, title, text, editing }) => {

  const [fileDataUrl, setFileDataUrl] = useState(null)
  const [initialRemoteFile, setInitialRemoteFile] = useState(null)

  function setPicture(e){
    const _file = e.target.files[0];
    setFile(_file);
  }

  function resetFile(){
    setFile(initialRemoteFile)
  }

  useEffect(() => {
    let fileReader, isCancel = false;
    if (file && !file.remote) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataUrl(result)
        }
      }
      fileReader?.readAsDataURL(file);
    } else {
      setInitialRemoteFile(file)
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader?.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [file])
  

  return (
    <div className={`input-set ${styles.dragBox}`}>
      <label>{ title }</label>
      {!file
        ? <div className={`${styles.dragBoxContent}`}>
            <input type="file" accept='image/*' name="cover" multiple={false} onChange={setPicture} />
            <span className={`${styles.dragButton}`}>
              Importez une image
              <BiImport />
            </span>
            <Image 
              src="/product.jpg" 
              alt="preview" 
              width={300} 
              height={300}
            />
          </div>
        : <div className={`${styles.dragBoxContent}`}>
          {
            (!fileDataUrl && !file.remote)
            ? <div>
                <h4>Attention</h4>
                <p>Une erreur s&apos;est produite lors du chargement de votre image</p>
                <span className={`${styles.dragButton}`}>
                  <input type="file" accept='image/*' name="cover" multiple={false} onChange={setPicture} />
                  <p>Recommencer !</p>
                </span>
              </div>
            : <div>
                <Image src={file.remote ? file?.url ? file.url: "/product.jpg" : fileDataUrl} alt="preview" width={200} height={200} />
                <div>
                  <span className={`${styles.dragButton2}`}>
                    <input type="file" accept='image/*' name="cover" multiple={false} onChange={setPicture} />
                    <BsPencil />
                  </span>
                </div>
            </div>
          }
        </div>
      }
      {(!file?.url && editing) && <Reload label="Reinitialiser l'image" func={resetFile} /> }
      <p>{ text }</p>
    </div>
  )
}

export default DragAndDrop