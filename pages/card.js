import React from 'react'
import styles from '../styles/Enterprise.module.css'
const Card = ({ svg, heading, para }) => {
  return (
    <div
      className={`flex flex-col items-center border-gray-800 rounded-lg ${styles.card_div}`}
      style={{
        transition: '0.3s',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        backgroundColor: '#28262f',
        borderRadius: '10px',
        height: '100%',
      }}
    >
      <div className={`color ${styles.card_div_icon}`}>
        {svg}
      </div>
      <h2 className={`text-xl font-bold text-white ${styles.card_div_heading}`}>
        {heading}
      </h2>
      {Array.isArray(para) ? (
        <ul className={`color ${styles.card_div_para}`}>
          {para.map((item, index) => (
            <li key={`${item}-${index}`} className={styles.card_list_item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>para is not an array</p>
      )}
    </div>
  )
}

export default Card
