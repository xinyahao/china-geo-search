/**
 * TypeScript 使用示例
 */

import { 
    ChinaGeoSearch, 
    GeoItem, 
    SearchResult, 
    SearchOptions, 
    Stats 
} from '../types/index';

console.log('=== 中国地理数据搜索工具 - TypeScript 示例 ===\n');

// 1. 创建实例
const geoSearch = new ChinaGeoSearch();

// 2. 类型安全的搜索
function searchWithTypes(query: string, options?: SearchOptions): SearchResult[] {
    return geoSearch.search(query, options);
}

// 3. 类型安全的获取
function getByAdcodeWithTypes(adcode: number): GeoItem | null {
    return geoSearch.getByAdcode(adcode);
}

// 4. 类型安全的统计
function getStatsWithTypes(): Stats {
    return geoSearch.getStats();
}

// 5. 使用示例
console.log('1. 类型安全的搜索:');
const results: SearchResult[] = searchWithTypes('北京');
results.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.name} (${result.level})`);
    console.log(`      坐标: [${result.center[0]}, ${result.center[1]}]`);
    console.log(`      完整路径: ${result.fullPath}`);
});
console.log('');

console.log('2. 类型安全的获取:');
const beijing: GeoItem | null = getByAdcodeWithTypes(110000);
if (beijing) {
    console.log(`   名称: ${beijing.name}`);
    console.log(`   级别: ${beijing.level}`);
    console.log(`   坐标: [${beijing.center[0]}, ${beijing.center[1]}]`);
}
console.log('');

console.log('3. 类型安全的统计:');
const stats: Stats = getByAdcodeWithTypes();
console.log(`   省份: ${stats.provinces}`);
console.log(`   城市: ${stats.cities}`);
console.log(`   区县: ${stats.districts}`);
console.log(`   总计: ${stats.total}`);

// 6. 高级类型使用
interface SearchResultWithDistance extends SearchResult {
    distance?: number;
}

function calculateDistance(result: SearchResult, targetLng: number, targetLat: number): number {
    const [lng, lat] = result.center;
    const dx = lng - targetLng;
    const dy = lat - targetLat;
    return Math.sqrt(dx * dx + dy * dy);
}

function searchWithDistance(query: string, targetLng: number, targetLat: number): SearchResultWithDistance[] {
    const results = geoSearch.search(query);
    return results.map(result => ({
        ...result,
        distance: calculateDistance(result, targetLng, targetLat)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

console.log('\n4. 带距离计算的搜索:');
const distanceResults = searchWithDistance('北京', 116.4074, 39.9042);
distanceResults.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.name} - 距离: ${result.distance?.toFixed(4)}`);
});
