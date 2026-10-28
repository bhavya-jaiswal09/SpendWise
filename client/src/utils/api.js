export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(endpoint, options);
  } catch (error) {
    throw {
      message: 'Unable to connect to the backend server. Please verify the API is running and reachable.',
      originalError: error,
    };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: response.statusText || `Server responded with status ${response.status}` };
  }

  if (!response.ok) {
    throw { response: { status: response.status, data }, message: data?.message };
  }

  return { status: response.status, data };
};
