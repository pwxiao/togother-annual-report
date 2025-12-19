/**
 * Token 获取工具
 * 支持多种方式获取 app token
 */

declare global {
  interface Window {
    appToken?: string;
    getAppToken?: () => string | null | undefined;
    onAppTokenReceived?: (token: string) => void;
    setAppToken?: (token: string) => void; // 开发模式下手动设置token
  }
}

export type TokenSource = 'window.appToken' | 'window.getAppToken()' | 'Event' | 'Callback' | null;

export interface TokenInfo {
  token: string | null;
  source: TokenSource;
}

/**
 * 检查并获取 token
 */
export function checkToken(): TokenInfo {
  if (typeof window === 'undefined') {
    return { token: null, source: null };
  }

  // 方式1: window.appToken
  if (window.appToken) {
    return {
      token: window.appToken,
      source: 'window.appToken'
    };
  }

  // 方式2: window.getAppToken()
  if (typeof window.getAppToken === 'function') {
    try {
      const token = window.getAppToken();
      if (token) {
        return {
          token: token,
          source: 'window.getAppToken()'
        };
      }
    } catch (e) {
      console.error('Error calling getAppToken:', e);
    }
  }

  return { token: null, source: null };
}

/**
 * 设置 token 监听器
 * @param onTokenReceived token 获取回调
 * @returns 清理函数
 */
export function setupTokenListeners(
  onTokenReceived: (token: string, source: TokenSource) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // 监听 appTokenReady 事件
  const handleTokenReady = (e: Event) => {
    const customEvent = e as CustomEvent<{ token: string }>;
    if (customEvent.detail?.token) {
      onTokenReceived(customEvent.detail.token, 'Event');
    }
  };

  window.addEventListener('appTokenReady', handleTokenReady);

  // 设置回调函数
  if (!window.onAppTokenReceived) {
    window.onAppTokenReceived = (token: string) => {
      onTokenReceived(token, 'Callback');
    };
  }

  // 返回清理函数
  return () => {
    window.removeEventListener('appTokenReady', handleTokenReady);
  };
}

/**
 * 轮询获取 token
 * @param onTokenReceived token 获取回调
 * @param maxRetries 最大重试次数，默认 10
 * @param interval 轮询间隔（毫秒），默认 500
 * @returns 清理函数
 */
export function pollForToken(
  onTokenReceived: (token: string, source: TokenSource) => void,
  maxRetries: number = 10,
  interval: number = 500
): () => void {
  let retries = 0;
  const pollInterval = setInterval(() => {
    const tokenInfo = checkToken();
    if (tokenInfo.token) {
      clearInterval(pollInterval);
      onTokenReceived(tokenInfo.token, tokenInfo.source);
    } else if (++retries >= maxRetries) {
      clearInterval(pollInterval);
    }
  }, interval);

  return () => {
    clearInterval(pollInterval);
  };
}

/**
 * 开发模式下：在控制台手动设置 token
 * 使用方法：在浏览器控制台输入 window.setAppToken('your-token-here')
 */
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.setAppToken = (token: string) => {
    if (!token) {
      console.warn('Token 不能为空');
      return;
    }
    window.appToken = token;
    console.log('Token 已设置:', token);
    console.log('触发 appTokenReady 事件...');
    
    // 触发事件，让应用重新检查token
    const event = new CustomEvent('appTokenReady', {
      detail: { token }
    });
    window.dispatchEvent(event);
    
    // 如果设置了回调函数，也调用它
    if (window.onAppTokenReceived) {
      window.onAppTokenReceived(token);
    }
    
    console.log('✅ Token 设置成功！页面应该会自动刷新数据。');
  };
  
  console.log('%c🔧 开发模式：Token 设置工具已启用', 'color: #10b981; font-weight: bold;');
  console.log('在控制台输入以下命令设置 token:');
  console.log('%cwindow.setAppToken("your-token-here")', 'color: #3b82f6; font-family: monospace;');
  console.log('或者直接设置: %cwindow.appToken = "your-token-here"', 'color: #3b82f6; font-family: monospace;');
}

