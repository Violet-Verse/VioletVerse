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
      display: 'block',
      width: '22px',
      height: '2px',
      backgroundColor: color || 'black',
      borderRadius: '1px',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: opened ? 'translateY(3.5px) rotate(45deg)' : 'none',
    }} />
    <span style={{
      display: 'block',
      width: '22px',
      height: '2px',
      backgroundColor: color || 'black',
      borderRadius: '1px',
      transition: 'opacity 0.3s ease',
      opacity: opened ? 0 : 1,
    }} />
    <span style={{
      display: 'block',
      width: '22px',
      height: '2px',
      backgroundColor: color || 'black',
      borderRadius: '1px',
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
        se