import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronDown,
  Loader2,
  AlertCircle
} from "lucide-react";
import { StatCard } from "@/components/annual-report/StatCard";
import { SectionHeader } from "@/components/annual-report/SectionHeader";
import { ActivityChart } from "@/components/annual-report/ActivityChart";
import { SearchKeywordCloud } from "@/components/annual-report/SearchKeywordCloud";
import { CoupleCard } from "@/components/annual-report/CoupleCard";
import { ProgressRing } from "@/components/annual-report/ProgressRing";
import { AnimatedCounter } from "@/components/annual-report/AnimatedCounter";
import { AuthGate } from "@/components/annual-report/AuthGate";
import { checkToken, setupTokenListeners, pollForToken, TokenSource } from "@/lib/token";
import { fetchAnnualReport, AnnualReportData, getMockData } from "@/lib/api";
import {
  getActiveMonthEvaluation,
  getActiveDaysEvaluation,
  getConsecutiveCheckInEvaluation,
  getTotalAccessEvaluation,
  getSocialEvaluation,
  getContentEvaluation,
  getWatchingEvaluation,
  getPointsEvaluation,
  getSearchEvaluation,
  getCoupleEvaluation
} from "@/lib/evaluations";

import heroIllustration from "@/assets/hero-illustration.png";
import socialIllustration from "@/assets/social-illustration.png";
import pointsIllustration from "@/assets/points-illustration.png";
import searchIllustration from "@/assets/search-illustration.png";

