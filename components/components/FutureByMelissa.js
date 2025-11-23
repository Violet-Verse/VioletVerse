import React from 'react'

const FutureByMelissa = () => {
  return (
    <section style={{ padding: '2rem', backgroundColor: '#fdfdfd' }}>
      <h2
        style={{
          fontFamily: 'serif',
          fontSize: '2rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        Subscribe to Future by Melissa
      </h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <iframe
          src="https://futurebymelissa.substack.com/embed"
          width="100%"
          height="320"
          style={{
            border: '1px solid #ccc',
            borderRadius: '6px',
            background: '#fff',
          }}
          frameBorder="0"
          scrolling="no"
          title="Future by Melissa Newsletter"
        ></iframe>
      </div>
    </section>
  )
}

export default FutureByMelissa
