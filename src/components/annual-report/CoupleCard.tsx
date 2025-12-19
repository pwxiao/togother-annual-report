import { motion } from "framer-motion";
import { Heart, Calendar } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface CoupleInfo {
  has_couple: boolean;
  partner: {
    id: number;
    username: string;
    avatar_url: string | null;
  } | null;
  anniversary_date: string | null;
  days_together: number;
}

interface CoupleCardProps {
  couple: CoupleInfo;
  userAvatar?: string;
  userName?: string;
}

export const CoupleCard = ({ couple, userAvatar, userName }: CoupleCardProps) => {
  if (!couple.has_couple) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-2xl p-8 shadow-card text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">期待邂逅</h3>
        <p className="text-muted-foreground">新的一年，愿你遇见那个对的人 💕</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-2xl p-8 shadow-card"
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 dark:text-pink-800"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-card overflow-hidden border-4 border-pink-200 shadow-lg">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {userName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </motion.div>
          
          <div className="w-20 h-20 rounded-full bg-card overflow-hidden border-4 border-pink-200 shadow-lg">
            {couple.partner?.avatar_url ? (
              <img src={couple.partner.avatar_url} alt={couple.partner.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center text-secondary-foreground text-2xl font-bold">
                {couple.partner?.username?.charAt(0) || "P"}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            {userName} & {couple.partner?.username}
          </p>
          <div className="flex items-center justify-center gap-2 text-pink-600 dark:text-pink-400 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {couple.anniversary_date ? new Date(couple.anniversary_date).toLocaleDateString('zh-CN') : "相遇"}
            </span>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 inline-block">
            <p className="text-sm text-muted-foreground mb-1">在一起</p>
            <div className="flex items-baseline justify-center gap-1">
              <AnimatedCounter 
                value={couple.days_together} 
                className="text-4xl font-bold text-pink-500"
              />
              <span className="text-lg text-pink-500">天</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
