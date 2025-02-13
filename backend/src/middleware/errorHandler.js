export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    const statusCode = res.statusCode === 200? 500: res.statusCode; // Set appropriate status code

    res.status(statusCode).json({
        message: err.message || 'Server Error', // Send a user-friendly message
        // Optionally include stack trace in development mode for more detailed debugging
        stack: process.env.NODE_ENV === 'development'? err.stack: undefined,
    });
};