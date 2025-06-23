import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useAuth = () => {
  const [token, setToken] = useLocalStorage('token', null);
  const [role, setRole] = useLocalStorage('role', null);
  const [fullname, setFullname] = useLocalStorage('fullname', null);
  const [userId, setUserId] = useLocalStorage('user_id', null);

  const isAuthenticated = !!token;

  const login = (authData) => {
    setToken(authData.token);
    setRole(authData.user.role);
    setFullname(authData.user.full_name);
    setUserId(authData.user.user_id);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setFullname(null);
    setUserId(null);
  };

  return {
    token,
    role,
    fullname,
    userId,
    isAuthenticated,
    login,
    logout
  };
};