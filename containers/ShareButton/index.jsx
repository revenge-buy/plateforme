import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg';
import { BsShare } from 'react-icons/bs';

import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  InstapaperShareButton,
  InstapaperIcon
} from 'next-share';

import style from './style.module.css'
import { copyText } from '@/helpers';
import { BiCheck } from 'react-icons/bi';
  
export default function ShareButton({title, link}) {

  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <div className={style.shareButton}>
      <button
        className="btn-share"
        onClick={function(){setOpen(true)}}
      >
        <BsShare /> Partager
      </button>
      <div
        className={`
          ${style.shareOptions}
          ${open && style.openedShareOptions}
        `}
      >
        <header>
          <h4>{title || "Partagez sur vos réseaux sociaux"}</h4>
          <CgClose onClick={function(){setOpen(false)}} />
        </header>

        <div className={style.copyToClipboard}>
          <div onClick={() => {
            copyText(link);
            setCopied(true)
          }}>
            <img src="/clipboard.svg" alt="" />
            <p>Copier le lien</p>
          </div>
          <span className={`box2 box2-fit ${style.link}`}>{link}</span>
          {copied && <p className={style.copied}>copié <BiCheck /></p>}
        </div>

        <div className="separator1"></div>

        <div className={style.shareOptionsContent}>
          <WhatsappShareButton
            url={link} >
            <WhatsappIcon size={48}  />
          </WhatsappShareButton>
          <FacebookShareButton
            url={link} >
            <FacebookIcon size={48} />
          </FacebookShareButton>
          <FacebookMessengerShareButton
            url={link} >
            <FacebookMessengerIcon size={48}  />
          </FacebookMessengerShareButton>
          <TwitterShareButton
            url={link} >
            <TwitterIcon size={48}  />
          </TwitterShareButton>
          <TelegramShareButton
            url={link} >
            <TelegramIcon size={48}  />
          </TelegramShareButton>
          <LinkedinShareButton
            url={link} >
            <LinkedinIcon size={48}  />
          </LinkedinShareButton>
          <PinterestShareButton
            url={link} >
            <PinterestIcon size={48}  />
          </PinterestShareButton>
          <RedditShareButton
            url={link} >
            <RedditIcon size={48}  />
          </RedditShareButton>
          <InstapaperShareButton
            url={link} >
            <InstapaperIcon size={48}  />
          </InstapaperShareButton>
        </div>
      </div>
    </div>
  )
}