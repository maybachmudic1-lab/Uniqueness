import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  testimonials,
  videoLessons,
  blogPosts,
  modules,
  glossaryTerms,
  stats,
  stocks,
  visitors,
  adminUsers,
  type Testimonial,
  type VideoLesson,
  type BlogPost,
  type Module,
  type GlossaryTerm,
  type Stats,
  type Stock,
  type Visitor,
  type AdminUser,
  type InsertTestimonial,
  type InsertVideoLesson,
  type InsertBlogPost,
  type InsertModule,
  type InsertGlossaryTerm,
  type InsertStats,
  type InsertStock,
  type InsertVisitor,
  type InsertAdminUser,
} from "@shared/schema";

export interface IStorage {
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(data: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Video Lessons
  getVideoLessons(): Promise<VideoLesson[]>;
  getVideoLesson(id: number): Promise<VideoLesson | undefined>;
  createVideoLesson(data: InsertVideoLesson): Promise<VideoLesson>;
  updateVideoLesson(id: number, data: Partial<InsertVideoLesson>): Promise<VideoLesson | undefined>;
  deleteVideoLesson(id: number): Promise<boolean>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(data: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Modules
  getModules(): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(data: InsertModule): Promise<Module>;
  updateModule(id: number, data: Partial<InsertModule>): Promise<Module | undefined>;
  deleteModule(id: number): Promise<boolean>;

  // Glossary Terms
  getGlossaryTerms(): Promise<GlossaryTerm[]>;
  getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined>;
  createGlossaryTerm(data: InsertGlossaryTerm): Promise<GlossaryTerm>;
  updateGlossaryTerm(id: number, data: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm | undefined>;
  deleteGlossaryTerm(id: number): Promise<boolean>;

  // Stats
  getStats(): Promise<Stats>;
  updateStats(data: Partial<InsertStats>): Promise<Stats>;

  // Watchlist/Stocks
  getWatchlist(): Promise<Stock[]>;
  getStock(id: number): Promise<Stock | undefined>;
  createStock(data: InsertStock): Promise<Stock>;
  updateStock(id: number, data: Partial<InsertStock>): Promise<Stock | undefined>;
  deleteStock(id: number): Promise<boolean>;

  // Visitors
  getVisitors(): Promise<Visitor[]>;
  trackVisitor(data: InsertVisitor): Promise<Visitor>;
  updateVisitor(sessionId: string, data: Partial<InsertVisitor>): Promise<Visitor | undefined>;
  getVisitorStats(): Promise<{
    totalVisitors: number;
    tiktokVisitors: number;
    avgDuration: number;
    conversionRate: number;
  }>;

  // Admin Users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(data: InsertAdminUser): Promise<AdminUser>;
}

export class DatabaseStorage implements IStorage {
  // ========== TESTIMONIALS ==========
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.id);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [result] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return result;
  }

  async createTestimonial(data: InsertTestimonial): Promise<Testimonial> {
    const [result] = await db.insert(testimonials).values(data).returning();
    return result;
  }

  async updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [result] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    return result;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ========== VIDEO LESSONS ==========
  async getVideoLessons(): Promise<VideoLesson[]> {
    return await db.select().from(videoLessons).orderBy(videoLessons.id);
  }

  async getVideoLesson(id: number): Promise<VideoLesson | undefined> {
    const [result] = await db.select().from(videoLessons).where(eq(videoLessons.id, id));
    return result;
  }

  async createVideoLesson(data: InsertVideoLesson): Promise<VideoLesson> {
    const [result] = await db.insert(videoLessons).values(data).returning();
    return result;
  }

  async updateVideoLesson(id: number, data: Partial<InsertVideoLesson>): Promise<VideoLesson | undefined> {
    const [result] = await db.update(videoLessons).set(data).where(eq(videoLessons.id, id)).returning();
    return result;
  }

  async deleteVideoLesson(id: number): Promise<boolean> {
    const result = await db.delete(videoLessons).where(eq(videoLessons.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ========== BLOG POSTS ==========
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.id);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [result] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result;
  }

  async createBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(blogPosts).values(data).returning();
    return result;
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [result] = await db.update(blogPosts).set(data).where(eq(blogPosts.id, id)).returning();
    return result;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ========== MODULES ==========
  async getModules(): Promise<Module[]> {
    return await db.select().from(modules).orderBy(modules.id);
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [result] = await db.select().from(modules).where(eq(modules.id, id));
    return result;
  }

  async createModule(data: InsertModule): Promise<Module> {
    const [result] = await db.insert(modules).values(data).returning();
    return result;
  }

  async updateModule(id: number, data: Partial<InsertModule>): Promise<Module | undefined> {
    const [result] = await db.update(modules).set(data).where(eq(modules.id, id)).returning();
    return result;
  }

  async deleteModule(id: number): Promise<boolean> {
    const result = await db.delete(modules).where(eq(modules.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ========== GLOSSARY TERMS ==========
  async getGlossaryTerms(): Promise<GlossaryTerm[]> {
    return await db.select().from(glossaryTerms).orderBy(glossaryTerms.term);
  }

  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    const [result] = await db.select().from(glossaryTerms).where(eq(glossaryTerms.id, id));
    return result;
  }

  async createGlossaryTerm(data: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const [result] = await db.insert(glossaryTerms).values(data).returning();
    return result;
  }

  async updateGlossaryTerm(id: number, data: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm | undefined> {
    const [result] = await db.update(glossaryTerms).set(data).where(eq(glossaryTerms.id, id)).returning();
    return result;
  }

  async deleteGlossaryTerm(id: number): Promise<boolean> {
    const result = await db.delete(glossaryTerms).where(eq(glossaryTerms.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ========== STATS ==========
  async getStats(): Promise<Stats> {
    const [result] = await db.select().from(stats).limit(1);
    if (!result) {
      // Create default stats if none exist
      const [newStats] = await db.insert(stats).values({
        memberCount: 1547,
        tradesCalled: 2489,
        avgProfit: 789,
        winRate: 76,
        successRate: 89,
      }).returning();
      return newStats;
    }
    return result;
  }

  async updateStats(data: Partial<InsertStats>): Promise<Stats> {
    const existing = await this.getStats();
    const [result] = await db.update(stats).set({ ...data, updatedAt: new Date() }).where(eq(stats.id, existing.id)).returning();
    return result;
  }

  // ========== STOCKS/WATCHLIST ==========
  async getWatchlist(): Promise<Stock[]> {
    return await db.select().from(stocks).orderBy(stocks.symbol);
  }

  async getStock(id: number): Promise<Stock | undefined> {
    const [result] = await db.select().from(stocks).where(eq(stocks.id, id));
    return result;
  }

  async createStock(data: InsertStock): Promise<Stock> {
    const [result] = await db.insert(stocks).values(data).returning();
    return result;
  }

  async updateStock(id: number, data: Partial<InsertStock>): Promise<Stock | undefined> {
    const [result] = await db.update(stocks).set({ ...data, updatedAt: new Date() }).where(eq(stocks.id, id)).returning();
    return result;
  }

  async deleteStock(id: number): Promise<boolean> {
    const result = await db.delete(stocks).where(eq(stocks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ========== VISITORS ==========
  async getVisitors(): Promise<Visitor[]> {
    return await db.select().from(visitors).orderBy(visitors.firstVisit);
  }

  async trackVisitor(data: InsertVisitor): Promise<Visitor> {
    const [result] = await db.insert(visitors).values(data).returning();
    return result;
  }

  async updateVisitor(sessionId: string, data: Partial<InsertVisitor>): Promise<Visitor | undefined> {
    const [result] = await db.update(visitors).set({ ...data, lastActivity: new Date() }).where(eq(visitors.sessionId, sessionId)).returning();
    return result;
  }

  async getVisitorStats(): Promise<{ totalVisitors: number; tiktokVisitors: number; avgDuration: number; conversionRate: number }> {
    const allVisitors = await this.getVisitors();
    const totalVisitors = allVisitors.length;
    const tiktokVisitors = allVisitors.filter(v => v.isTikTok).length;
    const avgDuration = totalVisitors > 0 
      ? allVisitors.reduce((sum, v) => sum + v.totalDuration, 0) / totalVisitors
      : 0;
    const conversions = allVisitors.filter(v => v.convertedToTelegram).length;
    const conversionRate = totalVisitors > 0 ? (conversions / totalVisitors) * 100 : 0;

    return {
      totalVisitors,
      tiktokVisitors,
      avgDuration,
      conversionRate,
    };
  }

  // ========== ADMIN USERS ==========
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [result] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return result;
  }

  async createAdmin(data: InsertAdminUser): Promise<AdminUser> {
    const [result] = await db.insert(adminUsers).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
