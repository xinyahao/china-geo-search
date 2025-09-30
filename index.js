// 直接导入 JSON 数据
import GEO_DATA from './info.json' with { type: 'json' };

/**
 * 中国地理数据模糊搜索工具
 * 支持省、市、区的模糊搜索
 */
class ChinaGeoSearch {
    constructor() {
        this.provinces = new Map();
        this.cities = new Map();
        this.districts = new Map();
        this.allData = [];
        this.isLoaded = false;
        this.loadData();
    }

    /**
     * 加载所有地理数据
     */
    loadData() {
        try {
            // 直接从导入的数据加载
            this.loadAllDataFromEmbedded();
            this.isLoaded = true;
            console.log('地理数据加载完成');
        } catch (error) {
            console.error('数据加载失败:', error);
            this.isLoaded = false;
            throw new Error(`地理数据加载失败: ${error.message}`);
        }
    }

    /**
     * 从嵌入的数据加载所有数据
     */
    loadAllDataFromEmbedded() {
        if (!GEO_DATA || typeof GEO_DATA !== 'object') {
            throw new Error('嵌入数据格式错误');
        }
        
        // 遍历所有数据
        Object.values(GEO_DATA).forEach(item => {
            if (!item || typeof item !== 'object') {
                return; // 跳过无效数据
            }
            
            // 处理有 children 的数据结构
            if (item.children && Array.isArray(item.children)) {
                item.children.forEach(child => {
                    this.processGeoItem(child);
                });
            } else {
                // 处理直接的数据项
                this.processGeoItem(item);
            }
        });
    }

    /**
     * 处理单个地理数据项
     * @param {Object} item 地理数据项
     */
    processGeoItem(item) {
        if (!item || typeof item !== 'object') {
            return; // 跳过无效数据
        }
        
        const geoItem = {
            name: item.name || '',
            adcode: item.adcode || 0,
            level: item.level || 'unknown',
            center: Array.isArray(item.center) ? item.center : [0, 0],
            centroid: Array.isArray(item.centroid) ? item.centroid : [0, 0],
            parent: item.parent || null,
            acroutes: Array.isArray(item.acroutes) ? item.acroutes : [],
            childrenNum: item.childrenNum || 0,
            subFeatureIndex: item.subFeatureIndex || 0,
            type: item.level || 'unknown' // 直接使用level作为type
        };
        
        // 根据level存储到对应的Map中
        if (item.level === 'province') {
            this.provinces.set(item.adcode, geoItem);
        } else if (item.level === 'city') {
            this.cities.set(item.adcode, geoItem);
        } else if (item.level === 'district') {
            this.districts.set(item.adcode, geoItem);
        }
        
        this.allData.push(geoItem);
    }


    /**
     * 获取完整的行政路径信息
     * @param {Object} item 地理数据项
     * @returns {string} 完整的行政路径
     */
    getFullPath(item) {
        const pathParts = [];
        
        // 添加当前项
        pathParts.push(item.name);
        
        // 如果有父级信息，尝试获取父级名称
        if (item.parent && item.parent.adcode) {
            const parent = this.getByAdcode(item.parent.adcode);
            if (parent) {
                pathParts.unshift(parent.name);
                
                // 如果父级还有父级，继续向上查找
                if (parent.parent && parent.parent.adcode) {
                    const grandParent = this.getByAdcode(parent.parent.adcode);
                    if (grandParent) {
                        pathParts.unshift(grandParent.name);
                    }
                }
            }
        }
        
        return pathParts.join(' > ');
    }


    /**
     * 模糊搜索
     * @param {string} query 搜索关键词
     * @param {Object} options 搜索选项
     * @returns {Array} 搜索结果
     */
    search(query, options = {}) {
        // 检查数据是否已加载
        if (!this.isLoaded) {
            throw new Error('数据尚未加载完成，请稍后再试');
        }

        const {
            type = 'all'        // 搜索类型：'all', 'province', 'city', 'district'
        } = options;

        if (!query || typeof query !== 'string' || query.trim() === '') {
            return [];
        }

        const searchQuery = query.trim();
        const results = [];

        // 根据类型选择搜索范围
        let searchData = [];
        switch (type) {
            case 'province':
                searchData = Array.from(this.provinces.values());
                break;
            case 'city':
                searchData = Array.from(this.cities.values());
                break;
            case 'district':
                searchData = Array.from(this.districts.values());
                break;
            default:
                searchData = this.allData;
        }

        // 计算相似度并过滤结果
        searchData.forEach(item => {
            // 检查是否包含关键词
            const containsQuery = item.name.includes(searchQuery);
            
            // 只有包含关键词的结果才加入搜索结果
            if (containsQuery) {
                // 获取完整的行政路径信息
                const fullPath = this.getFullPath(item);
                
                results.push({
                    ...item,
                    similarity: 1.0, // 包含匹配100%相似度
                    matchType: 'contains',
                    fullPath: fullPath
                });
            }
        });

        // 去重：根据adcode去重
        const uniqueResults = [];
        const seenAdcodes = new Set();
        
        results.forEach(item => {
            if (!seenAdcodes.has(item.adcode)) {
                seenAdcodes.add(item.adcode);
                uniqueResults.push(item);
            }
        });

        // 按名称排序
        return uniqueResults.sort((a, b) => a.name.localeCompare(b.name));
    }


    /**
     * 根据adcode获取详细信息
     * @param {number} adcode 行政区划代码
     * @returns {Object|null} 详细信息
     */
    getByAdcode(adcode) {
        // 检查数据是否已加载
        if (!this.isLoaded) {
            throw new Error('数据尚未加载完成，请稍后再试');
        }

        // 参数验证
        if (typeof adcode !== 'number' || adcode <= 0) {
            return null;
        }

        return this.provinces.get(adcode) || 
               this.cities.get(adcode) || 
               this.districts.get(adcode) || 
               null;
    }

    /**
     * 获取统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        // 检查数据是否已加载
        if (!this.isLoaded) {
            throw new Error('数据尚未加载完成，请稍后再试');
        }

        return {
            provinces: this.provinces.size,
            cities: this.cities.size,
            districts: this.districts.size,
            total: this.allData.length
        };
    }
}

// 创建全局实例
let geoSearch;
try {
    geoSearch = new ChinaGeoSearch();
} catch (error) {
    console.error('初始化地理搜索实例失败:', error.message);
    // 创建一个空的实例作为fallback
    geoSearch = {
        search: () => { throw new Error('地理搜索服务不可用'); },
        getByAdcode: () => { throw new Error('地理搜索服务不可用'); },
        getStats: () => { throw new Error('地理搜索服务不可用'); }
    };
}

// ES6 模块导出
export { ChinaGeoSearch, geoSearch };

// 便捷方法导出
export const search = (query, options) => geoSearch.search(query, options);
export const getByAdcode = (adcode) => geoSearch.getByAdcode(adcode);
export const getStats = () => geoSearch.getStats();

// 默认导出
export default geoSearch;