import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { comparePassword, requireAdmin } from "./auth";
import {
  insertTestimonialSchema,
  insertVideoLessonSchema,
  insertBlogPostSchema,
  insertModuleSchema,
  insertGlossaryTermSchema,
  insertStatsSchema,
  insertStockSchema,
} from "@shared/schema";

// Configure multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Testimonials endpoint
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Modules endpoint
  app.get("/api/modules", async (_req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  // Glossary endpoint
  app.get("/api/glossary", async (_req, res) => {
    try {
      const terms = await storage.getGlossaryTerms();
      res.json(terms);
    } catch (error) {
      console.error("Error fetching glossary terms:", error);
      res.status(500).json({ error: "Failed to fetch glossary terms" });
    }
  });

  // Watchlist endpoint
  app.get("/api/watchlist", async (_req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      res.json(watchlist);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  // Video lessons endpoint
  app.get("/api/videos", async (_req, res) => {
    try {
      const videos = await storage.getVideoLessons();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching video lessons:", error);
      res.status(500).json({ error: "Failed to fetch video lessons" });
    }
  });

  // Blog posts endpoint
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // ========== AUTHENTICATION ==========
  
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, admin.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      req.session.username = admin.username;
      
      res.json({ success: true, username: admin.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // File upload endpoint
  app.post("/api/admin/upload", requireAdmin, upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, url: fileUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.get("/api/admin/check", (req, res) => {
    if (req.session.adminId) {
      res.json({ authenticated: true, username: req.session.username });
    } else {
      res.json({ authenticated: false });
    }
  });

  // ========== ADMIN CRUD - TESTIMONIALS ==========
  
  app.post("/api/admin/testimonials", requireAdmin, async (req, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.json(testimonial);
    } catch (error) {
      console.error("Create testimonial error:", error);
      res.status(400).json({ error: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, data);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Update testimonial error:", error);
      res.status(400).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTestimonial(id);
      if (!deleted) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete testimonial error:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // ========== ADMIN CRUD - VIDEO LESSONS ==========
  
  app.post("/api/admin/videos", requireAdmin, async (req, res) => {
    try {
      const data = insertVideoLessonSchema.parse(req.body);
      const video = await storage.createVideoLesson(data);
      res.json(video);
    } catch (error) {
      console.error("Create video error:", error);
      res.status(400).json({ error: "Failed to create video" });
    }
  });

  app.put("/api/admin/videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertVideoLessonSchema.partial().parse(req.body);
      const video = await storage.updateVideoLesson(id, data);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Update video error:", error);
      res.status(400).json({ error: "Failed to update video" });
    }
  });

  app.delete("/api/admin/videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVideoLesson(id);
      if (!deleted) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete video error:", error);
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // ========== ADMIN CRUD - BLOG POSTS ==========
  
  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(400).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, data);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(400).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ========== ADMIN - STATS UPDATE ==========
  
  app.put("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const data = insertStatsSchema.partial().parse(req.body);
      const stats = await storage.updateStats(data);
      res.json(stats);
    } catch (error) {
      console.error("Update stats error:", error);
      res.status(400).json({ error: "Failed to update stats" });
    }
  });

  // ========== ANALYTICS ==========
  
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getVisitorStats();
      const visitors = await storage.getVisitors();
      res.json({ stats, recentVisitors: visitors.slice(-50) });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
