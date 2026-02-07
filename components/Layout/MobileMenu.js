// Simple hamburger button (replaces Mantine Burger for v5 compat)
const BurgerButton = ({ opened, onClick, color, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={className}
    aria-label={opened ? 'Close menu' : 'Open menu'}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '34px',
      height: '34px',
      gap: opened ? '0px' : '5px',
      position: 'relative',
    }}
  >
    <span style={{
      display: 'block', width: '22px', height: '2px',
      backgroundColor: color || 'black', borderRadius: '1px',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: opened ? 'translateY(3.5px) rotate(45deg)' : 'none',
    }} />
    <span style={{
      display: 'block', width: '22px', height: '2px',
      backgroundColor: color || 'black', borderRadius: '1px',
      transition: 'opacity 0.3s ease',
      opacity: opened ? 0 : 1,
    }} />
    <span style={{
      display: 'block', width: '22px', height: '2px',
      backgroundColor: color || 'black', borderRadius: '1px',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: opened ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
    }} />
  </button>
)
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { cubicBezier, easeOut } from 'motion'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import mobileMenuClasses from './MobileMenu.module.css'

const menuItemVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: (index) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.25, delay: index * 0.08, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) },
  }),
  exit: { opacity: 0, y: -10, scale: 0.98 },
}

const submenuItemVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.95 },
  visible: (index) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.2, delay: index * 0.05, ease: easeOut },
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

const MenuItem = memo(({ index, children }) => (
  <motion.div
    className={mobileMenuClasses.menuItem}
    variants={menuItemVariants}
    initial="hidden" animate="visible" exit="exit"
    custom={index} {...hoverProps}
  >
    {children}
  </motion.div>
))
MenuItem.displayName = 'MenuItem'

const SubmenuItem = memo(({ index, children }) => (
  <motion.div
    className={mobileMenuClasses.submenuItem}
    variants={submenuItemVariants}
    initial="hidden" animate="visible"
    custom={index} {...submenuHoverProps}
  >
    {children}
  </motion.div>
))
SubmenuItem.displayName = 'SubmenuItem'

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen, user, loaded, onLogin, navBarItemColor }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const menuRef = useRef(null)

  const handleMenuClick = useCallback((hasSubmenu, submenuId) => {
    if (hasSubmenu && submenuId) {
      setOpenSubmenu(openSubmenu === submenuId ? null : submenuId)
      if (typeof global !== 'undefined' && global.analytics) {
        global.analytics.track('Mobile Menu Submenu Toggled', { submenu: submenuId, action: openSubmenu === submenuId ? 'closed' : 'opened' })
      }
    } else {
      setIsMobileMenuOpen(false)
      setOpenSubmenu(null)
    }
  }, [openSubmenu, setIsMobileMenuOpen])

  const handleSubmenuClick = useCallback((category) => {
    setIsMobileMenuOpen(false)
    setOpenSubmenu(null)
    if (typeof global !== 'undefined' && global.analytics) {
      global.analytics.track('Mobile Menu Category Selected', { category })
    }
  }, [setIsMobileMenuOpen])

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
    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [isMobileMenuOpen, setIsMobileMenuOpen])

  const categories = [
    { name: 'Tech', href: '/posts?category=Tech' },
    { name: 'Lifestyle', href: '/posts?category=Lifestyle' },
    { name: 'Education', href: '/posts?category=Education' },
  ]

  return (
    <div className={mobileMenuClasses.mobileMenuContainer} ref={menuRef}>
      <BurgerButton
        opened={isMobileMenuOpen}
        onClick={() => {
          setIsMobileMenuOpen(!isMobileMenuOpen)
          if (typeof global !== 'undefined' && global.analytics) {
            global.analytics.track('Mobile Menu Toggled', { action: !isMobileMenuOpen ? 'opened' : 'closed' })
          }
        }}
        color={navBarItemColor || 'black'}
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
            {!user && loaded && (
              <MenuItem index={0}>
                <button type="button" onClick={() => { if (typeof global !== 'undefined' && global.analytics) { global.analytics.track('Mobile Menu Login Clicked') } onLogin(); handleMenuClick(false) }} className={mobileMenuClasses.menuButton}>
                  Connect Wallet
                </button>
              </MenuItem>
            )}

            <MenuItem index={!user && loaded ? 1 : 0}>
              <button type="button" onClick={() => handleMenuClick(true, 'explore')} className={mobileMenuClasses.menuButton}>
                <span>Explore</span>
                <motion.div animate={{ rotate: openSubmenu === 'explore' ? 180 : 0 }} transition={{ duration: 0.2 }} className={mobileMenuClasses.chevron}>
                  <ExpandMoreIcon sx={{ fontSize: 20 }} />
                </motion.div>
              </button>
            </MenuItem>

            <AnimatePresence>
              {openSubmenu === 'explore' && (
                <motion.div variants={submenuContainerVariants} initial="hidden" animate="visible" exit="exit" className={mobileMenuClasses.submenuContainer}>
                  {categories.map((category, subIndex) => (
                    <SubmenuItem key={category.href} index={subIndex}>
                      <Link href={category.href} legacyBehavior onClick={() => handleSubmenuClick(category.name)}>
                        <a className={mobileMenuClasses.submenuButton}>{category.name}</a>
                      </Link>
                    </SubmenuItem>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <MenuItem index={!user && loaded ? 2 : 1}>
              <Link href="/enterprise" legacyBehavior onClick={() => handleMenuClick(false)}>
                <a className={mobileMenuClasses.menuButton}>Enterprise Plan</a>
              </Link>
            </MenuItem>

            <MenuItem index={!user && loaded ? 3 : 2}>
              <a target="_blank" href="/vr" rel="noopener noreferrer" onClick={() => handleMenuClick(false)} className={mobileMenuClasses.menuButton}>
                VV VR
              </a>
            </MenuItem>

            <MenuItem index={!user && loaded ? 4 : 3}>
              <Link href="/about" legacyBehavior onClick={() => handleMenuClick(false)}>
                <a className={mobileMenuClasses.menuButton}>Community</a>
              </Link>
            </MenuItem>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  