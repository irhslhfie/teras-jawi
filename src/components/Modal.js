import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
};

const ReusableModal = ({ open, onClose, title, content }) => {
    return (
        <Modal
            aria-labelledby="reusable-modal-title"
            aria-describedby="reusable-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Typography id="reusable-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Typography id="reusable-modal-description" sx={{ mt: 2 }}>
                        {content}
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ReusableModal;