import pool from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

export async function findUserByProvider(provider, providerId) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE auth_provider = ? AND provider_id = ?",
    [provider, providerId],
  );
  return rows[0];
}

export async function createUser({ name, email, passwordHash, role = "customer" }) {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password_hash, auth_provider, role) VALUES (?, ?, ?, 'password', ?)",
    [name, email, passwordHash, role],
  );
  return { id: result.insertId, name, email, role };
}

export async function createProviderUser({ name, email, provider, providerId }) {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password_hash, auth_provider, provider_id) VALUES (?, ?, NULL, ?, ?)",
    [name, email, provider, providerId],
  );
  return { id: result.insertId, name, email, role: "customer", auth_provider: provider, provider_id: providerId };
}

export async function linkProviderToUser({ userId, provider, providerId }) {
  await pool.execute(
    "UPDATE users SET auth_provider = ?, provider_id = ? WHERE id = ?",
    [provider, providerId, userId],
  );
}

export async function findPasskeysByUserId(userId) {
  const [rows] = await pool.execute("SELECT * FROM user_passkeys WHERE user_id = ?", [userId]);
  return rows;
}

export async function findPasskeyByCredentialId(credentialId) {
  const [rows] = await pool.execute(
    `SELECT user_passkeys.*, users.name, users.email, users.role
     FROM user_passkeys
     JOIN users ON users.id = user_passkeys.user_id
     WHERE user_passkeys.credential_id = ?`,
    [credentialId],
  );
  return rows[0];
}

export async function createPasskey({ userId, credentialId, publicKey, counter, deviceName, transports }) {
  await pool.execute(
    `INSERT INTO user_passkeys
      (user_id, credential_id, public_key, counter, device_name, transports)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, credentialId, publicKey, counter, deviceName, JSON.stringify(transports || [])],
  );
}

export async function updatePasskeyCounter({ credentialId, counter }) {
  await pool.execute(
    "UPDATE user_passkeys SET counter = ? WHERE credential_id = ?",
    [counter, credentialId],
  );
}
