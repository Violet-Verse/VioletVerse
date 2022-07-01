import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { Button } from '@nextui-org/react';

export default function Home() {
  return (
    <div>
      <h1 className={styles.title}>Welcome to the Violet Verse</h1>
      <p className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <Link href="/about"><Button>Read More</Button></Link>
      <Link href="/"><Button>Our Community</Button></Link>
    </div>
  )
}
