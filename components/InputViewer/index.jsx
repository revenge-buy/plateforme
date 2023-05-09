import React, { useEffect } from 'react'
import { BiCheck } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { HiPencil } from 'react-icons/hi'
import { MdOutlineEmail } from 'react-icons/md'

import DarkLoader from '../DarkLoader'

import style from './style.module.css'

const InputViewer = ({value, editing, setEditing, handleEdit, handleUpdate, inputType, valueType}) => {


  return (
    <form 
      tabIndex={0} 
      className={`box2 p2 ${style.inputViewer}`}  
      onClick={function(){handleEdit(valueType)}}
    >
      <MdOutlineEmail />
      <div className={style.itemValue}>
        {editing.type !== valueType
          ? <p>{value || "Donnée absente !"}</p>
          : <input
              type={inputType || "text"} 
              value={editing[valueType]} 
              onChange={function(e){setEditing(function(ed){
                return {
                  ...ed,
                  [valueType]: e.target.value
                }
              })}}
            />
        }
      </div>
      {editing.type !== valueType
        ? <HiPencil />
        : <div className={style.options}>
          {editing.loading 
          ? <DarkLoader />
          : <div className={style.options}>
              <BiCheck onClick={function(){handleUpdate(valueType, editing[valueType])}} tabIndex={1}/>
              <CgClose tabIndex={1} className={style.option_close} 
              onClick={function(){
                setTimeout(() => {
                  handleEdit("")
                }, 200); 
              }} />
            </div>}
        </div>
      } 
    </form>
  )
}

export default InputViewer
