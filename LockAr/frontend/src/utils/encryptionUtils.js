import crypto from "crypto-browserify";
import { Buffer } from "buffer";
// Function to derive key from master password
export const deriveKey = (password, salt) => {
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  return key;
};

// Function to encrypt data
export const encryptPassword = (password, masterPassword) => {
  const salt = crypto.randomBytes(16).toString("hex"); // Generate random salt
  const key = deriveKey(masterPassword, salt); // Derive key
  //console.log(key, "dusring encrypt", key.length);
  const iv = crypto.randomBytes(16); // Generate IV
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedPassword: encrypted, iv: iv.toString("hex"), salt };
};

// Function to decrypt data
// export const decryptPassword = (encryptedData, masterPassword, iv, salt) => {
//   console.log(encryptedData,"hhhhh",Buffer.from(salt, 'hex'))
//   try {
//     const bufferSalt = Buffer.from(salt, 'hex');
//     console.log('Buffer Salt:', bufferSalt,bufferSalt.toString('hex'));
//   } catch (error) {
//     console.error('Error creating buffer:', error);
//   }

//   const key = deriveKey(masterPassword, Buffer.from(salt, 'hex')); // Derive key
//   console.log(key,"firsst")
//   const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
//   console.log(decipher,"seond")
//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//   console.log(decrypted,"3rd")
//   decrypted += decipher.final('utf8');
//   console.log(decrypted,"4th")
//   return decrypted;
// };

export const decryptPassword = (encryptedData, masterPassword, iv, salt) => {
  try {
    // console.log("Encrypted Data:", encryptedData);
    // console.log("Master Password:", masterPassword);
    // console.log("IV:", iv);
    // console.log("Salt:", salt);

    // Convert Salt and IV to Buffers
    const bufferSalt = Buffer.from(salt, "hex");
    const bufferIV = Buffer.from(iv, "hex");

    // console.log("Buffer Salt:", bufferSalt); // no use in encryption it is a string so pass it as it is
    // console.log("Buffer IV:", bufferIV);

    // Ensure Key and IV lengths are correct
    const key = deriveKey(masterPassword, salt);
    // console.log("Key Length:", key.length,key); // Should be 32
    // console.log("IV Length:", bufferIV.length); // Should be 16

    // Initialize Decipher
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, bufferIV);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    // console.log("Decrypted Data:", decrypted);

    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error.message);
    return null; // Handle error appropriately
  }
};
