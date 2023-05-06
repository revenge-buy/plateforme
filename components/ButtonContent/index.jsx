import React, { useEffect, useState } from 'react'
import { setButtonText } from '../../helpers/button'
import Loader from '../Loader'

const ButtonContent = ({loading, status, originalText}) => {
  const [text, setText] = useState(originalText)

  useEffect(() => {
    setText(function(){return setButtonText(loading, status, originalText)})
  }, [loading, status, originalText])
  
  return (
    <>
      {!loading 
        ? <div>{text}</div>
        : <Loader />
      }
    </>
  )
}

export default ButtonContent
