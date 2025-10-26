import { pgTable, serial, varchar, text, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========== DATABASE TABLES ==========

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  testimonial: text("testimonial").notNull(),
  profit: varchar("profit", { length: 100 }).notNull(),
  rating: integer("rating").notNull().default(5),
  date: varchar("date", { length: 20 }).notNull().default('2024-01-01'),
  photo: varchar("photo", { length: 500 }),
  profitImage: varchar("profit_image", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Video lessons table
export const videoLessons = pgTable("video_lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  videoUrl: varchar("video_url", { length: 500 }),
  youtubeId: varchar("youtube_id", { length: 100 }),
  locked: boolean("locked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: varchar("read_time", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Modules table
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Glossary terms table
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  term: varchar("term", { length: 255 }).notNull(),
  definition: text("definition").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Stats table (single record)
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  memberCount: integer("member_count").notNull(),
  tradesCalled: integer("trades_called").notNull(),
  avgProfit: integer("avg_profit").notNull(),
  winRate: integer("win_rate").notNull(),
  successRate: integer("success_rate").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Watchlist/stocks table
export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: real("price").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  logo: varchar("logo", { length: 500 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Visitor tracking table
export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  ipAddress: varchar("ip_address", { length: 100 }),
  userAgent: varchar("user_agent", { length: 500 }),
  referrer: varchar("referrer", { length: 500 }),
  landingPage: varchar("landing_page", { length: 500 }).notNull(),
  isTikTok: boolean("is_tiktok").default(false).notNull(),
  firstVisit: timestamp("first_visit").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  totalDuration: integer("total_duration").default(0).notNull(), // in seconds
  pageViews: integer("page_views").default(1).notNull(),
  convertedToTelegram: boolean("converted_to_telegram").default(false).notNull(),
});

// ========== INSERT SCHEMAS ==========

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export const insertVideoLessonSchema = createInsertSchema(videoLessons).omit({ id: true, createdAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true, createdAt: true });
export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).omit({ id: true, createdAt: true });
export const insertStatsSchema = createInsertSchema(stats).omit({ id: true, updatedAt: true });
export const insertStockSchema = createInsertSchema(stocks).omit({ id: true, updatedAt: true });
export const insertVisitorSchema = createInsertSchema(visitors).omit({ id: true, firstVisit: true, lastActivity: true });

// ========== TYPES ==========

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type VideoLesson = typeof videoLessons.$inferSelect;
export type InsertVideoLesson = z.infer<typeof insertVideoLessonSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;

export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
