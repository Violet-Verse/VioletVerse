import { Burger } from '@mantine/core'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { cubicBezier, easeOut } from 'motion'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import mobileMenuClasses from './MobileMenu.module.css'

// Animation variants
const menuItemVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      delay: index * 0.08,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
    },
  }),
  exit: { opacity: 0, y: -10, scale: 0.98 },
}

const submenuItemVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.95 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      delay: index * 0.05,
      ease: easeOut,
    },
  }),
}

const submenuContainerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2 },
}

const hoverProps = {
  whileHover: { scale: 1.01, transition: { duration: 0.15, ease: easeOut } },
  whileTap: { scale: 0.99 },
}

const submenuHoverProps = {
  whileHover: { scale: 1.01, x: 2, transition: { duration: 0.1 } },
  whileTap: { scale: 0.98 },
}

// Reusable MenuItem component
const MenuItem = memo(({ index, children }) => (
  <motion.div
    className={mobileMenuClasses.menuItem}
    variants={menuItemVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    custom={index}
    {...hoverProps}
  >
    {children}
  </motion.div>
))

MenuItem.displayName = 'MenuItem'

// Reusable SubmenuItem component
const SubmenuItem = memo(({ index, children }) => (
  <motion.div
    className={mobileMenuClasses.submenuItem}
    variants={submenuItemVariants}
    initial="hidden"
    animate="visible"
    custom={index}
    {...submenuHoverProps}
  >
    {children}
  </motion.div>
))

SubmenuItem.displayName = 'SubmenuItem'

const MobileMenu = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  loaded,
  onLogin,
  navBarItemColor,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const menuRef = useRef(null)

  const handleMenuClick = useCallback(
    (hasSubmenu, submenuId) => {
      if (hasSubmenu && submenuId) {
        setOpenSubmenu(openSubmenu === submenuId ? null : submenuId)
        if (typeof global !== 'undefined' && global.analytics) {
          global.analytics.track('Mobile Menu Submenu Toggled', {
            submenu: submenuId,
            action: openSubmenu === submenuId ? 'closed' : 'opened',
          })
        }
      } else {
        setIsMobileMenuOpen(false)
        setOpenSubmenu(null)
      }
    },
    [openSubmenu, setIsMobileMenuOpen],
  )

  const handleSubmenuClick = useCallback(
    (category) => {
      setIsMobileMenuOpen(false)
      setOpenSubmenu(null)
      if (typeof global !== 'undefined' && global.analytics) {
        global.analytics.track('Mobile Menu Category Selected', {
          category,
        })
      }
    },
    [setIsMobileMenuOpen],
  )

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
        setOpenSubmenu(null)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen, setIsMobileMenuOpen])

  const categories = [
    { name: 'Tech', href: '/posts?category=Tech' },
    { name: 'Lifestyle', href: '/posts?category=Lifestyle' },
    { name: 'Education', href: '/posts?category=Education' },
  ]

  return (
    <div className={mobileMenuClasses.mobileMenuContainer} ref={menuRef}>
      <Burger
        opened={isMobileMenuOpen}
        onClick={() => {
          setIsMobileMenuOpen(!isMobileMenuOpen)
          if (typeof global !== 'undefined' && global.analytics) {
            global.analytics.track('Mobile Menu Toggled', {
              action: !isMobileMenuOpen ? 'opened' : 'closed',
            })
          }
        }}
        size="sm"
        color={navBarItemColor || 'var(--mantine-color-black)'}
        className={mobileMenuClasses.burger}
      />

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            className={mobileMenuClasses.menuContent}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Connect Wallet - Only show if not logged in */}
            {!user && loaded && (
              <MenuItem index={0}>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof global !== 'undefined' && global.analytics) {
                      global.analytics.track('Mobile Menu Login Clicked')
                    }
                    onLogin()
                    handleMenuClick(false)
                  }}
                  className={mobileMenuClasses.menuButton}
                >
                  Sign In
                </button>
              </MenuItem>
            )}

            {/* Explore with Categories Submenu */}
            <MenuItem index={!user && loaded ? 1 : 0}>
              <button
                type="button"
                onClick={() => handleMenuClick(true, 'explore')}
                className={mobileMenuClasses.menuButton}
              >
                <span>Explore</span>
                <motion.div
                  animate={{ rotate: openSubmenu === 'explore' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={mobileMenuClasses.chevron}
                >
                  <ExpandMoreIcon sx={{ fontSize: 20 }} />
                </motion.div>
              </button>
            </MenuItem>

            {/* Categories Submenu */}
            <AnimatePresence>
              {openSubmenu === 'explore' && (
                <motion.div
                  variants={submenuContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={mobileMenuClasses.submenuContainer}
                >
                  {categories.map((category, subIndex) => (
                    <SubmenuItem key={category.href} index={subIndex}>
                      <Link
                        href={category.href}
                        legacyBehavior
                        onClick={() => handleSubmenuClick(category.name)}
                      >
                        <a className={mobileMenuClasses.submenuButton}>
                          {category.name}
                        </a>
                      </Link>
                    </SubmenuItem>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enterprise Plan */}
            <MenuItem index={!user && loaded ? 2 : 1}>
              <Link
                href="/enterprise"
                legacyBehavior
                onClick={() => handleMenuClick(false)}
              >
                <a className={mobileMenuClasses.menuButton}>
                  Enterprise Plan
                </a>
              </Link>
            </MenuItem>

            {/* VV VR */}
            <MenuItem index={!user && loaded ? 3 : 2}>
              <a
                target="_blank"
                href="/vr"
                rel="noopener noreferrer"
                onClick={() => handleMenuClick(false)}
                className={mobileMenuClasses.menuButton}
              >
                VV VR
              </a>
            </MenuItem>

            {/* Community */}
            <MenuItem index={!user && loaded ? 4 : 3}>
              <Link
                href="/about"
                legacyBehavior
                onClick={() => handleMenuClick(false)}
              >
                <a className={mobileMenuClasses.menuButton}>
                  Community
                </a>
              </Link>
            </MenuItem>

            {/* Agent */}
            <MenuItem index={!user && loaded ? 5 : 4}>
              <Link
                href="/agent"
                legacyBehavior
                onClick={() => handleMenuClick(false)}
              >
                <a className={mobileMenuClasses.menuButton}>
                  Agent
                </a>
              </Link>
            </MenuItem>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileMenu

