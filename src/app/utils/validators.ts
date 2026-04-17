export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSignup(data: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = data;
  const errors: Record<string, string> = {};

  if (!name.trim()) errors.name = "Name is required";
  
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 chars";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateLogin(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 chars";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}