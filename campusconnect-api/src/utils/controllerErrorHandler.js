const handleControllerError = (res, error) => {
  console.error(error.message ?? error);

  if (error.statusCode) {
    return res.status(error.statusCode).json({ msg: error.message });
  }

  return res.status(500).send('Server error');
};

export default handleControllerError;
