const fs = require('fs');
const path = require('path');

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
            // 直接从info.json加载所有数据
            this.loadAllDataFromInfo();
            this.isLoaded = true;
            console.log('地理数据加载完成');
        } catch (error) {
            console.error('数据加载失败:', error);
            this.isLoaded = false;
            throw new Error(`地理数据加载失败: ${error.message}`);
        }
    }

    /**
     * 从info.json加载所有数据
     */
    loadAllDataFromInfo() {
        const infoPath = path.join(__dirname, 'info.json');
        
        // 检查文件是否存在
        if (!fs.existsSync(infoPath)) {
            throw new Error(`数据文件不存在: ${infoPath}`);
        }
        
        let data;
        try {
            const fileContent = fs.readFileSync(infoPath, 'utf8');
            data = JSON.parse(fileContent);
        } catch (error) {
            throw new Error(`数据文件解析失败: ${error.message}`);
        }
        
        if (!data || typeof data !== 'object') {
            throw new Error('数据文件格式错误');
        }
        
        // 遍历所有数据
        Object.values(data).forEach(item => {
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
        });
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

// 导出模块
module.exports = {
    ChinaGeoSearch,
    geoSearch,
    
    // 便捷方法
    search: (query, options) => geoSearch.search(query, options),
    getByAdcode: (adcode) => geoSearch.getByAdcode(adcode),
    getStats: () => geoSearch.getStats()
};

// 如果直接运行此文件，提供命令行接口
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法:');
        console.log('  node index.js <搜索关键词> [类型]');
        console.log('');
        console.log('参数说明:');
        console.log('  搜索关键词: 要搜索的地名');
        console.log('  类型: all(全部) | province(省) | city(市) | district(区)');
        console.log('');
        console.log('示例:');
        console.log('  node index.js 北京');
        console.log('  node index.js 成都 city');
        console.log('  node index.js 朝阳 district');
        console.log('');
        console.log('统计信息:', geoSearch.getStats());
        return;
    }

    const query = args[0];
    const type = args[1] || 'all';

    console.log(`搜索 "${query}" (类型: ${type})`);
    console.log('='.repeat(50));

    const results = geoSearch.search(query, { type });
    
    if (results.length === 0) {
        console.log('未找到匹配结果');
    } else {
        results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.name} (${result.type})`);
            console.log(`   代码: ${result.adcode}`);
            console.log(`   相似度: ${(result.similarity * 100).toFixed(1)}%`);
            console.log(`   匹配类型: ${result.matchType}`);
            console.log(`   级别: ${result.level}`);
            if (result.fullPath) {
                console.log(`   完整路径: ${result.fullPath}`);
            }
            if (result.parent && result.parent.adcode) {
                console.log(`   父级代码: ${result.parent.adcode}`);
            }
            if (result.center) {
                console.log(`   坐标: [${result.center[0]}, ${result.center[1]}]`);
            }
            console.log('');
        });
    }
}
