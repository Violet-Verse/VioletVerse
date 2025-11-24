import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import * as fcl from '@blocto/fcl'
import { useSWRConfig } from 'swr'
import '../../flow/config.js'
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
import { Overlay } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import { useUser } from '../../hooks/useAuth'
import UserAvatar from '../user/UserAvatar'
import { nFormatter, useFlowContext } from '../Context/flowContext'
import SignUpCTA from '../Modal/SignUpCTA.js'
import { useRouter } from 'next/router'
import MobileMenu from './MobileMenu'
import classes from './Navbar.module.css'
const NewNav = () => {
  const router = useRouter()
  const { user, loaded } = useUser()
  const isEnterprise = router.asPath.includes('enterprise')
  const navBarItemColor = isEnterprise ? 'white' : 'black'
  const [isHydrated, setIsHydrated] = useState(false)

  // Identify User for Analytics
  useEffect(() => {
    if (user) {
      global.analytics.identify(user?.userId, {
        username: user?.name,
        email: user?.email,
      })
    }
  }, [loaded, user])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Custom scroll-based header visibility (replacement for useHeadroom)
  const [pinned, setPinned] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 50) {
        // Always show header when near top
        setPinned(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide header
        setPinned(false)
        setIsMobileMenuOpen(false) // Close mobile menu when header is hidden
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setPinned(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const vvTokens = nFormatter(useFlowContext(), 2)

  const dashboardPermission = user?.role === 'admin' || user?.role === 'contributor'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    global.analytics.track('Profile Menu Hidden')
    setAnchorElUser(null)
  }

  const { mutate } = useSWRConfig()

  const login = async () => {
    try {
      const res = await fcl.authenticate()

      const accountProofService = res.services.find(
        (services) => services.type === 'account-proof'
      )

      const userEmail = res.services.find(
        (services) => services.type === 'open-id'
      ).data.email.email

      if (accountProofService) {
        fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: accountProofService.data.address,
            nonce: accountProofService.data.nonce,
            signatures: accountProofService.data.signatures,
            userEmail,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            global.analytics.track(
              result.registration
                ? 'User Registration Success'
                : 'User Login Success ',
              {
                ...(result.registration && {
                  userId: result.userData.userId,
                }),
                ...(result.registration && {
                  email: result.userData.email,
                }),
                ...(result.registration && {
                  role: result.userData.role,
                }),
                ...(result.registration && {
                  flowAddress: result.userData.flowAddress,
                }),
              },
            )
            mutate('/api/database/getUser')
          })
          .catch(() => {
            fcl.unauthenticate()
          })
      }
    } catch {
      // Authentication error handled silently
    }
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
      global.analytics.track('Signup CTA Displayed')
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
          global.analytics.track('Signup CTA Hidden')
          setFirstVisit()
        }}
        handleSignup={() => {
          global.analytics.track('Signup CTA Clicked')
          login()
          setFirstVisit()
        }}
      />
      {/* Overlay rendered at header level to blur background content */}
      {isMobileMenuOpen && (
        <Overlay
          fixed={true}
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ zIndex: 40, backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
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
              {/* Mobile Menu | XS Breakpoint */}
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

              {/* Menu Items | Medium or larger */}
              <div
                className={`${classes.menuContainer} ${classes.desktop} ${isHydrated ? classes.hydrated : ''}`}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: { xs: 'none', lg: 'flex' },
                    justifyContent: 'start',
                  }}
                >
                  <Link href="/posts" legacyBehavior>
                    <a>
                      <Button
                        sx={{
                          my: 2,
                          color: `${navBarItemColor}`,
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
                          color: `${navBarItemColor}`,
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
                          color: `${navBarItemColor}`,
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

              {/* Logo | All Breakpoints */}
              <Link href="/" legacyBehavior>
                <a className={classes.logo}>
                  <Image src="/Logo.svg" alt="Violet Verse" height={59} width={105} />
                </a>
              </Link>

                {/* Connect Wallet + VV Tokens || Logged In*/}

                {user && (
                  <Box
                    sx={{
                      display: { xs: 'flex' },
                      flex: 1,
                      justifyContent: 'end',
                    }}
                  >
                    {/* VV Tokens | Large or larger */}

                    <Box
                      sx={{
                        display: {
                          xs: 'none',
                          lg: 'flex',
                        },
                        mr: { xs: 0, lg: 6 },
                      }}
                    >
                      <Button
                        variant="contained"
                        disableElevation={true}
                        onClick={() => Router.push('/tokens')}
                        sx={{
                          fontWeight: '400',
                          fontSize: '16px',
                          py: 1.5,
                          px: 2.5,
                        }}
                      >
                        <Image
                          alt="edit"
                          src="/star.svg"
                          height={16}
                          width={16}
                        />
                        &nbsp;&nbsp;
                        {vvTokens
                          ? `${vvTokens} $VV Tokens`
                          : `Setup VV Wallet`}
                      </Button>
                    </Box>

                    {/* Profile Avatar Menu | All Breakpoints */}

                    <Box
                      sx={{
                        display: { xs: 'flex' },
                      }}
                    >
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={(event) => {
                            global.analytics.track(
                              'Profile Menu Displayed'
                            )
                            handleOpenUserMenu(
                              event
                            )
                          }}
                          size="small"
                          aria-controls={
                            open
                              ? 'account-menu'
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            open
                              ? 'true'
                              : undefined
                          }
                        >
                          <UserAvatar user={user} />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        transformOrigin={{
                          horizontal: 'right',
                          vertical: 'top',
                        }}
                        anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'top',
                        }}
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
                              position:
                                'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor:
                                'background.paper',
                              transform:
                                'translateY(-50%) rotate(45deg)',
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
                            global.analytics.track(
                              'Profile Menu Item Clicked',
                              {
                                page: 'Profile Page',
                              }
                            )
                            setAnchorElUser(null)
                          }}
                        >
                          <Avatar
                            alt={
                              user?.name ||
                              'user picture'
                            }
                            src={user?.picture}
                          />
                          Profile
                        </MenuItem>
                        <Divider />

                        {dashboardPermission && (
                          <MenuItem
                            onClick={() => {
                              Router.push(
                                '/dashboard'
                              )
                              global.analytics.track(
                                'Profile Menu Item Clicked',
                                {
                                  page: 'Dashboard Page',
                                }
                              )
                              setAnchorElUser(
                                null
                              )
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
                            Router.push('/tokens')
                            global.analytics.track(
                              'Profile Menu Item Clicked',
                              {
                                page: 'Dashboard Page',
                              }
                            )
                            setAnchorElUser(null)
                          }}
                        >
                          <ListItemIcon>
                            <AccountBalanceWalletIcon fontSize="small" />
                          </ListItemIcon>
                          My Wallet
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            Router.push(
                              '/profile/edit'
                            )
                            global.analytics.track(
                              'Profile Menu Item Clicked',
                              {
                                page: 'Edit Profile Page',
                              }
                            )
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
                            fcl.unauthenticate()
                            global.analytics.track(
                              'Logout Button Clicked'
                            )
                            Router.push(
                              '/api/auth/logout'
                            )
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

                {/* Connect Wallet || Logged Out */}

                {!user && (
                  <Box
                    sx={{
                      display: { xs: 'flex' },
                      flex: 1,
                      justifyContent: 'end',
                    }}
                  >
                    {/* Connect Wallet | XS Breakpoint */}

                    <Box
                      sx={{
                        display: {
                          xs: 'flex',
                          lg: 'none',
                        },
                      }}
                    >
                      <IconButton
                        size="large"
                        aria-label="account"
                        aria-controls="menu-appbar"
                        color="inherit"
                        onClick={() => {
                          login()
                          global.analytics.track(
                            'Login Button Clicked'
                          )
                        }}
                      >
                        <PersonOutlineSharpIcon
                          sx={{ fontSize: '32px' }}
                        />
                      </IconButton>
                    </Box>

                    {/* Connect Wallet | Large or larger */}
                    <Box
                      sx={{
                        display: {
                          xs: 'none',
                          lg: 'flex',
                        },
                      }}
                    >
                      <Button
                        disableElevation={true}
                        variant="contained"
                        onClick={() => {
                          login()
                          global.analytics.track(
                            'Login Button Clicked'
                          )
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
