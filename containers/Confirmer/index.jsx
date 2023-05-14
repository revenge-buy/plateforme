import ButtonContent from '@/components/ButtonContent'
import React from 'react'
import { MdWarning } from 'react-icons/md'
import style from './style.module.css'

const Confirmer = ({on, setOn, type, title, message, handleCancel, handleConfirm, process}) => {
  
  return (
    <div className={`${style.confirmer} ${!on && style.confirmerOff}`}>
      <div onClick={() => setOn(false)} className={style.background}></div>
      <div className={style.confirmerBox}>
        <header>
          {(type === "deletion" && <MdWarning className='color-red' />)}
          <p>{title}</p>
        </header>
        <div className={style.container}>
          <p className={style.message}>{message}</p>
        </div>
        <footer>
          <div className={style.buttons}>
            <button 
              onClick={function(){
                process.status === "succeed" 
                ? null
                : handleConfirm()
              }} 
              className={`${type === "deletion" && (process.status !== "succeed" ? "bg-red" : "bg-gray")} ${style.confirm}`}>
              <ButtonContent loading={process?.loading} status={process.status} originalText="Confirmer" />
            </button>
            {!process.loading && <button onClick={() => (handleCancel ? handleCancel() : setOn(false))} className={style.cancel}>{process.status !== "" ? "Fermer" : "Annuler"}</button>}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Confirmer
