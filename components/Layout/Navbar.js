import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
  ListItemIcon,
} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import { useUser } from '../../hooks/useAuth'
import UserAvatar from '../user/UserAvatar'
import SignUpCTA from '../Modal/SignUpCTA.js'
import { useRouter } from 'next/router'
import MobileMenu from './MobileMenu'
import classes from './Navbar.module.css'

const NewNav = () => {
  const router = useRouter()
  const { user, loaded, logout } = useUser()
  const isEnterprise = router.asPath.includes('enterprise')
  const navBarItemColor = isEnterprise ? 'white' : 'black'
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (user && typeof global.analytics !== 'undefined') {
      global.analytics.identify(user?.userId, {
        username: user?.name,
        email: user?.email,
      })
    }
  }, [loaded, user])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const [pinned, setPinned] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 50) {
        setPinned(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setPinned(false)
        setIsMobileMenuOpen(false)
      } else if (currentScrollY < lastScrollY) {
        setPinned(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const dashboardPermission = Boolean(user)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    if (typeof global.analytics !== 'undefined') {
      global.analytics.track('Profile Menu Hidden')
    }
    setAnchorElUser(null)
  }

  const login = () => {
    Router.push('/connect')
  }

  useEffect(() => {
    const ctaClosed = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('homepageCTA')
      }
    }
    const shouldShowCTA = loaded && !ctaClosed() && !user
    if (shouldShowCTA) {
      setSignupCTA(true)
      if (typeof global.analytics !== 'undefined') {
        global.analytics.track('Signup CTA Displayed')
      }
    } else {
      setSignupCTA(false)
    }
  }, [loaded, user])

  const [signupCTA, setSignupCTA] = useState(false)

  const setFirstVisit = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('homepageCTA', true)
      setSignupCTA(false)
    }
  }

  return (
    <>
      <SignUpCTA
        open={signupCTA}
        handleClose={() => {
          if (typeof global.analytics !== 'undefined') {
            global.analytics.track('Signup CTA Hidden')
          }
          setFirstVisit()
        }}
        handleSignup={() => {
          if (typeof global.analytics !== 'undefined') {
            global.analytics.track('Signup CTA Clicked')
          }
          login()
          setFirstVisit()
        }}
      />
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
      )}
      <header
        className={`${classes.header} ${pinned ? classes.visible : classes.hidden}`}
      >
        <div
          className={`${classes.container} ${classes.floating} ${isEnterprise ? classes.enterprise : ''}`}
        >
          {loaded && (
            <>
              <div
                className={`${classes.menuContainer} ${classes.mobile} ${isHydrated ? classes.hydrated : ''}`}
              >
                <MobileMenu
                  isMobileMenuOpen={isMobileMenuOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  user={user}
                  loaded={loaded}
                  onLogin={login}
                  navBarItemColor={navBarItemColor}
                />
              </div>

              <div
                className={`${classes.menuContainer} ${classes.desktop} ${isHydrated ? classes.hydrated : ''}`}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'none', lg: 'none', xl: 'flex' },
                    '@media (min-width: 1220px)': {
                      display: 'flex',
                    },
                    justifyContent: 'start',
                  }}
                >
                  <Link href="/posts" legacyBehavior>
                    <a>
                      <Button
                        sx={{
                          my: 2,
                          color: navBarItemColor,
                          display: 'block',
                          mr: '15px',
                          fontFamily: 'Ogg',
                          fontSize: '18px',
                          lineHeight: '130%',
                          letterSpacing: '-0.005em',
                          textDecoration: 'none',
                        }}
                      >
                        Explore
                      </Button>
                    </a>
                  </Link>
                  <Link href="/enterprise" legacyBehavior>
                    <a>
                      <Button
                        sx={{
                          my: 2,
                          color: navBarItemColor,
                          display: 'block',
                          mr: '15px',
                          fontFamily: 'Ogg',
                          fontSize: '18px',
                          lineHeight: '130%',
                          letterSpacing: '-0.005em',
                          textDecoration: 'none',
                        }}
                      >
                        Enterprise Plan
                      </Button>
                    </a>
                  </Link>
                  <Link href="/about" legacyBehavior>
                    <a>
                      <Button
                        sx={{
                          my: 2,
                          color: navBarItemColor,
                          display: 'block',
                          fontFamily: 'Ogg',
                          fontSize: '18px',
                          lineHeight: '130%',
                          letterSpacing: '-0.005em',
                          textDecoration: 'none',
                        }}
                      >
                        Community
                      </Button>
                    </a>
                  </Link>
                </Box>
              </div>

              <Link href="/" legacyBehavior>
                <a className={classes.logo}>
                  <Image src="/Logo.svg" alt="Violet Verse" height={59} width={105} />
                </a>
              </Link>

              {user && (
                <Box
                  sx={{
                    display: { xs: 'flex' },
                    flex: 1,
                    justifyContent: 'end',
                  }}
                >
                  <Box sx={{ display: { xs: 'flex' } }}>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={(event) => {
                          if (typeof global.analytics !== 'undefined') {
                            global.analytics.track('Profile Menu Displayed')
                          }
                          handleOpenUserMenu(event)
                        }}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <UserAvatar user={user} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      keepMounted={true}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem
                        onClick={() => {
                          Router.push('/profile')
                          if (typeof global.analytics !== 'undefined') {
                            global.analytics.track('Profile Menu Item Clicked', {
                              page: 'Profile Page',
                            })
                          }
                          setAnchorElUser(null)
                        }}
                      >
                        <Avatar
                          alt={user?.name || 'user picture'}
                          src={user?.picture}
                        />
                        Profile
                      </MenuItem>
                      <Divider />
                      {dashboardPermission && (
                        <MenuItem
                          onClick={() => {
                            Router.push('/dashboard')
                            if (typeof global.analytics !== 'undefined') {
                              global.analytics.track('Profile Menu Item Clicked', {
                                page: 'Dashboard Page',
                              })
                            }
                            setAnchorElUser(null)
                          }}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          Dashboard
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          Router.push('/profile/edit')
                          if (typeof global.analytics !== 'undefined') {
                            global.analytics.track('Profile Menu Item Clicked', {
                              page: 'Edit Profile Page',
                            })
                          }
                          setAnchorElUser(null)
                        }}
                      >
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (typeof global.analytics !== 'undefined') {
                            global.analytics.track('Logout Button Clicked')
                          }
                          logout()
                          setAnchorElUser(null)
                        }}
                      >
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              )}

              {!user && (
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'flex', lg: 'flex' },
                    flex: 1,
                    justifyContent: 'end',
                  }}
                >
                  <Box
                    sx={{
                      display: {
                        xs: 'none',
                        md: 'none',
                        lg: 'none',
                        xl: 'flex',
                      },
                      '@media (min-width: 1220px)': {
                        display: 'flex',
                      },
                    }}
                  >
                    <Button
                      disableElevation={true}
                      variant="contained"
                      onClick={() => {
                        login()
                        if (typeof global.analytics !== 'undefined') {
                          global.analytics.track('Login Button Clicked')
                        }
                      }}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        fontWeight: '400',
                        fontSize: '16px',
                      }}
                    >
                      Connect Wallet
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </div>
      </header>
    </>
  )
}

export default NewNav