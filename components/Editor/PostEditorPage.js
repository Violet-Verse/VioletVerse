import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import useSWR from 'swr'
import Image from 'next/image'
import Router from 'next/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useUser } from '../../hooks/useAuth'
import React, { useState, useEffect, useCallback } from 'react'
import DeleteConfirmation from '../Modal/ConfirmDelete'
import dateFormatter from '../../lib/dateFormatter'

const postFetcher = (url) => fetch(url).then((r) => r.json())

const PostEditorPage = (props) => {
  const posts = props?.data
  const editorMode = props?.editorMode
  const { user } = useUser()
  const author = props?.author

  const updateDate = dateFormatter(posts?.lastUpdated, true)
  const [tokenGated, setTokenGated] = useState(posts?.tokenPrice || false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [content, setContent] = useState('')

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue =
        'Are you sure you want to leave? You will lose any unsaved changes.'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const handleChange = (event) => {
    setTokenGated(event.target.checked)
  }

  const { data, mutate } = useSWR(`/api/database/getUserPosts`, postFetcher)

  const initialValue = editorMode
    ? posts?.body
    : '<h1>Into the Violet Verse</h1><p>This is a test post.</p>'

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { body: initialValue },
  })

  const [bannerType, setBannerType] = useState(posts?.video ? 'video' : 'image')

  const handleBannerTypeChange = (event, newType) => {
    if (newType !== null) {
      setBannerType(newType)
    }
  }

  const handlePictureSubmit = async () => {
    if (imageUrl && selectedImage) {
      const formData = new FormData()
      formData.append('image', selectedImage)

      return fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        {
          method: 'POST',
          body: formData,
        },
      )
        .then((response) => response.json())
        .then((result) => {
          return result.data.url
        })
        .catch((err) => {
          console.error(err)
          setErrorMessage(err)
          return null
        })
    } else {
      return null
    }
  }

  const uploadImage = async (fd) => {
    const formData = new FormData()
    formData.append('image', fd)

    return fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.data.url)
        return result.data.url
      })
      .catch((err) => {
        console.error(err)
        setErrorMessage(err)
        return null
      })
  }

  const onSubmit = async ({
    title,
    category,
    body,
    tldr,
    largeLetter,
    hidden,
    subtitle,
    video,
    contributor,
    tokenPrice,
  }) => {
    if (loading) {
      return
    }
    setLoading(true)
    const banner = await handlePictureSubmit()

    await fetch(editorMode ? '/api/database/updatePost' : '/api/database/createPost', {
      method: editorMode ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editorMode ? posts._id : '',
        issuer: editorMode ? author?.userId : '',
        role: editorMode ? user?.role : '',
        title: title,
        category: category,
        body: body,
        tldr: tldr,
        subtitle: subtitle,
        largeLetter: largeLetter,
        hidden: user?.role === 'contributor' ? true : hidden,
        banner: banner,
        video: video,
        contributor: contributor || null,
        tokenPrice: tokenGated ? tokenPrice : null,
      }),
    })
      .then((response) => response.json())
      .then((newData) => {
        setLoading(false)
        mutate('/api/database/getUserPosts', [...data, newData])
        Router.push(editorMode ? `/${posts.slug}` : `/${newData.slug}`)
      })
      .catch((err) => {
        setLoading(false)
        setErrorMessage(err)
        console.log(err)
      })
  }

  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

  const deletePost = async () => {
    setConfirmDeleteDialog(false)
    if (!editorMode) {
      return
    }
    setDeleting(true)
    setLoading(true)
    try {
      await fetch('/api/database/deletePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: posts._id,
          issuer: author?.userId,
        }),
      })
      setDeleting(false)
      setLoading(false)
      Router.push('/posts')
    } catch (err) {
      setDeleting(false)
      setLoading(false)
      setErrorMessage(err)
      console.log(err)
    }
  }

  const clearPicture = () => {
    setImageUrl(posts?.banner || '')
  }

  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(posts?.banner || null)

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage])

  return (
    <Box
      sx={{
        px: {
          xs: '0',
          sm: '5%',
          md: '10%',
          lg: '15%',
          xl: '20%',
        },
      }}
    >
      <DeleteConfirmation
        title={posts?.title}
        open={confirmDeleteDialog}
        handleClose={() => setConfirmDeleteDialog(false)}
        handleDelete={() => deletePost()}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          {editorMode && (
            <Grid item xs={12}>
              <Link href={`/` + posts.slug} legacyBehavior>
                <a>
                  <p>Back to Post</p>
                </a>
              </Link>
            </Grid>
          )}
          {editorMode && posts?.lastEditedBy && (
            <Grid item xs={12}>
              <p style={{ fontSize: '16px' }}>
                {`Lasted edited by: ${props.lastEditor.name} on ${updateDate}`}
              </p>
            </Grid>
          )}
          {editorMode && author && user && author?.userId !== user?.userId && (
            <Grid item xs={12}>
              <p
                style={{
                  fontSize: '16px',
                  color: 'darkred',
                }}
              >
                Warning: This post was not made by you, edit with caution.
              </p>
            </Grid>
          )}
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent={{ xs: 'center', md: 'space-between' }}
          spacing={4}
          sx={{ mb: 4, mt: 0 }}
        >
          <Grid item xs={6} md={9}>
            <Controller
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  label="Title"
                  fullWidth
                  autoFocus
                  error={!!errors?.title}
                  helperText={errors?.title ? errors.title.message : null}
                  {...field}
                />
              )}
              control={control}
              name="title"
              rules={{ required: 'Required field' }}
              defaultValue={posts?.title}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              defaultValue={posts?.category}
              inputProps={register('category', {
                required: 'Please choose a category',
              })}
              error={errors.category}
              helperText={errors.category?.message}
            >
              <MenuItem value={'Tech'}>Tech</MenuItem>
              <MenuItem value={'Lifestyle'}>Lifestyle</MenuItem>
              <MenuItem value={'Education'}>Education</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Controller
              render={({ field }) => (
                <TextField
                  variant="filled"
                  color="secondary"
                  label="Contributor Email (Optional)"
                  fullWidth
                  multiline
                  error={!!errors?.contributor}
                  helperText={errors?.contributor ? errors.contributor.message : null}
                  {...field}
                />
              )}
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              name="contributor"
              defaultValue={posts?.contributor}
            />
          </Grid>
        </Grid>
        <Grid item sx={{ mb: 4 }}>
          <ToggleButtonGroup
            color="secondary"
            value={bannerType}
            exclusive
            onChange={handleBannerTypeChange}
          >
            <ToggleButton value="image">Image</ToggleButton>
            <ToggleButton value="video">Video</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item sx={{ mb: 4 }}>
          <input
            accept="image/*"
            type="file"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            id="select-image"
            style={{ display: 'none' }}
          />
          <label htmlFor="select-image">
            <Button
              variant="contained"
              color="primary"
              component="span"
              sx={{ borderRadius: '4px' }}
            >
              {bannerType == 'video'
                ? 'Article Page Icon (Override Thumbnail)'
                : 'Select Banner'}{' '}
              {imageUrl && selectedImage && (
                <Box sx={{ ml: 2 }}>
                  <Image
                    alt={selectedImage?.name || 'current banner'}
                    width={bannerType !== 'video' ? 1920 : 400}
                    height={bannerType !== 'video' ? 1080 : 400}
                    objectFit={'cover'}
                    src={imageUrl}
                  />
                </Box>
              )}
              {posts?.banner && !selectedImage && (
                <Box sx={{ ml: 2 }}>
                  <Image
                    alt={selectedImage?.name || 'current post banner'}
                    width={1920}
                    height={1080}
                    objectFit={'cover'}
                    src={imageUrl}
                  />
                </Box>
              )}
            </Button>
          </label>
          {posts?.banner && <Button onClick={() => clearPicture()}>Reset Picture</Button>}
        </Grid>

        {bannerType == 'video' && (
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Controller
              render={({ field }) => (
                <TextField
                  variant="filled"
                  color="secondary"
                  label="YouTube URL"
                  fullWidth
                  error={errors?.video}
                  helperText={errors?.video ? errors.video.message : null}
                  {...field}
                />
              )}
              control={control}
              defaultValue={posts?.video}
              rules={{
                pattern: {
                  value:
                    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm,
                  message: 'Invalid YouTube URL',
                },
              }}
              name="video"
            />
          </Grid>
        )}

        <Grid item xs={12} sx={{ mb: 4 }}>
          <Controller
            render={({ field }) => (
              <TextField
                variant="outlined"
                label="Subtitle"
                fullWidth
                multiline
                error={!!errors?.subtitle}
                helperText={errors?.subtitle ? errors.subtitle.message : null}
                {...field}
              />
            )}
            control={control}
            rules={{ required: 'Required field' }}
            name="subtitle"
            defaultValue={posts?.subtitle}
          />
        </Grid>
        {bannerType == 'image' && (
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Controller
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  label="TLDR"
                  fullWidth
                  multiline
                  {...field}
                />
              )}
              control={control}
              name="tldr"
              defaultValue={posts?.tldr}
            />
          </Grid>
        )}
        <Grid item sx={{ mb: 4 }}>
          <Controller
            name="largeLetter"
            control={control}
            defaultValue={posts?.largeLetter == true ? true : false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    defaultChecked={posts?.largeLetter == true ? true : false}
                  />
                }
                label="Drop Cap"
              />
            )}
          />
          <Controller
            name="hidden"
            control={control}
            defaultValue={posts?.hidden == true ? true : false}
            render={({ field }) => (
              <FormControlLabel
                disabled={user?.role === 'contributor'}
                control={
                  <Checkbox
                    {...field}
                    defaultChecked={
                      posts?.hidden == true || user?.role === 'contributor' ? true : false
                    }
                  />
                }
                label="Draft Post"
              />
            )}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={tokenGated}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Token Gated"
          />
        </Grid>
        {tokenGated && (
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Controller
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  label="Token Price"
                  fullWidth
                  type="number"
                  {...field}
                />
              )}
              control={control}
              name="tokenPrice"
              defaultValue={posts?.tokenPrice}
            />
          </Grid>
        )}
        <Grid item>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, value } }) => (
              <Editor
                apiKey="mqo9jzeexjszn0om8f4rb0vfgaqwa4n9yshpb4yxqy3l08bc"
                value={value}
                onEditorChange={onChange}
                init={{
                  selector: 'textarea',
                  branding: false,
                  plugins:
                    'quickbars advlist emoticons anchor autosave autoresize image link lists media searchreplace table template visualblocks wordcount fullscreen autolink',

                  toolbar:
                    'undo redo | styles | bold italic underline emoticons | link image table | bullist numlist | fullscreen',

                  removed_menuitems:
                    'fontfamily fontsize align lineheight forecolor backcolor',

                  max_height: 650,

                  file_picker_types: 'image',

                  browser_spellcheck: true,

                  relative_urls: false,

                  file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement('input')
                    input.setAttribute('type', 'file')
                    input.onchange = async function () {
                      var file = this.files[0]

                      // Upload

                      const imageUrl = await uploadImage(file)

                      cb(imageUrl)
                    }

                    input.click()
                  },

                  block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2',

                  line_height_formats: '1.4',

                  custom_colors: false,

                  style_formats: [
                    { title: 'Header', block: 'h1' },
                    { title: 'Subheader', block: 'h2' },
                    { title: 'Body', block: 'p' },
                    {
                      title: 'Blockquote',
                      block: 'blockquote',
                    },
                  ],

                  object_resizing: false,

                  valid_classes: {
                    img: 'medium',
                    div: 'related-content',
                  },

                  image_caption: true,

                  templates: [
                    {
                      title: 'Related content',
                      description: 'This template inserts a related content block',
                      content:
                        '<div class="related-content"><h3>Related content</h3><p><strong>{$rel_lede}</strong> {$rel_body}</p></div>',
                    },
                  ],

                  template_replace_values: {
                    rel_lede: 'Lorem ipsum',
                    rel_body: 'dolor sit amet...',
                  },

                  template_preview_replace_values: {
                    rel_lede: 'Lorem ipsum',
                    rel_body: 'dolor sit amet...',
                  },

                  noneditable_class: 'related-content',

                  height: 540,
                }}
              />
            )}
          />
        </Grid>
        <Grid item sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                color="success"
                sx={{ borderRadius: '4px', mb: 4 }}
                disabled={loading}
              >
                {editorMode ? 'Save' : 'Create'}
              </Button>
              {editorMode && (
                <Button
                  sx={{ borderRadius: '4px', mb: 4, ml: 2 }}
                  variant="contained"
                  color="error"
                  onClick={() => setConfirmDeleteDialog(true)}
                  disabled={loading}
                >
                  Delete Post
                </Button>
              )}
              {loading && !deleting && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'green',
                    position: 'absolute',
                    top: '30%',
                    left: editorMode ? '16%' : '47%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
              {loading && deleting && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'red',
                    position: 'absolute',
                    top: '30%',
                    left: '70%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
        {/* {errorMessage && (
                    <Grid item>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Grid>
                )} */}
      </form>
    </Box>
  )
}

export default PostEditorPage
