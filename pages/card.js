import React from 'react'
import '../styles/Enterprise.module.css'
const Card = ({ svg, heading, para }) => {
  return (
    <div
      className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg card_div"
      style={{
        transition: '0.3s',
        display: 'flex',
        flexDirection: 'column',
        width: '29%',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        padding: '12px',
        backgroundColor: '#28262f',
        borderRadius: '10px',
      }}
    >
      <div className="color" style={{ margin: '9px 0px' }}>
        {svg}
      </div>
      <h2
        className="text-xl font-bold text-white card_div_heading"
        style={{ margin: '11px 30px', textAlign: 'center', color: 'white' }}
      >
        {heading}
      </h2>
      {Array.isArray(para) ? (
        <ul
          className="color"
          style={{
            textAlign: 'center',
            margin: '0px 25spx',
          }}
        >
          {para.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>para is not an array</p>
      )}
    </div>
  )
}

export default Card
