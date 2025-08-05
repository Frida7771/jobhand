import bcrypt from 'bcryptjs';

/**
 * Hash a plaintext password using bcrypt
 * @param password - raw user password
 * @returns hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Compare raw password with hashed password
 * @param password - raw user input
 * @param hashedPassword - hashed password from DB
 * @returns true if matched, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
