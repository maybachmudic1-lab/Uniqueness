import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut, Plus, Edit, Trash2, TrendingUp, Users } from "lucide-react";
import type { Testimonial, VideoLesson, Stats } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("testimonials");
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    testimonial: '',
    profit: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    photo: '',
    profitImage: ''
  });
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: 'Beginner',
    thumbnail: '',
    videoUrl: '',
    youtubeId: '',
    locked: false
  });

  // Check if admin is authenticated
  const { data: authCheck } = useQuery<{ authenticated: boolean; username?: string }>({
    queryKey: ["/api/admin/check"],
  });

  useEffect(() => {
    if (authCheck && !authCheck.authenticated) {
      setLocation("/admin/login");
    }
  }, [authCheck, setLocation]);

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: videos } = useQuery<VideoLesson[]>({
    queryKey: ["/api/videos"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: analytics } = useQuery<{
    stats: { totalVisitors: number; tiktokVisitors: number; avgDuration: number; conversionRate: number };
    recentVisitors: Array<{
      id: number;
      landingPage: string;
      firstVisit: string;
      isTikTok: boolean;
      totalDuration: number;
      pageViews: number;
    }>;
  }>({
    queryKey: ["/api/admin/analytics"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      toast({
        title: "Logged out successfully",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        variant: "destructive",
      });
    }
  };

  const createTestimonialMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial created successfully" });
      setShowAddTestimonial(false);
      setTestimonialFormData({ name: '', testimonial: '', profit: '', rating: 5, date: new Date().toISOString().split('T')[0], photo: '', profitImage: '' });
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: "Video created successfully" });
      setShowAddVideo(false);
      setVideoFormData({ title: '', description: '', duration: '', category: 'Beginner', thumbnail: '', videoUrl: '', youtubeId: '', locked: false });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted" });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: "Video deleted" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'profitImage' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (field === 'thumbnail') {
        setVideoFormData(prev => ({ ...prev, [field]: data.url }));
      } else {
        setTestimonialFormData(prev => ({ ...prev, [field]: data.url }));
      }
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Image upload failed", variant: "destructive" });
    }
  };

  if (!authCheck?.authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {authCheck.username}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-visitors">
                {analytics?.stats?.totalVisitors || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TikTok Visitors</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-tiktok-visitors">
                {analytics?.stats?.tiktokVisitors || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-avg-duration">
                {Math.round(analytics?.stats?.avgDuration || 0)}s
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-conversion-rate">
                {(analytics?.stats?.conversionRate || 0).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="videos" data-testid="tab-videos">
              Videos
            </TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">
              Stats
            </TabsTrigger>
            <TabsTrigger value="visitors" data-testid="tab-visitors">
              Visitors
            </TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Testimonials</h2>
              <Button data-testid="button-add-testimonial" onClick={() => setShowAddTestimonial(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            <div className="grid gap-4">
              {testimonials?.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle>{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.profit}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          data-testid={`button-edit-testimonial-${testimonial.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                          data-testid={`button-delete-testimonial-${testimonial.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{testimonial.testimonial}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Videos</h2>
              <Button data-testid="button-add-video" onClick={() => setShowAddVideo(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>

            <div className="grid gap-4">
              {videos?.map((video) => (
                <Card key={video.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle>{video.title}</CardTitle>
                        <CardDescription>
                          {video.duration} • {video.category}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          data-testid={`button-edit-video-${video.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteVideoMutation.mutate(video.id)}
                          data-testid={`button-delete-video-${video.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <h2 className="text-2xl font-bold">Update Site Stats</h2>
            <StatsEditor stats={stats} />
          </TabsContent>

          {/* Visitors Tab */}
          <TabsContent value="visitors" className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Visitors</h2>
            <div className="space-y-2">
              {analytics?.recentVisitors?.map((visitor: any) => (
                <Card key={visitor.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{visitor.landingPage}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(visitor.firstVisit).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {visitor.isTikTok && <span className="text-primary">TikTok</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {visitor.totalDuration}s • {visitor.pageViews} pages
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Testimonial Dialog */}
        <Dialog open={showAddTestimonial} onOpenChange={setShowAddTestimonial}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={testimonialFormData.name}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                  placeholder="e.g., Sarah M."
                  data-testid="input-testimonial-name"
                />
              </div>
              <div>
                <Label htmlFor="profit">Profit (e.g., $5,000)</Label>
                <Input
                  id="profit"
                  value={testimonialFormData.profit}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, profit: e.target.value })}
                  placeholder="$5,000"
                  data-testid="input-testimonial-profit"
                />
              </div>
              <div>
                <Label htmlFor="testimonial">Testimonial</Label>
                <Textarea
                  id="testimonial"
                  value={testimonialFormData.testimonial}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, testimonial: e.target.value })}
                  placeholder="Enter the testimonial text..."
                  rows={4}
                  data-testid="input-testimonial-text"
                />
              </div>
              <div>
                <Label htmlFor="photo">Profile Photo (Optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'photo')}
                  data-testid="input-testimonial-photo"
                />
                {testimonialFormData.photo && <p className="text-sm text-green-600 mt-1">✓ Image uploaded!</p>}
              </div>
              <div>
                <Label htmlFor="profitImage">Profit Screenshot (Optional)</Label>
                <Input
                  id="profitImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profitImage')}
                  data-testid="input-testimonial-profit-image"
                />
                {testimonialFormData.profitImage && <p className="text-sm text-green-600 mt-1">✓ Image uploaded!</p>}
              </div>
              <Button
                onClick={() => createTestimonialMutation.mutate(testimonialFormData)}
                disabled={!testimonialFormData.name || !testimonialFormData.testimonial || !testimonialFormData.profit || createTestimonialMutation.isPending}
                className="w-full"
                data-testid="button-submit-testimonial"
              >
                {createTestimonialMutation.isPending ? "Creating..." : "Create Testimonial"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Video Dialog */}
        <Dialog open={showAddVideo} onOpenChange={setShowAddVideo}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="Options Trading Fundamentals"
                  data-testid="input-video-title"
                />
              </div>
              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                  placeholder="Learn the basics of options trading..."
                  rows={3}
                  data-testid="input-video-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video-duration">Duration</Label>
                  <Input
                    id="video-duration"
                    value={videoFormData.duration}
                    onChange={(e) => setVideoFormData({ ...videoFormData, duration: e.target.value })}
                    placeholder="45:23"
                    data-testid="input-video-duration"
                  />
                </div>
                <div>
                  <Label htmlFor="video-category">Category</Label>
                  <Input
                    id="video-category"
                    value={videoFormData.category}
                    onChange={(e) => setVideoFormData({ ...videoFormData, category: e.target.value })}
                    placeholder="Beginner"
                    data-testid="input-video-category"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="youtube-id">YouTube Video ID (Optional)</Label>
                <Input
                  id="youtube-id"
                  value={videoFormData.youtubeId}
                  onChange={(e) => setVideoFormData({ ...videoFormData, youtubeId: e.target.value })}
                  placeholder="dQw4w9WgXcQ"
                  data-testid="input-video-youtube-id"
                />
              </div>
              <div>
                <Label htmlFor="video-thumbnail">Thumbnail (Optional)</Label>
                <Input
                  id="video-thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'thumbnail')}
                  data-testid="input-video-thumbnail"
                />
                {videoFormData.thumbnail && <p className="text-sm text-green-600 mt-1">✓ Thumbnail uploaded!</p>}
              </div>
              <Button
                onClick={() => createVideoMutation.mutate(videoFormData)}
                disabled={!videoFormData.title || !videoFormData.description || createVideoMutation.isPending}
                className="w-full"
                data-testid="button-submit-video"
              >
                {createVideoMutation.isPending ? "Creating..." : "Create Video"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function StatsEditor({ stats }: { stats?: Stats }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    memberCount: stats?.memberCount || 0,
    tradesCalled: stats?.tradesCalled || 0,
    avgProfit: stats?.avgProfit || 0,
    winRate: stats?.winRate || 0,
    successRate: stats?.successRate || 0,
  });

  useEffect(() => {
    if (stats) {
      setFormData({
        memberCount: stats.memberCount,
        tradesCalled: stats.tradesCalled,
        avgProfit: stats.avgProfit,
        winRate: stats.winRate,
        successRate: stats.successRate,
      });
    }
  }, [stats]);

  const updateStatsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("PUT", "/api/admin/stats", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Stats updated successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatsMutation.mutate(formData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberCount">Member Count</Label>
              <Input
                id="memberCount"
                type="number"
                value={formData.memberCount}
                onChange={(e) =>
                  setFormData({ ...formData, memberCount: parseInt(e.target.value) })
                }
                data-testid="input-member-count"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradesCalled">Trades Called</Label>
              <Input
                id="tradesCalled"
                type="number"
                value={formData.tradesCalled}
                onChange={(e) =>
                  setFormData({ ...formData, tradesCalled: parseInt(e.target.value) })
                }
                data-testid="input-trades-called"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgProfit">Average Profit ($)</Label>
              <Input
                id="avgProfit"
                type="number"
                value={formData.avgProfit}
                onChange={(e) =>
                  setFormData({ ...formData, avgProfit: parseInt(e.target.value) })
                }
                data-testid="input-avg-profit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winRate">Win Rate (%)</Label>
              <Input
                id="winRate"
                type="number"
                value={formData.winRate}
                onChange={(e) =>
                  setFormData({ ...formData, winRate: parseInt(e.target.value) })
                }
                data-testid="input-win-rate"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateStatsMutation.isPending}
            data-testid="button-save-stats"
          >
            {updateStatsMutation.isPending ? "Saving..." : "Save Stats"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
