import { Button, Box, Typography, Stack } from '@mui/material'
import { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const TipCreatorButton = ({ authorName, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    window.open('https://buy.stripe.com/28E9AUd666WXeqj0Zlg360c', '_blank')
  }

  return (
    <Box
      sx={{
        mt: { xs: 3, sm: 4 },
        mb: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(170, 238, 255, 0.1) 0%, rgba(142, 232, 255, 0.15) 50%, rgba(110, 224, 255, 0.1) 100%)',
        borderRadius: { xs: '16px', sm: '20px', md: '24px' },
        padding: { xs: '24px 16px', sm: '32px 24px', md: '40px 32px' },
        border: '1px solid rgba(170, 238, 255, 0.3)',
      }}
    >
      <Button
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'relative',
          background: disabled
            ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
            : 'linear-gradient(135deg, #AAEEFF 0%, #8EE8FF 50%, #6EE0FF 100%)',
          color: '#004455',
          borderRadius: { xs: '12px', sm: '16px' },
          padding: { xs: '12px 20px', sm: '14px 28px', md: '16px 32px' },
          fontSize: { xs: '15px', sm: '16px', md: '17px' },
          fontWeight: '600',
          textTransform: 'none',
          boxShadow: disabled
            ? 'none'
            : isHovered
              ? '0 8px 24px rgba(0, 68, 85, 0.25), 0 4px 12px rgba(170, 238, 255, 0.4)'
              : '0 4px 12px rgba(0, 68, 85, 0.15), 0 2px 6px rgba(170, 238, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
          '&:hover': {
            background: disabled
              ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
              : 'linear-gradient(135deg, #8EE8FF 0%, #6EE0FF 50%, #4DD8FF 100%)',
            boxShadow: disabled
              ? 'none'
              : '0 12px 32px rgba(0, 68, 85, 0.3), 0 6px 16px rgba(170, 238, 255, 0.5)',
            transform: disabled ? 'translateY(0)' : 'translateY(-2px)',
          },
          '&:active': {
            transform: disabled ? 'translateY(0)' : 'translateY(0px)',
            boxShadow: disabled
              ? 'none'
              : '0 2px 8px rgba(0, 68, 85, 0.2)',
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.6,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          {isHovered && !disabled ? (
            <FavoriteIcon
              sx={{
                fontSize: { xs: '20px', sm: '22px' },
                color: '#FF1744',
                transition: 'all 0.3s ease',
                transform: 'scale(1.1)',
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                fontSize: { xs: '20px', sm: '22px' },
                color: '#004455',
                transition: 'all 0.3s ease',
              }}
            />
          )}
          <Typography
            component="span"
            sx={{
              fontFamily: 'Test Calibre, sans-serif',
              fontWeight: '600',
              fontSize: 'inherit',
              letterSpacing: '0.01em',
            }}
          >
            {authorName ? `Tip ${authorName}` : 'Tip Creator'}
          </Typography>
        </Stack>
      </Button>
      {authorName && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            textAlign: 'center',
            color: '#666',
            fontSize: { xs: '12px', sm: '13px' },
            fontFamily: 'stratos-lights, sans-serif',
            opacity: 0.7,
          }}
        >
          Show your appreciation
        </Typography>
      )}
    </Box>
  )
}

export default TipCreatorButton