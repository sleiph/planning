import { io } from 'socket.io-client';

// Connect to backend server (adjust URL if needed, defaults to window.location.hostname:4000 or http://localhost:4000)
const SERVER_URL = import.meta.env.PROD
  ? window.location.origin
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:4000'
      : window.location.origin.replace(/:\d+$/, ':4000'));

export const socket = io(SERVER_URL, {
  autoConnect: false,
});
