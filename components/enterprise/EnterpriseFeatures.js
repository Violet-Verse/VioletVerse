import React from 'react'
import FeatureCard from './FeatureCard'
import styles from '../../styles/EnterpriseFeatures.module.css'

const featuresData = [
  {
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
    title: 'Tailored Content Creation',
    features: [
      'Elevate your content creation with SEO optimization and tailor-made tools that empower your creativity.',
      "Paid and Free Content Discoverability System: Seamlessly switch between private and public access, giving you control over your content's visibility.",
    ],
  },
  {
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m8 6 4-4 4 4" />
        <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
        <path d="m20 22-5-5" />
      </svg>
    ),
    title: 'Engage and Expand Your Audience',
    features: [
      'Audience Community Hub: With just three clicks, your audience can register and immerse themselves in your community.',
      'Authenticated Membership Login: Ensure the authenticity of every individual engaging with your platform.',
      'Customizable Profiles: Let your members express their unique identities through customizable profiles.',
    ],
  },
  {
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'Streamlined Monetization',
    features: [
      'Seamless Payment Integration: Effortlessly monetize your content and services through a secure and convenient payment gateway.',
    ],
  },
  {
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: 'Effortless Communication',
    features: [
      'Text Messaging and Email Integration: Stay connected with your audience through text messages and emails, fostering engagement and communication.',
    ],
  },
  {
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Secure Content Distribution',
    features: [
      'Tokenization Digital Asset Distribution: Protect your digital assets with state-of-the-art tokenization, ensuring secure and traceable distribution.',
    ],
  },
  {
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m8 6 4-4 4 4" />
        <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
        <path d="m20 22-5-5" />
      </svg>
    ),
    title: 'Immersive Experiences',
    features: [
      'AR/VR Integration: Elevate your content with cutting-edge Augmented Reality (AR) and Virtual Reality (VR) integration, offering immersive experiences like never before.',
    ],
  },
]

const EnterpriseFeatures = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Discover Our Unique Features</h2>
          <p className={styles.description}>
            At Violet Verse, we&apos;ve meticulously crafted a suite of features that
            cater specifically to the intricate demands of the government, media, and entertainment
            communities. Our platform is a symphony of global diversity, heightened
            productivity, and streamlined workflows, all tailored to meet your unique
            needs.
          </p>
        </div>
        <div className={styles.cardsGrid}>
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              features={feature.features}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EnterpriseFeatures

