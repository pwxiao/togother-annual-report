import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  suffix = "", 
  prefix = "",
  className = ""
}: AnimatedCounterProps) => {
  // 确保 value 是数字类型
  const numValue = typeof value === 'number' ? value : Number(value) || 0;
  
  // 初始值设置为传入的 value，这样即使值为0也能立即显示
  const [count, setCount] = useState(numValue);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // 当 value 变化时，立即更新 count
  useEffect(() => {
    setCount(numValue);
  }, [numValue]);

  useEffect(() => {
    if (!isInView) {
      // 如果不在视图中，直接设置为当前值（包括0）
      setCount(numValue);
      return;
    }

    // 如果值为0，直接设置为0，不需要动画
    if (numValue === 0) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // 确保最终值正确
        setCount(numValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [numValue, duration, isInView]);

  // 如果值为0或不在视图中，直接显示，不等待动画
  const shouldShowImmediately = numValue === 0 || !isInView;

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={shouldShowImmediately ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={isInView || shouldShowImmediately ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};
