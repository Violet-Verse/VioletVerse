import { useUser } from '../../hooks/useAuth'
import ProfileLayout from '../../components/user/ProfileLayout'

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
      userTypes: ['admin', 'contributor', 'user'],
    },
  }
}

const Profile = () => {
  const { user } = useUser()
  return <>{user && <ProfileLayout user={user} />}</>
}

export default Profile
