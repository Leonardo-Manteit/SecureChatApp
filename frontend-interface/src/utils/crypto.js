// encryption using web crypto

const enc = new TextEncoder();
const dec = new TextDecoder();

// greating a symmetric key for end-end 
export async function deriveKeyFromPassphrase(passphrase, salt) {
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// encrypt a message using AES-GCM
export async function encryptMessage(key, plaintext) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    enc.encode(plaintext)
  );

  return {
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(new Uint8Array(ciphertextBuffer)),
  };
}

// decrypt a message using AES-GCM
export async function decryptMessage(key, ivBase64, ciphertextBase64) {
  const iv = base64ToBuffer(ivBase64);
  const ciphertext = base64ToBuffer(ciphertextBase64);

  const plaintextBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext
  );

  return dec.decode(plaintextBuffer);
}

// Helpers
function bufferToBase64(buf) {
  return btoa(String.fromCharCode(...buf));
}
function base64ToBuffer(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}
