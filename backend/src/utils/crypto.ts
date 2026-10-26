import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_KEY;
  if (!hexKey || hexKey.length !== 64) {
    throw new Error(
      "Invalid or missing ENCRYPTION_KEY in environment variables. Must be a 64-character (32-byte) hex string."
    );
  }
  return Buffer.from(hexKey, "hex");
}

/**
 * Encrypt plain text using AES-256-GCM.
 * Output format: iv:authTag:ciphertext (all hex encoded)
 */
export function encryptText(plainText: string): string {
  if (!plainText) return "";

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt ciphertext payload (format: iv:authTag:ciphertext).
 * If the payload is unencrypted/legacy plain text, it returns the text as is.
 */
export function decryptText(payload: string): string {
  if (!payload) return "";

  const parts = payload.split(":");
  // If not formatted as iv:authTag:ciphertext (3 parts, with expected IV and tag lengths),
  // treat it as legacy unencrypted text.
  if (parts.length !== 3 || parts[0].length !== 24 || parts[1].length !== 32) {
    return payload;
  }

  const [ivHex, authTagHex, cipherHex] = parts;

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt text payload:", error);
    return payload;
  }
}
