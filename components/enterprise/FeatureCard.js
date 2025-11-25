import styles from '../../styles/FeatureCard.module.css'

const CheckmarkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.checkmarkIcon}
  >
    <path
      d="M16.6667 5L7.50004 14.1667L3.33337 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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
            <span className={styles.checkmarkWrapper}>
              <CheckmarkIcon />
            </span>
            <span className={styles.featureText}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeatureCard

