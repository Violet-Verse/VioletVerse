import PostEditor from '../../components/Editor/PostEditorPage'

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
      userTypes: ['admin', 'contributor'],
    },
  }
}

const EditorPage = () => {
  return <PostEditor />
}

export default EditorPage
