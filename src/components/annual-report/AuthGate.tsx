import { motion, AnimatePresence } from "framer-motion";
import { Tv, Shield, Lock, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import heroIllustration from "@/assets/hero-illustration.png";

interface AuthGateProps {
  onAuthorize: () => void;
  year: number;
  username: string;
}

export const AuthGate = ({ onAuthorize, year, username }: AuthGateProps) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleEnter = () => {
    if (!isAgreed) return;
    setIsOpening(true);
    setTimeout(() => {
      onAuthorize();
    }, 800);
  };

  const permissions = [
    { icon: Shield, text: "访问你的年度观影数据" },
    { icon: Lock, text: "查看你的社交互动记录" },

  ];

  return (
    <AnimatePresence>
      {!isOpening && (
        <motion.div
          className="fixed inset-0 z-50 gradient-hero overflow-y-auto"
          exit={{ 
            clipPath: "circle(0% at 50% 50%)",
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          }}
        >
          {/* Floating decorations */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[8%] w-20 h-20 rounded-full bg-primary/10 blur-sm"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-28 right-[12%] w-16 h-16 rounded-full bg-secondary/15 blur-sm"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-24 left-[15%] w-24 h-24 rounded-full bg-accent/10 blur-sm"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 right-[18%] w-14 h-14 rounded-full bg-primary/8 blur-sm"
          />

          {/* Gate door effect - decorative lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          </div>

          {/* Content wrapper with flexbox for centering when content is small */}
          <div className="min-h-full flex flex-col items-center justify-center py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-md mx-auto px-6 text-center"
            >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
            
            </motion.div>

            {/* Year Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <span className="inline-block text-6xl md:text-7xl font-bold text-gradient-primary">
                {year}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-foreground mb-2"
            >
              年度观影报告
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-muted-foreground mb-8"
            >
              {username}，这一年你在Togother的精彩时刻
            </motion.p>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mb-8 relative"
            >
              <div className="w-48 h-48 mx-auto relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
                />
                <img 
                  src={heroIllustration} 
                  alt="年度报告" 
                  className="w-full h-full object-cover rounded-2xl shadow-card"
                />
              </div>
            </motion.div>

            {/* Authorization Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-elevated border border-border/50"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                为生成您的年度报告，我们需要获取以下信息：
              </h3>

              <ul className="space-y-3 mb-6">
                {permissions.map((perm, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <perm.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{perm.text}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Agreement Checkbox */}
              <motion.label
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="flex items-start gap-3 cursor-pointer mb-6 group"
              >
                <div 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5 ${
                    isAgreed 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground/40 group-hover:border-primary/60'
                  }`}
                  onClick={() => setIsAgreed(!isAgreed)}
                >
                  {isAgreed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                <span 
                  className="text-sm text-muted-foreground leading-relaxed"
                  onClick={() => setIsAgreed(!isAgreed)}
                >
                  我同意授权Togother访问我的数据以生成年度报告，并已阅读
                  <a href="#" className="text-primary hover:underline">《隐私政策》</a>
                </span>
              </motion.label>

              {/* Enter Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                whileHover={isAgreed ? { scale: 1.02 } : {}}
                whileTap={isAgreed ? { scale: 0.98 } : {}}
                onClick={handleEnter}
                disabled={!isAgreed}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isAgreed
                    ? 'gradient-primary text-primary-foreground shadow-glow cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isAgreed ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      开启我的年度报告
                    </>
                  ) : (
                    "请先同意授权"
                  )}
                </span>
              </motion.button>
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="text-xs text-muted-foreground/60 mt-6"
            >
              您的数据仅用于生成报告，我们承诺保护您的隐私安全
            </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Opening animation overlay */}
      {isOpening && (
        <motion.div
          initial={{ clipPath: "circle(100% at 50% 50%)" }}
          animate={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 gradient-hero flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gradient-primary"
          >
            欢迎回来
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
