import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { usePrivy } from '@privy-io/react-auth'
import { useSWRConfig } from 'swr'
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
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../hooks/useAuth'
import UserAvatar from '../user/UserAvatar'
import { nFormatter, useFlowContext } from '../Context/flowContext'
import SignUpCTA from '../Modal/SignUpCTA.js'
import { useRouter } from 'next/router'
import MobileMenu from './MobileMenu'
import classes from './Navbar.module.css'

// Safe analytics helper — prevents crashes if analytics script hasn't loaded
function track(event, props) {
  try {
    if (typeof global !== 'undefined' && global.analytics) {
      global.analytics.track(event, props)
    }
  } catch (_) {}
}

const NewNav = () => {
  const router = useRouter()
  const { user, loaded } = useUser()
  const {
    login: privyLogin,
    logout: privyLogout,
    authenticated,
    ready,
    getAccessToken,
  } = usePrivy()
  const isEnterprise = router.asPath.includes('enterprise') || router.asPath.includes('experts')
  const navBarItemColor = isEnterprise ? 'white' : 'black'
  const [isHydrated, setIsHydrated] = useState(false)
  const verifyingRef = useRef(false)

  const { mutate } = useSWRConfig()

  // Identify User for Analytics
  useEffect(() => {
    if (user) {
      try {
        if (typeof global !== 'undefined' && global.analytics) {
          global.analytics.identify(user?.userId, {
            username: user?.name,
            email: user?.email,
          })
        }
      } catch (_) {}
    }
  }, [loaded, user])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // After Privy authentication, verify with our server and create session
  useEffect(() => {
    const verifyPrivyUser = async () => {
      if (!ready || !authenticated || user || verifyingRef.current) return

      verifyingRef.current = true

      try {
        const accessToken = await getAccessToken()

        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })

        const result = await response.json()

        if (response.ok) {
          // Refresh user data first (critical path)
          mutate('/api/database/getUser')
          // Analytics is non-critical — don't let it block auth flow
          track(
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
            },
          )
        } else {
          await privyLogout()
        }
      } catch (err) {
        console.error('Verify error:', err)
        await privyLogout()
      } finally {
        verifyingRef.current = false
      }
    }

    verifyPrivyUser()
  }, [authenticated, user, ready, getAccessToken, mutate, privyLogout])

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
    track('Profile Menu Hidden')
    setAnchorElUser(null)
  }

  const login = () => {
    if (!ready) return
    privyLogin()
  }

  useEffect(() => {
    const ctaClosed = () => {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('ctaDismissed')
      }
    }
    const shouldShowCTA = loaded && !ctaClosed() && !user
    if (shouldShowCTA) {
      setSignupCTA(true)
      track('Signup CTA Displayed')
    } else {
      setSignupCTA(false)
    }
  }, [loaded, user])

  const [signupCTA, setSignupCTA] = useState(false)

  const setFirstVisit = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ctaDismissed', true)
      setSignupCTA(false)
    }
  }

  return (
    <>
      <SignUpCTA
        open={signupCTA}
        handleClose={() => {
          track('Signup CTA Hidden')
          setFirstVisit()
        }}
        handleSignup={() => {
          track('Signup CTA Clicked')
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

              {/* Menu Items | Desktop only (lg and above) */}
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
                        Journal
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
                  <Link href="/experts" legacyBehavior>
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
                        Experts
                      </Button>
                    </a>
                  </Link>
                  <Link href="/travel" legacyBehavior>
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
                        Travel
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

                {/* Book a Call CTA | All users, desktop only */}
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
                    mr: 1,
                  }}
                >
                  <a
                    href="https://calendly.com/violetverse"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      disableElevation
                      variant="contained"
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        fontWeight: '400',
                        fontSize: '16px',
                      }}
                    >
                      Book a Call
                    </Button>
                  </a>
                </Box>

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
                            track('Profile Menu Displayed')
                            handleOpenUserMenu(event)
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
                            track('Profile Menu Item Clicked', {
                              page: 'Profile Page',
                            })
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
                              Router.push('/dashboard')
                              track('Profile Menu Item Clicked', {
                                page: 'Dashboard Page',
                              })
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
                            Router.push('/tokens')
                            track('Profile Menu Item Clicked', {
                              page: 'My Wallet Page',
                            })
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
                            Router.push('/profile/edit')
                            track('Profile Menu Item Clicked', {
                              page: 'Edit Profile Page',
                            })
                            setAnchorElUser(null)
                          }}
                        >
                          <ListItemIcon>
                            <Settings fontSize="small" />
                          </ListItemIcon>
                          Settings
                        </MenuItem>
                        <MenuItem
                          onClick={async () => {
                            await privyLogout()
                            track('Logout Button Clicked')
                            Router.push('/api/auth/logout')
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

                {/* Sign In || Logged Out */}

                {!user && (
                  <Box
                    sx={{
                      display: { xs: 'flex', md: 'flex', lg: 'flex' },
                      flex: 1,
                      justifyContent: 'end',
                    }}
                  >
                    {/* Sign In | Desktop only (1220px and above) */}
                    {/* Mobile/Tablet users access Sign In through MobileMenu dropdown */}
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
                          track('Login Button Clicked')
                        }}
                        sx={{
                          py: 1.5,
                          px: 2.5,
                          fontWeight: '400',
                          fontSize: '16px',
                        }}
                      >
                        Sign In
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
