export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  console.error(error.response?.data || error);
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'Video exceeds the 200 MB upload limit.' });
  }
  const status = error.status || error.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Server error. Check the backend terminal.' : error.message
  });
}
