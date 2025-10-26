import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

// Session type extension
declare module "express-session" {
  interface SessionData {
    adminId?: number;
    username?: string;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized - Admin login required" });
  }
  next();
}

export async function createDefaultAdmin() {
  // Check if an admin already exists
  const existingAdmin = await storage.getAdminByUsername("admin");
  
  if (!existingAdmin) {
    console.log("Creating default admin user...");
    const hashedPassword = await hashPassword("admin123");
    await storage.createAdmin({
      username: "admin",
      passwordHash: hashedPassword,
    });
    console.log("✅ Default admin created:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!");
  }
}
