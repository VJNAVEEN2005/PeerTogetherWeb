// This is a utility file for generating bcrypt hashes
// It's useful for development and testing purposes
// In a production environment, this would be done on the server side

import bcrypt from 'bcryptjs';

/**
 * Generate a bcrypt hash from a plain text password
 * @param {string} password - The plain text password to hash
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} - The generated hash
 */
export const generateHash = async (password, saltRounds = 12) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    throw error;
  }
};

/**
 * Verify a password against a hash
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The hash to compare against
 * @returns {Promise<boolean>} - Whether the password matches the hash
 */
export const verifyHash = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying hash:', error);
    return false;
  }
};

// This function can be used in the browser console to generate a hash for testing
window.generateTestHash = async (password) => {
  const hash = await generateHash(password);
  console.log('Generated hash for testing:', hash);
  return hash;
};