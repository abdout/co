// Direct database connection using Neon serverless
import { neon } from '@neondatabase/serverless';

// Connection URL from environment
const connectionString = process.env.DATABASE_URL as string;

// Create SQL executor
export const sql = neon(connectionString);

// Authentication helper functions using direct SQL 
// Using this as a fallback when Prisma fails

export async function getUserByEmailDirect(email: string) {
  if (!email) return null;
  
  try {
    const result = await sql`
      SELECT * FROM "User" WHERE email = ${email} LIMIT 1
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function getAccountByProviderDirect(provider: string, providerAccountId: string) {
  if (!provider || !providerAccountId) return null;
  
  try {
    const result = await sql`
      SELECT * FROM "Account" 
      WHERE provider = ${provider} AND "providerAccountId" = ${providerAccountId}
      LIMIT 1
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching account by provider:', error);
    return null;
  }
}

export async function getUserByIdDirect(id: string) {
  if (!id) return null;
  
  try {
    const result = await sql`
      SELECT * FROM "User" WHERE id = ${id} LIMIT 1
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function getAccountByUserIdDirect(userId: string) {
  if (!userId) return null;
  
  try {
    const result = await sql`
      SELECT * FROM "Account" WHERE "userId" = ${userId} LIMIT 1
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching account by user ID:', error);
    return null;
  }
}

export async function createUserDirect(userData: any) {
  try {
    const {
      id,
      email,
      username,
      emailVerified,
      image,
    } = userData;
    
    const result = await sql`
      INSERT INTO "User" (id, email, username, "emailVerified", image, role, "isTwoFactorEnabled")
      VALUES (${id}, ${email}, ${username}, ${emailVerified}, ${image}, 'USER', false)
      RETURNING *
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function createAccountDirect(accountData: any) {
  try {
    const {
      id,
      userId,
      type,
      provider,
      providerAccountId,
      refresh_token,
      access_token,
      expires_at,
      token_type,
      scope,
      id_token,
      session_state,
    } = accountData;
    
    const result = await sql`
      INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", 
                           refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
      VALUES (${id}, ${userId}, ${type}, ${provider}, ${providerAccountId}, 
              ${refresh_token}, ${access_token}, ${expires_at}, ${token_type}, ${scope}, ${id_token}, ${session_state})
      RETURNING *
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error creating account:', error);
    return null;
  }
}

// Check DB connection
export async function checkDbConnection() {
  try {
    const result = await sql`SELECT 1 as alive`;
    return { connected: true, result };
  } catch (error) {
    console.error('Database connection error:', error);
    return { connected: false, error: error instanceof Error ? error.message : String(error) };
  }
} 