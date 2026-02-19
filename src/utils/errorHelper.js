export const getErrorMessage = (err) => {
  // 1. Connection/Network Errors
  if (err.message === "Network Error" || !err.response) {
    return "Unable to connect to the server. Please check your internet or try again later.";
  }

  // 2. Timeout Errors
  if (err.code === 'ECONNABORTED') {
    return "The request took too long. Please try again.";
  }

  // 3. Backend Validation/Logic Errors
  const backendMessage = err.response?.data?.message;
  if (backendMessage) {
    return Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage;
  }

  // 4. Fallback for specific status codes
  switch (err.response?.status) {
    case 400: return "Invalid request.";
    case 401: return "Incorrect email or password.";
    case 403: return "You do not have permission to perform this action.";
    case 404: return "The requested resource was not found.";
    case 500: return "Internal server error. Please try again later.";
    default: return "An unexpected error occurred.";
  }
};