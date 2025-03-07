'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import OrboSkinAnalyzer from '../OrboSkinAnalyzer';
import { Grid2 } from '@mui/material';

interface FullscreenDialogProps {
  open: boolean;
  onClose: () => void;
}

const FullscreenDialog: React.FC<FullscreenDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <Grid2 container rowSpacing={10} sx={{ mb: 0, justifyContent: 'space-between' }}>
        <DialogTitle></DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Grid2>
      <DialogContent>
        <OrboSkinAnalyzer />
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenDialog;
