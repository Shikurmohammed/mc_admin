import React, { useState } from 'react';
import AddCraftDialog from '../components/crafts/AddCraftDialog';
import { useNavigate } from 'react-router-dom';

const AddCraftPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('/dashboard/my-crafts');
  };

  const handleSuccess = () => {
    setOpen(false);
    navigate('/dashboard/my-crafts');
  };

  return (
    <AddCraftDialog 
      open={open} 
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default AddCraftPage;