import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { 
  Calendar, 
  Eye, 
  Flame, 
  Users, 
  UserPlus, 
  MessageCircle, 
  Tv, 
  Star,
  Heart,
  Search,
  Trophy,
  Bookmark,
  Home,
  Award,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { StatCard } from "@/components/annual-report/StatCard";
import { SectionHeader } from "@/components/annual-report/SectionHeader";
import { ActivityChart } from "@/components/annual-report/ActivityChart";
import { SearchKeywordCloud } from "@/components/annual-report/SearchKeywordCloud";
import { CoupleCard } from "@/components/annual-report/CoupleCard";
import { ProgressRing } from "@/components/annual-report/ProgressRing";
import { AnimatedCounter } from "@/components/annual-report/AnimatedCounter";
import { AuthGate } from "@/components/annual-report/AuthGate";

import heroIllustration from "@/assets/hero-illustration.png";
import activityIllustration from "@/assets/activity-illustration.png";
import socialIllustration from "@/assets/social-illustration.png";
import pointsIllustration from "@/assets/points-illustration.png";
import searchIllustration from "@/assets/search-illustration.png";

// Mock data based on the API response structure
const mockData = {
  year: 2024,
  user: {
    id: 1,
    username: "小明",
    avatar_url: null,
    registered_at: "2023-06-15T10:30:00",
    is_vip: true,
    vip_expire_at: "2025-06-15T10:30:00"
  },
  overview: {
    active_days: 186,
    total_access: 1247,
    most_active_month: 8,
    most_active_month_access: 203
  },
  activity: {
    monthly_trend: [
      { month: "2024-01", total_access: 89, active_days: 15 },
      { month: "2024-02", total_access: 102, active_days: 18 },
      { month: "2024-03", total_access: 95, active_days: 14 },
      { month: "2024-04", total_access: 78, active_days: 12 },
      { month: "2024-05", total_access: 112, active_days: 19 },
      { month: "2024-06", total_access: 134, active_days: 21 },
      { month: "2024-07", total_access: 156, active_days: 23 },
      { month: "2024-08", total_access: 203, active_days: 26 },
      { month: "2024-09", total_access: 98, active_days: 16 },
      { month: "2024-10", total_access: 87, active_days: 14 },
      { month: "2024-11", total_access: 93, active_days: 15 },
      { month: "2024-12", total_access: 0, active_days: 0 },
    ],
    check_ins: {
      total: 142,
      max_consecutive_days: 28,
      last_check_in: "2024-11-18"
    }
  },
  social: {
    following_count: 67,
    followers_count: 89,
    chat_sessions_count: 23,
    messages_count: 456
  },
  content: {
    rooms_created: 12,
    reviews_count: 34
  },
  watching: {
    favorites_count: 156,
    rooms_joined: 45
  },
  points: {
    total_points: 2680,
    available_points: 1850,
    used_points: 830,
    year_earned: 2150,
    year_used: 830,
    sources: [
      { type: "daily_check_in", points: 1420 },
      { type: "watching", points: 450 },
      { type: "social_interaction", points: 280 }
    ]
  },
  search: {
    total_searches: 328,
    top_keywords: [
      { keyword: "爱情电影", count: 45 },
      { keyword: "科幻片", count: 38 },
      { keyword: "动漫", count: 32 },
      { keyword: "喜剧", count: 28 },
      { keyword: "恐怖", count: 24 },
      { keyword: "悬疑剧", count: 22 },
      { keyword: "纪录片", count: 18 },
      { keyword: "音乐会", count: 15 }
    ],
    top_sources: [
      { source_url: "source1.com", count: 120 },
      { source_url: "source2.com", count: 89 }
    ],
    monthly_trend: [],
    most_active_month: 7,
    most_active_month_count: 52
  },
  couple: {
    has_couple: true,
    partner: {
      id: 2,
      username: "小红",
      avatar_url: null
    },
    anniversary_date: "2024-02-14",
    days_together: 278,
    created_at: "2024-02-14T20:00:00"
  }
};

const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const Index = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  if (!isAuthorized) {
    return (
      <AuthGate 
        onAuthorize={() => setIsAuthorized(true)}
        year={mockData.year}
        username={mockData.user.username}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen gradient-hero flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        {/* Floating decorations */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-primary/10"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[15%] w-12 h-12 rounded-full bg-secondary/10"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-[20%] w-20 h-20 rounded-full bg-accent/10"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl mx-auto"
        >
          {/* App Logo/Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-card">
              <Tv className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">一起看</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            {mockData.year}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-3xl text-muted-foreground mb-8"
          >
            年度观影报告
          </motion.p>

          {/* User Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-elevated">
              {mockData.user.username.charAt(0)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">{mockData.user.username}</span>
              {mockData.user.is_vip && (
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                  VIP
                </span>
              )}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative mx-auto max-w-2xl"
          >
            <img 
              src={heroIllustration} 
              alt="一起看 年度报告" 
              className="w-full rounded-2xl shadow-card"
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">向下滑动查看更多</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Overview Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <SectionHeader 
          title="年度概览" 
          subtitle="这一年，你在一起看的足迹"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={Calendar} 
            label="活跃天数" 
            value={mockData.overview.active_days}
            suffix=" 天"
            gradient="primary"
            delay={0}
          />
          <StatCard 
            icon={Eye} 
            label="总访问次数" 
            value={mockData.overview.total_access}
            suffix=" 次"
            gradient="secondary"
            delay={0.1}
          />
          <StatCard 
            icon={Flame} 
            label="最活跃月份访问" 
            value={mockData.overview.most_active_month_access}
            suffix=" 次"
            gradient="accent"
            delay={0.2}
          />
          <StatCard 
            icon={Award} 
            label="连续打卡纪录" 
            value={mockData.activity.check_ins.max_consecutive_days}
            suffix=" 天"
            gradient="success"
            delay={0.3}
          />
        </div>

        {/* Most Active Month Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-card rounded-2xl p-6 shadow-card text-center"
        >
          <p className="text-muted-foreground mb-2">你最活跃的月份是</p>
          <h3 className="text-4xl font-bold text-gradient-primary">
            {monthNames[mockData.overview.most_active_month - 1]}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            那个月你访问了 {mockData.overview.most_active_month_access} 次 🎉
          </p>
        </motion.div>
      </section>

      {/* Activity Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto bg-muted/30">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <SectionHeader 
              title="活跃度分析" 
              subtitle="坚持带来改变，每一次打卡都是成长"
            />
            <div className="grid grid-cols-3 gap-4">
              <ProgressRing 
                value={mockData.activity.check_ins.total}
                max={365}
                label="年度打卡"
                color="primary"
              />
              <ProgressRing 
                value={mockData.activity.check_ins.max_consecutive_days}
                max={30}
                label="最长连续"
                color="secondary"
              />
              <ProgressRing 
                value={mockData.overview.active_days}
                max={365}
                label="活跃天数"
                color="accent"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-64 flex-shrink-0"
          >
            <img 
              src={activityIllustration} 
              alt="Activity" 
              className="w-full max-w-[200px] mx-auto animate-float"
            />
          </motion.div>
        </div>

        <ActivityChart data={mockData.activity.monthly_trend} />
      </section>

      {/* Social Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <SectionHeader 
              title="社交互动" 
              subtitle="感谢陪伴，一起分享精彩"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-48 flex-shrink-0"
          >
            <img 
              src={socialIllustration} 
              alt="Social" 
              className="w-full max-w-[160px] mx-auto animate-float"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={UserPlus} 
            label="新关注" 
            value={mockData.social.following_count}
            suffix=" 人"
            gradient="primary"
            delay={0}
          />
          <StatCard 
            icon={Users} 
            label="新粉丝" 
            value={mockData.social.followers_count}
            suffix=" 人"
            gradient="secondary"
            delay={0.1}
          />
          <StatCard 
            icon={MessageCircle} 
            label="聊天会话" 
            value={mockData.social.chat_sessions_count}
            suffix=" 个"
            gradient="accent"
            delay={0.2}
          />
          <StatCard 
            icon={MessageCircle} 
            label="发送消息" 
            value={mockData.social.messages_count}
            suffix=" 条"
            gradient="success"
            delay={0.3}
          />
        </div>
      </section>

      {/* Content & Watching Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto bg-muted/30">
        <SectionHeader 
          title="内容与收藏" 
          subtitle="你创造和收藏的精彩内容"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={Home} 
            label="创建房间" 
            value={mockData.content.rooms_created}
            suffix=" 个"
            gradient="primary"
            delay={0}
          />
          <StatCard 
            icon={Star} 
            label="发布影评" 
            value={mockData.content.reviews_count}
            suffix=" 篇"
            gradient="secondary"
            delay={0.1}
          />
          <StatCard 
            icon={Bookmark} 
            label="收藏视频" 
            value={mockData.watching.favorites_count}
            suffix=" 个"
            gradient="accent"
            delay={0.2}
          />
          <StatCard 
            icon={Tv} 
            label="加入房间" 
            value={mockData.watching.rooms_joined}
            suffix=" 个"
            gradient="success"
            delay={0.3}
          />
        </div>
      </section>

      {/* Points Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <SectionHeader 
              title="积分收获" 
              subtitle="每一分都是你努力的见证"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-48 flex-shrink-0"
          >
            <img 
              src={pointsIllustration} 
              alt="Points" 
              className="w-full max-w-[160px] mx-auto animate-float"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">年度获得积分</p>
            <AnimatedCounter 
              value={mockData.points.year_earned}
              className="text-3xl font-bold text-foreground"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <Sparkles className="w-10 h-10 text-secondary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">可用积分</p>
            <AnimatedCounter 
              value={mockData.points.available_points}
              className="text-3xl font-bold text-foreground"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <Award className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">已使用积分</p>
            <AnimatedCounter 
              value={mockData.points.year_used}
              className="text-3xl font-bold text-foreground"
            />
          </motion.div>
        </div>

        {/* Points Sources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 bg-card rounded-2xl p-6 shadow-card"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">积分来源</h3>
          <div className="space-y-4">
            {mockData.points.sources.map((source, index) => {
              const percentage = (source.points / mockData.points.year_earned) * 100;
              const labels: Record<string, string> = {
                daily_check_in: "每日打卡",
                watching: "观影奖励",
                social_interaction: "社交互动"
              };
              return (
                <div key={source.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{labels[source.type] || source.type}</span>
                    <span className="text-muted-foreground">{source.points} 积分</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        index === 0 ? "gradient-primary" : 
                        index === 1 ? "gradient-secondary" : "gradient-accent"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto bg-muted/30">
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <SectionHeader 
              title="搜索印记" 
              subtitle="你的兴趣与偏好"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-48 flex-shrink-0"
          >
            <img 
              src={searchIllustration} 
              alt="Search" 
              className="w-full max-w-[160px] mx-auto animate-float"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <Search className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">年度搜索次数</p>
            <AnimatedCounter 
              value={mockData.search.total_searches}
              className="text-3xl font-bold text-foreground"
            />
          </motion.div>

          <SearchKeywordCloud keywords={mockData.search.top_keywords} />
        </div>
      </section>

      {/* Couple Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <SectionHeader 
          title="情侣空间" 
          subtitle="最浪漫的事就是和你一起看"
          align="center"
        />
        
        <div className="max-w-md mx-auto">
          <CoupleCard 
            couple={mockData.couple}
            userName={mockData.user.username}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 text-center gradient-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            感谢你的陪伴
          </h2>
          <p className="text-muted-foreground mb-6">
            {mockData.year + 1} 年，继续一起看更多精彩
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="gradient-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-elevated"
          >
            分享我的年度报告
          </motion.button>
        </motion.div>

        <p className="text-sm text-muted-foreground mt-12">
          © {mockData.year} 一起看 · 年度报告
        </p>
      </footer>
    </div>
  );
};

export default Index;
