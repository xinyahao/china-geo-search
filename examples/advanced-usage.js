/**
 * 高级使用示例
 */

const { ChinaGeoSearch } = require('../index.js');

console.log('=== 中国地理数据搜索工具 - 高级使用示例 ===\n');

// 1. 创建自定义实例
console.log('1. 创建自定义地理搜索实例:');
const geoSearch = new ChinaGeoSearch();

// 2. 批量搜索示例
console.log('2. 批量搜索示例:');
const searchQueries = ['北京', '上海', '广州', '深圳', '杭州'];
const batchResults = {};

searchQueries.forEach(query => {
    const results = geoSearch.search(query);
    batchResults[query] = results.length;
    console.log(`   搜索 "${query}": 找到 ${results.length} 个结果`);
});
console.log('');

// 3. 按级别统计搜索结果
console.log('3. 按级别统计搜索结果 "北京":');
const beijingResults = geoSearch.search('北京');
const levelStats = {};

beijingResults.forEach(result => {
    const level = result.level;
    levelStats[level] = (levelStats[level] || 0) + 1;
});

Object.entries(levelStats).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} 个结果`);
});
console.log('');

// 4. 坐标范围搜索示例
console.log('4. 坐标范围搜索示例 (经度 115-117, 纬度 39-41):');
const coordinateResults = geoSearch.search('北京');
const coordinateFiltered = coordinateResults.filter(result => {
    const [lng, lat] = result.center;
    return lng >= 115 && lng <= 117 && lat >= 39 && lat <= 41;
});

console.log(`   在指定坐标范围内的结果: ${coordinateFiltered.length} 个`);
coordinateFiltered.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.name} - [${result.center[0]}, ${result.center[1]}]`);
});
console.log('');

// 5. 搜索性能测试
console.log('5. 搜索性能测试:');
const testQueries = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆'];
const startTime = Date.now();

testQueries.forEach(query => {
    geoSearch.search(query);
});

const endTime = Date.now();
const totalTime = endTime - startTime;
const avgTime = totalTime / testQueries.length;

console.log(`   测试查询数量: ${testQueries.length}`);
console.log(`   总耗时: ${totalTime}ms`);
console.log(`   平均每次查询: ${avgTime.toFixed(2)}ms`);
console.log('');

// 6. 错误处理示例
console.log('6. 错误处理示例:');
try {
    // 测试无效的adcode
    const invalidResult = geoSearch.getByAdcode(999999);
    console.log(`   无效adcode查询结果: ${invalidResult}`);
    
    // 测试空查询
    const emptyResults = geoSearch.search('');
    console.log(`   空查询结果数量: ${emptyResults.length}`);
    
    // 测试无效类型
    const invalidTypeResults = geoSearch.search('北京', { type: 'invalid' });
    console.log(`   无效类型查询结果数量: ${invalidTypeResults.length}`);
    
} catch (error) {
    console.log(`   捕获到错误: ${error.message}`);
}
console.log('');

// 7. 数据完整性检查
console.log('7. 数据完整性检查:');
const stats = geoSearch.getStats();
const totalExpected = stats.provinces + stats.cities + stats.districts;
const isDataComplete = stats.total === totalExpected;

console.log(`   省份: ${stats.provinces}`);
console.log(`   城市: ${stats.cities}`);
console.log(`   区县: ${stats.districts}`);
console.log(`   总计: ${stats.total}`);
console.log(`   数据完整性: ${isDataComplete ? '✓ 完整' : '✗ 不完整'}`);
