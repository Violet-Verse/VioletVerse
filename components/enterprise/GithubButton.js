import React from 'react'
import { Button, Stack } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const GithubButton = ({ 
  href = 'https://github.com/Violet-Verse/VioletVerse',
  text = 'Join Our GitHub to Learn More',
  variant = 'primary',
  ...props 
}) => {
  const baseStyles = {
    borderRadius: '100px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
      '& .chevron-icon': {
        transform: 'translateX(4px)',
      },
    },
    '&:active': {
      transform: 'translateY(0px)',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
    },
  }

  const variantStyles = {
    primary: {
      backgroundColor: 'rgba(139, 92, 246, 0.9)',
      color: '#ffffff',
      border: '2px solid rgba(139, 92, 246, 0.9)',
      '&:hover': {
        backgroundColor: 'rgba(139, 92, 246, 1)',
        borderColor: 'rgba(139, 92, 246, 1)',
        ...baseStyles['&:hover'],
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      border: '2px solid rgba(139, 92, 246, 0.6)',
      '&:hover': {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 0.9)',
        ...baseStyles['&:hover'],
      },
    },
  }

  const buttonStyles = {
    ...baseStyles,
    ...variantStyles[variant],
  }

  return (
    <Button
      variant="contained"
      disableElevation
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={buttonStyles}
      {...props}
    >
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <span>{text}</span>
        <ChevronRightIcon 
          className="chevron-icon"
          sx={{
            fontSize: '20px',
            transition: 'transform 0.3s ease',
            transform: 'translateX(0)',
          }}
        />
      </Stack>
    </Button>
  )
}

export default GithubButton

