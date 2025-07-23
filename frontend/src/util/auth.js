export const API_BASE = "http://127.0.0.1:8000";

// Token Accessors
export const getAccessToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

// Set tokens after login
export const setTokens = ({ access_token, refresh_token }) => {
  localStorage.setItem("token", access_token);
  if (refresh_token) {
    localStorage.setItem("refresh_token", refresh_token);
  }
};

// Remove tokens and redirect to login
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

// Auth Header generator
export const authHeader = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auto-refreshable fetch wrapper
export const authFetch = async (url, options = {}) => {
  const accessToken = getAccessToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // If token is expired or invalid
  if (response.status === 401 && getRefreshToken()) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: getRefreshToken() }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("token", data.access_token);

      // Retry original request with new access token
      headers.Authorization = `Bearer ${data.access_token}`;
      response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
      });
    } else {
      logout(); // If refresh failed
      return null;
    }
  }

  return response;
};

// Get user info from /users/me
// export const getUserProfile = async () => {
//   const res = await authFetch("/users/me");
//   if (!res || !res.ok) return null;
//   return await res.json();
// };

export const getUserProfile = async () => {
  const res = await authFetch("/users/me");
  if (!res || !res.ok) {
    console.error("Response not OK:", res.status, await res.text());
    return null;
  }

  try {
    const json = await res.json();
    if (!json) throw new Error("Empty profile JSON");
    return json;
  } catch (err) {
    console.error("Failed to parse profile JSON:", err);
    return null;
  }
};

export const fetchStacks = async () => {
  const res = await fetch(`${API_BASE}/api/workflow`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await res.json();
};


export const createStack = async (stackData) => {
  // ... similar implementation
};