const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const Index = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<AnnualReportData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenSource, setTokenSource] = useState<TokenSource>(null);
  const cleanupRef = useRef<(() => void)[]>([]);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  // 获取年度报告数据
  const fetchReportData = useCallback(async (tokenValue: string) => {
    if (!tokenValue) {
      setError("未检测到登录信息");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAnnualReport(tokenValue);
      setReportData(data);
      // 不自动授权，等待用户点击授权门控
    } catch (e) {
      console.error('API Error', e);
      const errorMessage = e instanceof Error ? e.message : "无法连接到服务器";
      setError(errorMessage);
      
      // 开发环境下使用 mock 数据作为降级方案
      if (import.meta.env.DEV) {
        console.warn('使用 mock 数据作为降级方案');
        setReportData(getMockData());
        setError(null);
        // 不自动授权，等待用户点击授权门控
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 处理 token 获取
  const handleTokenReceived = useCallback((tokenValue: string, source: TokenSource) => {
    setToken(tokenValue);
    setTokenSource(source);
    fetchReportData(tokenValue);
  }, [fetchReportData]);

  useEffect(() => {
    // 清理函数
    const cleanup = () => {
      cleanupRef.current.forEach(fn => fn());
      cleanupRef.current = [];
    };

    // 设置 token 监听器
    const removeListeners = setupTokenListeners(handleTokenReceived);
    cleanupRef.current.push(removeListeners);

    // 立即检查 token
    const tokenInfo = checkToken();
    if (tokenInfo.token) {
      handleTokenReceived(tokenInfo.token, tokenInfo.source);
    } else {
      // 轮询获取 token
      const removePolling = pollForToken(handleTokenReceived, 10, 500);
      cleanupRef.current.push(removePolling);
      
      // 如果轮询失败，设置错误状态
      const timeoutId = setTimeout(() => {
        setIsLoading(prev => {
          if (prev && !token) {
            setError("请在 App 内打开");
            return false;
          }
          return prev;
        });
      }, 5000);
      
      cleanupRef.current.push(() => clearTimeout(timeoutId));
    }

    return cleanup;
  }, [handleTokenReceived]);

  // 加载状态
  if (isLoading && !reportData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载年度报告中...</p>
        </div>
      </div>
    );
  }

  // 错误状态（且没有降级数据）
  if (error && !reportData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">加载失败</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          
          
          <button
            onClick={() => {
              const tokenInfo = checkToken();
              if (tokenInfo.token) {
                fetchReportData(tokenInfo.token);
              } else if (import.meta.env.DEV) {
                console.log('当前没有 token，请在控制台使用 window.setAppToken() 设置');
              }
            }}
            className="gradient-primary text-primary-foreground px-6 py-2 rounded-full font-semibold"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 授权门控：如果有数据但未授权，显示授权门控
  if (reportData && !isAuthorized) {
    return (
      <AuthGate 
        onAuthorize={() => setIsAuthorized(true)}
        year={reportData.year}
        username={reportData.user.username}
      />
    );
  }

  // 如果没有数据且没有错误，可能是还在加载或等待 token
  if (!reportData && !error) {
    return null;
  }

  // 如果没有数据但有错误，显示错误（已在上面处理）
  if (!reportData) {
    return null;
  }

  // 开发环境下输出调试信息
  if (import.meta.env.DEV) {
    console.log('页面渲染时的 social 数据:', reportData.social);
    console.log('following_count:', reportData.social.following_count, typeof reportData.social.following_count);
    console.log('chat_sessions_count:', reportData.social.chat_sessions_count, typeof reportData.social.chat_sessions_count);
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
  
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            {reportData.year}
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
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-elevated border-4 border-primary/20 relative bg-gradient-to-br from-primary to-secondary">
              {reportData.user.avatar_url && reportData.user.avatar_url.trim() ? (
                <img 
                  src={reportData.user.avatar_url} 
                  alt={reportData.user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 如果图片加载失败，隐藏图片，显示首字母
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="avatar-fallback absolute inset-0 gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold"
                style={{ display: (!reportData.user.avatar_url || !reportData.user.avatar_url.trim()) ? 'flex' : 'none' }}
              >
                {reportData.user.username.charAt(0)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">{reportData.user.username}</span>
              {reportData.user.is_vip && (
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
              alt="Togother 年度报告" 
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
          subtitle="这一年，你在Togother的足迹"
        />
        
        {reportData.overview.total_access > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-sm text-muted-foreground text-center"
          >
            {getTotalAccessEvaluation(reportData.overview.total_access)}
          </motion.div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={Calendar} 
            label="活跃天数" 
            value={reportData.overview.active_days}
            suffix=" 天"
            gradient="primary"
            delay={0}
          />
          <StatCard 
            icon={Eye} 
            label="总访问次数" 
            value={reportData.overview.total_access}
            suffix=" 次"
            gradient="secondary"
            delay={0.1}
          />
          <StatCard 
            icon={Flame} 
            label="最活跃月份访问" 
            value={reportData.overview.most_active_month_access}
            suffix=" 次"
            gradient="accent"
            delay={0.2}
          />
          <StatCard 
            icon={Award} 
            label="连续打卡纪录" 
            value={reportData.activity.check_ins.max_consecutive_days}
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
            {reportData.overview.most_active_month ? monthNames[reportData.overview.most_active_month - 1] : "暂无数据"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {reportData.overview.most_active_month ? `那个月你访问了 ${reportData.overview.most_active_month_access} 次 🎉` : "暂无数据"}
          </p>
          {reportData.overview.most_active_month && (
            <p className="text-sm text-primary mt-3 font-medium">
              {getActiveMonthEvaluation(reportData.overview.most_active_month)}
            </p>
          )}
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
            {reportData.activity.check_ins.max_consecutive_days > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-4 text-sm text-muted-foreground"
              >
                {getConsecutiveCheckInEvaluation(reportData.activity.check_ins.max_consecutive_days)}
              </motion.div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <ProgressRing 
                value={reportData.activity.check_ins.total}
                max={365}
                label="年度打卡"
                color="primary"
              />
              <ProgressRing 
                value={reportData.activity.check_ins.max_consecutive_days}
                max={30}
                label="最长连续"
                color="secondary"
              />
              <ProgressRing 
                value={reportData.overview.active_days}
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
         
          </motion.div>
        </div>

        <ActivityChart data={reportData.activity.monthly_trend} />
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
            {(() => {
              const socialTotal = reportData.social.following_count + reportData.social.followers_count + 
                                 reportData.social.chat_sessions_count + reportData.social.messages_count;
              return socialTotal > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 text-sm text-muted-foreground"
                >
                  {getSocialEvaluation(reportData.social)}
                </motion.div>
              ) : null;
            })()}
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
            value={reportData.social.following_count}
            suffix=" 人"
            gradient="primary"
            delay={0}
          />
          <StatCard 
            icon={Users} 
            label="新粉丝" 
            value={reportData.social.followers_count}
            suffix=" 人"
            gradient="secondary"
            delay={0.1}
          />
          <StatCard 
            icon={MessageCircle} 
            label="聊天会话" 
            value={reportData.social.chat_sessions_count}
            suffix=" 个"
            gradient="accent"
            delay={0.2}
          />
          <StatCard 
            icon={MessageCircle} 
            label="发送消息" 
            value={reportData.social.messages_count}
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
        {(() => {
          const contentTotal = reportData.content.rooms_created + reportData.content.reviews_count;
          return contentTotal > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-6 text-sm text-muted-foreground text-center"
            >
              {getContentEvaluation(reportData.content)}
            </motion.div>
          ) : null;
        })()}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={Home} 
            label="创建房间" 
            value={reportData.content.rooms_created}
            suffix=" 个"
            gradient="primary"
            delay={0}
          />
          <StatCard 
            icon={Star} 
            label="发布影评" 
            value={reportData.content.reviews_count}
            suffix=" 篇"
            gradient="secondary"
            delay={0.1}
          />
          <StatCard 
            icon={Bookmark} 
            label="收藏视频" 
            value={reportData.watching.favorites_count}
            suffix=" 个"
            gradient="accent"
            delay={0.2}
          />
          <StatCard 
            icon={Tv} 
            label="加入房间" 
            value={reportData.watching.rooms_joined}
            suffix=" 个"
            gradient="success"
            delay={0.3}
          />
        </div>
        
        {(() => {
          const watchingTotal = reportData.watching.favorites_count + reportData.watching.rooms_joined;
          return watchingTotal > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mt-6 text-sm text-muted-foreground text-center"
            >
              {getWatchingEvaluation(reportData.watching)}
            </motion.div>
          ) : null;
        })()}
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
            {reportData.points.year_earned > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                {getPointsEvaluation(reportData.points.year_earned)}
              </motion.div>
            )}
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
              value={reportData.points.year_earned}
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
              value={reportData.points.available_points}
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
              value={reportData.points.year_used}
              className="text-3xl font-bold text-foreground"
            />
          </motion.div>
        </div>
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
            {reportData.search.total_searches > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                {getSearchEvaluation(reportData.search.total_searches)}
              </motion.div>
            )}
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
              value={reportData.search.total_searches}
              className="text-3xl font-bold text-foreground"
            />
          </motion.div>

          <SearchKeywordCloud keywords={reportData.search.top_keywords} />
        </div>
      </section>

      {/* Couple Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <SectionHeader 
          title="最浪漫的事就是和Ta一起看啦～" 
          subtitle=""
          align="center"
        />
        
        {reportData.couple.has_couple && reportData.couple.days_together > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-sm text-muted-foreground text-center"
          >
            {getCoupleEvaluation(reportData.couple.days_together)}
          </motion.div>
        )}
        
        <div className="max-w-md mx-auto">
          <CoupleCard 
            couple={reportData.couple}
            userName={reportData.user.username}
            userAvatar={reportData.user.avatar_url || undefined}
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
            {reportData.year + 1} 年，继续Togother更多精彩
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
          © {reportData.year} Togother · 年度报告
        </p>
      </footer>
    </div>
  );
};

export default Index;
