import styles from '../../styles/FeatureCard.module.css'

const FeatureCard = ({ icon, title, features }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.featuresList}>
        {features.map((feature) => (
          <li key={feature} className={styles.featureItem}>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeatureCard

