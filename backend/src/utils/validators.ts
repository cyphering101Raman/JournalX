/**
 * Validation utilities for incoming HTTP request payloads
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password || password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long." };
  }
  return { isValid: true };
};
