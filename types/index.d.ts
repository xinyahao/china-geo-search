/**
 * 中国地理数据搜索工具类型定义
 */

/**
 * 地理数据项接口
 */
export interface GeoItem {
  /** 名称 */
  name: string;
  /** 行政区划代码 */
  adcode: number;
  /** 级别 */
  level: 'province' | 'city' | 'district';
  /** 中心坐标 [经度, 纬度] */
  center: [number, number];
  /** 质心坐标 [经度, 纬度] */
  centroid: [number, number];
  /** 父级信息 */
  parent?: {
    adcode: number;
  };
  /** 行政路径 */
  acroutes: number[];
  /** 子级数量 */
  childrenNum: number;
  /** 子特征索引 */
  subFeatureIndex: number;
  /** 类型（与level相同） */
  type: 'province' | 'city' | 'district';
}

/**
 * 搜索结果项接口
 */
export interface SearchResult extends GeoItem {
  /** 相似度 (0-1) */
  similarity: number;
  /** 匹配类型 */
  matchType: 'contains';
  /** 完整行政路径 */
  fullPath: string;
}

/**
 * 搜索选项接口
 */
export interface SearchOptions {
  /** 搜索类型 */
  type?: 'all' | 'province' | 'city' | 'district';
}

/**
 * 统计信息接口
 */
export interface Stats {
  /** 省份数量 */
  provinces: number;
  /** 城市数量 */
  cities: number;
  /** 区县数量 */
  districts: number;
  /** 总数量 */
  total: number;
}

/**
 * 中国地理搜索类
 */
export declare class ChinaGeoSearch {
  /** 省份数据 */
  provinces: Map<number, GeoItem>;
  /** 城市数据 */
  cities: Map<number, GeoItem>;
  /** 区县数据 */
  districts: Map<number, GeoItem>;
  /** 所有数据 */
  allData: GeoItem[];

  /**
   * 构造函数
   */
  constructor();

  /**
   * 加载所有地理数据
   */
  loadData(): void;

  /**
   * 从info.json加载所有数据
   */
  loadAllDataFromInfo(): void;

  /**
   * 获取完整的行政路径信息
   * @param item 地理数据项
   * @returns 完整的行政路径
   */
  getFullPath(item: GeoItem): string;

  /**
   * 模糊搜索
   * @param query 搜索关键词
   * @param options 搜索选项
   * @returns 搜索结果
   */
  search(query: string, options?: SearchOptions): SearchResult[];

  /**
   * 根据adcode获取详细信息
   * @param adcode 行政区划代码
   * @returns 详细信息
   */
  getByAdcode(adcode: number): GeoItem | null;

  /**
   * 获取统计信息
   * @returns 统计信息
   */
  getStats(): Stats;
}

/**
 * 全局地理搜索实例
 */
export declare const geoSearch: ChinaGeoSearch;

/**
 * 便捷搜索方法
 * @param query 搜索关键词
 * @param options 搜索选项
 * @returns 搜索结果
 */
export declare function search(query: string, options?: SearchOptions): SearchResult[];

/**
 * 便捷获取方法
 * @param adcode 行政区划代码
 * @returns 详细信息
 */
export declare function getByAdcode(adcode: number): GeoItem | null;

/**
 * 便捷统计方法
 * @returns 统计信息
 */
export declare function getStats(): Stats;

/**
 * 默认导出
 */
declare const _default: {
  ChinaGeoSearch: typeof ChinaGeoSearch;
  geoSearch: typeof geoSearch;
  search: typeof search;
  getByAdcode: typeof getByAdcode;
  getStats: typeof getStats;
};

export default _default;
