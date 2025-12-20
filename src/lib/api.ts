import axios, { AxiosError } from 'axios';

/**
 * API 响应数据类型
 */
export interface AnnualReportData {
  year: number;
  user: {
    id: number;
    username: string;
    avatar_url: string | null;
    registered_at: string | null;
    is_vip: boolean;
    vip_expire_at: string | null;
  };
  overview: {
    active_days: number;
    total_access: number;
    most_active_month: number | null;
    most_active_month_access: number;
  };
  activity: {
    monthly_trend: Array<{
      month: string;
      total_access: number;
      active_days: number;
    }>;
    check_ins: {
      total: number;
      max_consecutive_days: number;
      last_check_in: string | null;
    };
  };
  social: {
    following_count: number;
    followers_count: number;
    chat_sessions_count: number;
    messages_count: number;
  };
  content: {
    rooms_created: number;
    reviews_count: number;
  };
  watching: {
    favorites_count: number;
    rooms_joined: number;
  };
  points: {
    total_points: number;
    available_points: number;
    used_points: number;
    year_earned: number;
    year_used: number;
    sources: Array<{
      type: string;
      points: number;
    }>;
  };
  search: {
    total_searches: number;
    top_keywords: Array<{
      keyword: string;
      count: number;
    }>;
    top_sources: Array<{
      source_url: string;
      count: number;
    }>;
    monthly_trend: Array<{
      month: string;
      count: number;
    }>;
    most_active_month: number | null;
    most_active_month_count: number;
  };
  couple: {
    has_couple: boolean;
    partner: {
      id: number;
      username: string;
      avatar_url: string | null;
    } | null;
    anniversary_date: string | null;
    days_together: number;
    created_at: string | null;
  };
}

/**
 * Mock 数据（用于开发环境或 API 失败时的降级方案）
 */
export function getMockData(): AnnualReportData {
  return {
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
}

/**
 * 规范化API响应数据，确保所有必需字段都有默认值
 */
function normalizeReportData(data: any): AnnualReportData {
  // 确保 social 对象存在
  const social = data.social || {};
  
  // 调试：输出原始 social 数据
  if (import.meta.env.DEV) {
    console.log('原始 social 数据:', social);
    console.log('following_count 类型:', typeof social.following_count, '值:', social.following_count);
    console.log('chat_sessions_count 类型:', typeof social.chat_sessions_count, '值:', social.chat_sessions_count);
  }
  
  // 确保数值字段是数字类型
  const followingCount = typeof social.following_count === 'number' 
    ? social.following_count 
    : (social.following_count != null ? Number(social.following_count) || 0 : 0);
  const followersCount = typeof social.followers_count === 'number' 
    ? social.followers_count 
    : (social.followers_count != null ? Number(social.followers_count) || 0 : 0);
  const chatSessionsCount = typeof social.chat_sessions_count === 'number' 
    ? social.chat_sessions_count 
    : (social.chat_sessions_count != null ? Number(social.chat_sessions_count) || 0 : 0);
  const messagesCount = typeof social.messages_count === 'number' 
    ? social.messages_count 
    : (social.messages_count != null ? Number(social.messages_count) || 0 : 0);
  
  if (import.meta.env.DEV) {
    console.log('规范化后的值:', {
      following_count: followingCount,
      chat_sessions_count: chatSessionsCount
    });
  }
  
  return {
    year: data.year || new Date().getFullYear(),
    user: {
      id: data.user?.id || 0,
      username: data.user?.username || '',
      avatar_url: data.user?.avatar_url || null,
      registered_at: data.user?.registered_at || null,
      is_vip: data.user?.is_vip || false,
      vip_expire_at: data.user?.vip_expire_at || null,
    },
    overview: {
      active_days: data.overview?.active_days || 0,
      total_access: data.overview?.total_access || 0,
      most_active_month: data.overview?.most_active_month || null,
      most_active_month_access: data.overview?.most_active_month_access || 0,
    },
    activity: {
      monthly_trend: data.activity?.monthly_trend || [],
      check_ins: {
        total: data.activity?.check_ins?.total || 0,
        max_consecutive_days: data.activity?.check_ins?.max_consecutive_days || 0,
        last_check_in: data.activity?.check_ins?.last_check_in || null,
      },
    },
    social: {
      following_count: followingCount,
      followers_count: followersCount,
      chat_sessions_count: chatSessionsCount,
      messages_count: messagesCount,
    },
    content: {
      rooms_created: data.content?.rooms_created || 0,
      reviews_count: data.content?.reviews_count || 0,
    },
    watching: {
      favorites_count: data.watching?.favorites_count || 0,
      rooms_joined: data.watching?.rooms_joined || 0,
    },
    points: {
      total_points: data.points?.total_points || 0,
      available_points: data.points?.available_points || 0,
      used_points: data.points?.used_points || 0,
      year_earned: data.points?.year_earned || 0,
      year_used: data.points?.year_used || 0,
      sources: data.points?.sources || [],
    },
    search: {
      total_searches: data.search?.total_searches || 0,
      top_keywords: data.search?.top_keywords || [],
      top_sources: data.search?.top_sources || [],
      monthly_trend: data.search?.monthly_trend || [],
      most_active_month: data.search?.most_active_month || null,
      most_active_month_count: data.search?.most_active_month_count || 0,
    },
    couple: {
      has_couple: data.couple?.has_couple || false,
      partner: data.couple?.partner || null,
      anniversary_date: data.couple?.anniversary_date || null,
      days_together: data.couple?.days_together || 0,
      created_at: data.couple?.created_at || null,
    },
  };
}

/**
 * 获取年度报告数据
 * @param token 认证 token
 * @param year 年份，默认为当前年份
 * @returns 年度报告数据
 */
export async function fetchAnnualReport(
  token: string,
  year?: number
): Promise<AnnualReportData> {
  if (!token) {
    throw new Error('未检测到登录信息');
  }

  const currentYear = year || new Date().getFullYear();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    throw new Error('VITE_API_URL 未配置，请在构建时设置 API 地址');
  }
  
  try {
    const response = await axios.get<any>(
      `${apiUrl}/api/social/annual-report`,
      {
        params: { year: currentYear },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // 规范化数据，确保所有字段都有默认值
    const normalizedData = normalizeReportData(response.data);
    
    // 开发环境下输出调试信息
    if (import.meta.env.DEV) {
      console.log('API 原始数据:', response.data);
      console.log('规范化后的 social 数据:', normalizedData.social);
    }
    
    return normalizedData;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    
    // 开发环境下，如果 API 失败，返回 mock 数据
    if (import.meta.env.DEV) {
      console.warn('API 请求失败，使用 mock 数据:', axiosError.message);
      return getMockData();
    }

    // 生产环境抛出错误
    const errorMessage = axiosError.response?.data?.detail || axiosError.message || '无法连接到服务器';
    throw new Error(errorMessage);
  }
}

