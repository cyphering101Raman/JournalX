export function validateSignup(data: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return "All fields required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 chars";
  }

  return null;
}