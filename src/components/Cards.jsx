import React from 'react'
import "../styles/Cards.css";

const Cards = ({heading , img ,values}) => {
  return (
    <div className='cards-container'>
      <div className="cards-heading-values">
        <p className='cards-main-heading'>{heading}</p>
        <p>{values}</p>
      </div>
      <div className="cards-img">
        <img src={img} alt="" />
      </div>
    </div>
  )
}

export default Cards
