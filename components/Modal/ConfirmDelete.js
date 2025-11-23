import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const DeleteConfirmation = (props) => {
  return (
    <>
      <Dialog {...props}>
        <DialogTitle>Confirm Post Deletion</DialogTitle>
        <DialogContent>
          <p className="secondary">Are you sure you want to delete this post?</p>
          <p className="secondary">
            <b>{props?.title}</b>
          </p>
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={props.handleClose}>
            Go Back
          </Button>
          <Button
            color="error"
            variant="contained"
            sx={{ borderRadius: '10px' }}
            onClick={props.handleDelete}
            autoFocus
          >
            Yes, Delete Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteConfirmation
