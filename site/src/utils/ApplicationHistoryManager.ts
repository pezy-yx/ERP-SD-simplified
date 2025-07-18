/**
 * 应用程序信息接口
 */
export interface ApplicationInfo {
  applicationName: string;
  routePath: string;
  lore?: string;
  tags?: string[];
}

/**
 * 访问记录接口
 */
export interface VisitRecord extends ApplicationInfo {
  visitTime: string;
  visitCount: number;
}

/**
 * 应用程序访问历史记录管理器
 * 提供统一的接口来管理用户的应用程序访问历史
 * 支持本地存储和未来的数据库同步
 */
class ApplicationHistoryManager {
  private storageKey: string;
  private maxHistorySize: number;

  constructor() {
    this.storageKey = 'application_visit_history';
    this.maxHistorySize = 10; // 最多保存10条历史记录
  }

  /**
   * 获取历史记录
   * @returns 历史记录数组，按访问时间倒序排列
   */
  getHistory(): VisitRecord[] {
    try {
      const historyData = localStorage.getItem(this.storageKey);
      if (!historyData) {
        return [];
      }
      const history = JSON.parse(historyData);
      // 确保返回的是数组格式
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error('获取应用程序历史记录失败:', error);
      return [];
    }
  }

  /**
   * 添加访问记录
   * @param applicationInfo 应用程序信息
   */
  addVisitRecord(applicationInfo: ApplicationInfo): void {
    try {
      const history = this.getHistory();
      
      // 创建访问记录
      const visitRecord: VisitRecord = {
        applicationName: applicationInfo.applicationName,
        routePath: applicationInfo.routePath,
        lore: applicationInfo.lore || '',
        tags: applicationInfo.tags || [],
        visitTime: new Date().toISOString(),
        visitCount: 1
      };

      // 检查是否已存在相同的应用程序记录
      const existingIndex = history.findIndex(
        record => record.routePath === applicationInfo.routePath
      );

      if (existingIndex !== -1) {
        // 如果已存在，更新访问时间和次数，并移到最前面
        const existingRecord = history[existingIndex];
        existingRecord.visitTime = visitRecord.visitTime;
        existingRecord.visitCount = (existingRecord.visitCount || 1) + 1;
        
        // 移除原记录并添加到最前面
        history.splice(existingIndex, 1);
        history.unshift(existingRecord);
      } else {
        // 如果不存在，添加新记录到最前面
        history.unshift(visitRecord);
      }

      // 限制历史记录数量
      if (history.length > this.maxHistorySize) {
        history.splice(this.maxHistorySize);
      }

      // 保存到本地存储
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      
      console.log('应用程序访问记录已添加:', visitRecord);
    } catch (error) {
      console.error('添加应用程序访问记录失败:', error);
    }
  }

  /**
   * 清除历史记录
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('应用程序历史记录已清除');
    } catch (error) {
      console.error('清除应用程序历史记录失败:', error);
    }
  }

  /**
   * 删除特定的历史记录
   * @param routePath 要删除的应用程序路由路径
   */
  removeHistoryRecord(routePath: string): void {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(record => record.routePath !== routePath);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
      console.log('已删除应用程序历史记录:', routePath);
    } catch (error) {
      console.error('删除应用程序历史记录失败:', error);
    }
  }

  /**
   * 获取最近访问的应用程序（限制数量）
   * @param limit 返回的记录数量限制，默认为5
   * @returns 最近访问的应用程序列表
   */
  getRecentApplications(limit: number = 5): VisitRecord[] {
    const history = this.getHistory();
    return history.slice(0, limit);
  }

  /**
   * 未来扩展：同步到服务器
   * @param userId 用户ID
   */
  async syncToServer(userId: string): Promise<void> {
    // TODO: 实现与服务器的同步逻辑
    console.log('同步历史记录到服务器 (功能待实现)', userId);
  }

  /**
   * 未来扩展：从服务器获取历史记录
   * @param userId 用户ID
   */
  async fetchFromServer(userId: string): Promise<void> {
    // TODO: 实现从服务器获取历史记录的逻辑
    console.log('从服务器获取历史记录 (功能待实现)', userId);
  }
}

// 创建单例实例
const applicationHistoryManager = new ApplicationHistoryManager();

export default applicationHistoryManager;
