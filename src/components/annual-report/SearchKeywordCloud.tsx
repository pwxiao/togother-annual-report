import { motion } from "framer-motion";

interface Keyword {
  keyword: string;
  count: number;
}

interface SearchKeywordCloudProps {
  keywords: Keyword[];
}

export const SearchKeywordCloud = ({ keywords }: SearchKeywordCloudProps) => {
  const maxCount = Math.max(...keywords.map(k => k.count), 1);
  
  const getSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "text-xl font-bold";
    if (ratio > 0.4) return "text-lg font-semibold";
    return "text-base font-medium";
  };

  const colors = [
    "text-primary",
    "text-secondary",
    "text-accent",
    "text-foreground",
    "text-muted-foreground",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">热门搜索词</h3>
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[120px]">
        {keywords.map((item, index) => (
          <motion.span
            key={item.keyword}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            className={`${getSize(item.count)} ${colors[index % colors.length]} cursor-default transition-transform px-3 py-1 rounded-full bg-muted/50`}
          >
            {item.keyword}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
