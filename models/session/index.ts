import crypto from "crypto";
import { type RedisStore } from "../store";

async function getSession(
  sessionId: string,
  kv: RedisStore
): Promise<Session | null> {
  if (!sessionId) {
    return null;
  }
  const sessionData = await kv.get(sessionId);
  if (!sessionData) {
    return null;
  }
  const jsonSessionData = JSON.parse(sessionData) as EncryptedSession;
  const decryptedSession = decryptSession(jsonSessionData.data);
  return {
    ...jsonSessionData,
    data: decryptedSession,
  };
}

async function deleteSession(
  sessionId: string,
  kv: RedisStore
): Promise<number | null> {
  if (!sessionId) {
    return null;
  }
  return await kv.del(sessionId);
}

async function updateSession(
  sessionId: string,
  data: Partial<SessionData>,
  kv: RedisStore
): Promise<string | null> {
  if (!data) {
    return null;
  }
  let session = await getSession(sessionId, kv);
  if (!session) {
    session = await createSession(sessionId, kv);
  }
  const updatedSession = {
    ...session,
    data: {
      ...session.data,
      ...data,
    },
  };
  const encryptedData = encryptSession(updatedSession.data);
  return await kv.setEx(
    session.id,
    60 * 60 * 24 * 7, // 1 week
    JSON.stringify({
      id: session.id,
      created: session.created,
      data: encryptedData,
    })
  );
}

export { getSession, deleteSession, updateSession };

async function createSession(
  sessionId: string,
  kv: RedisStore
): Promise<Session> {
  const session = {
    id: sessionId,
    created: Date.now(),
  };
  await kv.setEx(sessionId, 60 * 60 * 24 * 7, JSON.stringify(session));
  return session;
}

function encryptSession(data: Partial<SessionData>): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY is not set");
  }
  const stringData = JSON.stringify(data);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(stringData, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  encrypted = [iv.toString("hex"), encrypted, authTag.toString("hex")].join(
    ":"
  );
  return encrypted;
}

function decryptSession(encrypted: string): Session["data"] | undefined {
  const [iv, cipherText, authTag] = encrypted.split(":");
  if (!iv || !cipherText || !authTag) {
    throw new Error("Invalid encrypted session data");
  }

  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY is not set");
  }

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(encryptionKey),
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(cipherText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return;
  }
}

interface Session {
  id: string;
  created: number;
  data?: SessionData;
}

interface SessionData {
  spotifyAccessToken: string;
  spotifyRefreshToken: string;
  spotifyExpiresIn: number;
  spotifyValidUntil: number;
  spotifyScope: string;
}

interface EncryptedSession {
  id: string;
  created: number;
  data: string;
}
