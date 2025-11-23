import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Avatar,
  Grid,
  Stack,
} from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import useSWR from 'swr'
import React, { useState, useEffect } from 'react'

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null }
    })

const EditPicture = (props) => {
  const { data: users, mutate } = useSWR(`/api/database/getUser`, fetcher)
  const user = users?.user
  const onPictureSubmit = async () => {
    const formData = new FormData()
    formData.append('image', selectedImage)
    try {
      await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        {
          method: 'POST',
          body: formData,
        },
      )
        .then((response) => response.json())
        .then((result) => {
          fetch('/api/database/updateProfile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              picture: `${result.data.url}`,
            }),
          })
            .then((response) => response.json())
            .then((newData) => {
              mutate('/api/database/getUser', {
                ...users.user,
                newData,
              })
            })
        })
        .catch((err) => console.error(err))
    } catch (err) {
      console.log(err)
    }
  }

  const clearPicture = async () => {
    const formData = new FormData()
    formData.append('image', selectedImage)
    await fetch('/api/database/clearPicture', {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((newData) => {
        mutate('/api/database/getUser', {
          ...users.user,
          newData,
        })
      })
      .catch((err) => console.error(err))
  }

  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(user?.picture || null)

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage])
  return (
    <>
      <Dialog {...props}>
        <DialogContent>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
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
                  <UploadIcon />
                  Upload{' '}
                  {imageUrl && selectedImage && (
                    <Box sx={{ ml: 2 }}>
                      <Avatar
                        alt={selectedImage?.name || 'current profile picture'}
                        src={imageUrl}
                      />
                    </Box>
                  )}
                  {user?.picture && !selectedImage && (
                    <Box sx={{ ml: 2 }}>
                      <Avatar
                        alt={selectedImage?.name || 'current profile picture'}
                        src={imageUrl}
                      />
                    </Box>
                  )}
                </Button>
              </label>
            </Grid>
            <Grid item>
              {user?.picture && (
                <Button
                  color="error"
                  sx={{ borderRadius: '5px', mt: 2 }}
                  onClick={() => {
                    props.handleClose()
                    clearPicture()
                  }}
                >
                  Reset Picture
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button
            color="success"
            variant="contained"
            sx={{ borderRadius: '10px' }}
            disabled={(!imageUrl && !selectedImage) || user?.picture === imageUrl}
            onClick={() => {
              props.handleClose()
              onPictureSubmit()
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditPicture
