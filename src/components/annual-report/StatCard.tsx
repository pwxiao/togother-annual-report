import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  gradient: "primary" | "secondary" | "accent" | "success";
  delay?: number;
}

const gradientClasses = {
  primary: "gradient-primary",
  secondary: "gradient-secondary",
  accent: "gradient-accent",
  success: "gradient-success",
};

export const StatCard = ({ icon: Icon, label, value, suffix = "", gradient, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl ${gradientClasses[gradient]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <AnimatedCounter 
        value={value} 
        suffix={suffix}
        className="text-3xl font-bold text-foreground"
      />
    </motion.div>
  );
};
