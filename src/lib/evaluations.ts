import { AnnualReportData } from './api';

/**
 * 根据数据生成智能评价
 */

/**
 * 获取活跃月份的评价
 */
export function getActiveMonthEvaluation(month: number | null): string {
  if (!month) return '';
  
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const monthName = monthNames[month - 1];
  
  return `对于你来说，${monthName}肯定有特别的回忆 ✨`;
}

/**
 * 获取活跃天数的评价
 */
export function getActiveDaysEvaluation(activeDays: number): string {
  if (activeDays >= 300) {
    return '您是Togother的超级忠实用户！几乎每天都在陪伴我们 🌟';
  } else if (activeDays >= 200) {
    return '您是Togother的忠实用户，感谢您的持续陪伴 💖';
  } else if (activeDays >= 150) {
    return '您是Togother的忠实用户，这一年有您真好 🎉';
  } else if (activeDays >= 100) {
    return '您是Togother的活跃用户，期待与您更多互动 🌈';
  } else if (activeDays >= 50) {
    return '您是Togother的常客，希望您能常来看看 📺';
  } else if (activeDays >= 20) {
    return '感谢您的关注，期待与您Togother更多精彩内容 🎬';
  } else {
    return '欢迎来到Togother，希望这里能成为您的观影乐园 🎭';
  }
}

/**
 * 获取连续打卡的评价
 */
export function getConsecutiveCheckInEvaluation(consecutiveDays: number): string {
  if (consecutiveDays >= 30) {
    return '连续打卡超过30天！您的坚持令人敬佩，这就是真正的热爱 🔥';
  } else if (consecutiveDays >= 20) {
    return '连续打卡超过20天！您的毅力值得称赞，继续保持 💪';
  } else if (consecutiveDays >= 10) {
    return '连续打卡超过10天！坚持就是胜利，加油 ⭐';
  } else if (consecutiveDays >= 5) {
    return '连续打卡超过5天！好的开始是成功的一半 🌱';
  } else {
    return '每一次打卡都是新的开始，坚持就是胜利 💫';
  }
}

/**
 * 获取总访问次数的评价
 */
export function getTotalAccessEvaluation(totalAccess: number): string {
  if (totalAccess >= 2000) {
    return '年度访问超过2000次！您对Togother的喜爱可见一斑 🚀';
  } else if (totalAccess >= 1000) {
    return '年度访问超过1000次！您是Togother的重度用户 🎯';
  } else if (totalAccess >= 500) {
    return '年度访问超过500次！您是Togother的活跃用户 📊';
  } else if (totalAccess >= 200) {
    return '年度访问超过200次！感谢您的支持与陪伴 🙏';
  } else {
    return '感谢您的访问，希望Togother能给您带来快乐 😊';
  }
}

/**
 * 获取社交互动的评价
 */
export function getSocialEvaluation(data: AnnualReportData['social']): string {
  const { following_count, followers_count, chat_sessions_count, messages_count } = data;
  const totalSocial = following_count + followers_count + chat_sessions_count + messages_count;
  
  if (totalSocial >= 500) {
    return '您的社交活跃度超高！是Togother的社交达人 🌐';
  } else if (totalSocial >= 200) {
    return '您在一起来很受欢迎，社交互动频繁 👥';
  } else if (totalSocial >= 100) {
    return '您在一起来有不错的社交圈，继续保持 💬';
  } else if (totalSocial >= 50) {
    return '您在一起来有良好的社交互动 🌟';
  } else {
    return '多与大家一起互动，会发现更多精彩内容 💭';
  }
}

/**
 * 获取内容创作的评价
 */
export function getContentEvaluation(data: AnnualReportData['content']): string {
  const { rooms_created, reviews_count } = data;
  const totalContent = rooms_created + reviews_count;
  
  if (totalContent >= 50) {
    return '您是内容创作达人！为Togother贡献了丰富的内容 🎨';
  } else if (totalContent >= 20) {
    return '您创作了不少精彩内容，感谢您的分享 ✍️';
  } else if (totalContent >= 10) {
    return '您有不错的内容创作，期待更多精彩作品 📝';
  } else if (totalContent >= 5) {
    return '您开始创作内容了，继续加油 💡';
  } else {
    return '尝试创作一些内容，分享您的观影感受吧 📖';
  }
}

/**
 * 获取收藏与观看的评价
 */
export function getWatchingEvaluation(data: AnnualReportData['watching']): string {
  const { favorites_count, rooms_joined } = data;
  const totalWatching = favorites_count + rooms_joined;
  
  if (totalWatching >= 200) {
    return '您收藏和观看了大量内容，是真正的观影爱好者 🎬';
  } else if (totalWatching >= 100) {
    return '您有丰富的观影记录，品味不错 🎭';
  } else if (totalWatching >= 50) {
    return '您观看了不少精彩内容，继续探索 🎪';
  } else if (totalWatching >= 20) {
    return '您开始探索Togother的内容了，发现更多精彩 🎨';
  } else {
    return '多看看Togother的精彩内容，会有惊喜发现 🎯';
  }
}

/**
 * 获取积分收获的评价
 */
export function getPointsEvaluation(yearEarned: number): string {
  if (yearEarned >= 5000) {
    return '年度积分超过5000！您是Togother的积分达人 🏆';
  } else if (yearEarned >= 3000) {
    return '年度积分超过3000！您的活跃度很高 💎';
  } else if (yearEarned >= 2000) {
    return '年度积分超过2000！您在一起来很活跃 ⭐';
  } else if (yearEarned >= 1000) {
    return '年度积分超过1000！继续保持活跃 💰';
  } else if (yearEarned >= 500) {
    return '年度积分超过500！继续努力赚取更多积分 💵';
  } else {
    return '多参与活动，赚取积分可以兑换会员哦';
  }
}

/**
 * 获取搜索的评价
 */
export function getSearchEvaluation(totalSearches: number): string {
  if (totalSearches >= 500) {
    return '年度搜索超过500次！您对内容有很强的探索欲 🔍';
  } else if (totalSearches >= 300) {
    return '年度搜索超过300次！您很善于发现精彩内容 🎯';
  } else if (totalSearches >= 200) {
    return '年度搜索超过200次！您有不错的搜索习惯 🔎';
  } else if (totalSearches >= 100) {
    return '年度搜索超过100次！多搜索会发现更多精彩 📱';
  } else {
    return '多使用搜索功能，发现您感兴趣的内容 🔎';
  }
}

/**
 * 获取情侣空间的评价
 */
export function getCoupleEvaluation(daysTogether: number): string {
  if (daysTogether >= 365) {
    return '在一起超过一年了！时间见证了你们的爱情 💑';
  } else if (daysTogether >= 200) {
    return `在一起${daysTogether}天了！你们的感情很稳定 💕`;
  } else if (daysTogether >= 100) {
    return `在一起${daysTogether}天了！继续Togother更多精彩 💖`;
  } else if (daysTogether >= 30) {
    return `在一起${daysTogether}天了！希望你们能一直在一起 🎬`;
  } else if (daysTogether > 0) {
    return `在一起${daysTogether}天了！最浪漫的事就是和你Togother 💝`;
  } else {
    return '找到那个愿意和你Togother的人，是最浪漫的事 💗';
  }
}



