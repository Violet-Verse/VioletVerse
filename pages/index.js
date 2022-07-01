import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 className={styles.title}>Welcome to the Violet Verse</h1>
      <p className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <Link href="/"><a className={styles.btn}>Read More</a></Link>
      <Link href="/"><a className={styles.btn}>Our Community</a></Link>
    </div>
  )
}
