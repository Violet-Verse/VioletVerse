import { Box } from '@mui/material'
import Image from 'next/image'

const SponsorCards = () => {
  const sponsors = [
    { src: '/three.png', alt: 'Sponsor logo' },
    { src: '/one.webp', alt: 'Sponsor logo' },
    { src: '/four.png', alt: 'Sponsor logo', hasWhiteBg: true },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 2, sm: 3, md: 4 },
        mt: 2,
      }}
    >
      {sponsors.map((sponsor) => (
        <Box
          key={sponsor.src}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: sponsor.hasWhiteBg
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.05)',
            padding: { xs: '16px 20px', sm: '20px 24px' },
            borderRadius: '24px',
            border: '2px solid',
            borderColor: sponsor.hasWhiteBg
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxSizing: 'border-box',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: 'rgba(139, 92, 246, 0.6)',
            },
            '&:active': {
              transform: 'translateY(-2px) scale(0.98)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              borderColor: 'rgba(139, 92, 246, 0.8)',
            },
          }}
        >
          <Image
            alt={sponsor.alt}
            src={sponsor.src}
            height={75}
            width={130}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      ))}
    </Box>
  )
}

export default SponsorCards

