export function getConnectedUser() {
  try {
    const raw = localStorage.getItem('connectedUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('connectedUser');
    return null;
  }
}

export function saveConnectedUser(user) {
  localStorage.setItem('connectedUser', JSON.stringify(user));
}

export function clearConnectedUser() {
  localStorage.removeItem('connectedUser');
}

export function getToken() {
  return localStorage.getItem('accessToken');
}

export function saveToken(token) {
  localStorage.setItem('accessToken', token);
}

/** Removes the token and the cached user. */
export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('connectedUser');
}