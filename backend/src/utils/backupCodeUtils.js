const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/**
 * Generates a set of 8-10 unique backup codes.
 * Each code is 8-10 characters long, containing uppercase letters and digits.
 */
const generateBackupCodes = () => {
  const numCodes = Math.floor(Math.random() * (10 - 8 + 1)) + 8; // 8 to 10 codes
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codes = new Set();

  while (codes.size < numCodes) {
    const length = Math.floor(Math.random() * (10 - 8 + 1)) + 8; // 8 to 10 chars
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.add(code);
  }

  return Array.from(codes);
};

/**
 * Hashes a backup code using bcrypt.
 */
const hashBackupCode = async (code) => {
  return await bcrypt.hash(code, 10);
};

module.exports = {
  generateBackupCodes,
  hashBackupCode,
};
