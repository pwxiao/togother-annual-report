import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MonthlyData {
  month: string;
  total_access: number;
  active_days: number;
}

interface ActivityChartProps {
  data: MonthlyData[];
}

const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export const ActivityChart = ({ data }: ActivityChartProps) => {
  const chartData = monthNames.map((name, index) => {
    const monthData = data.find(d => {
      const monthNum = parseInt(d.month.split("-")[1]);
      return monthNum === index + 1;
    });
    return {
      name,
      访问量: monthData?.total_access || 0,
      活跃天数: monthData?.active_days || 0,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">月度活跃趋势</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "none",
                borderRadius: "12px",
                boxShadow: "var(--shadow-card)"
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar 
              dataKey="访问量" 
              fill="hsl(var(--primary))" 
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
