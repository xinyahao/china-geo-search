/**
 * 基本使用示例
 */

const { search, getByAdcode, getStats } = require('../index.js');

console.log('=== 中国地理数据搜索工具 - 基本使用示例 ===\n');

// 1. 获取统计信息
console.log('1. 数据统计信息:');
const stats = getStats();
console.log(`   省份数量: ${stats.provinces}`);
console.log(`   城市数量: ${stats.cities}`);
console.log(`   区县数量: ${stats.districts}`);
console.log(`   总数量: ${stats.total}\n`);

// 2. 搜索省份
console.log('2. 搜索省份 "广东":');
const provinces = search('广东', { type: 'province' });
provinces.forEach((province, index) => {
    console.log(`   ${index + 1}. ${province.name} (${province.adcode})`);
    console.log(`      坐标: [${province.center[0]}, ${province.center[1]}]`);
    console.log(`      完整路径: ${province.fullPath}`);
});
console.log('');

// 3. 搜索城市
console.log('3. 搜索城市 "深圳":');
const cities = search('深圳', { type: 'city' });
cities.forEach((city, index) => {
    console.log(`   ${index + 1}. ${city.name} (${city.adcode})`);
    console.log(`      坐标: [${city.center[0]}, ${city.center[1]}]`);
    console.log(`      完整路径: ${city.fullPath}`);
});
console.log('');

// 4. 搜索区县
console.log('4. 搜索区县 "朝阳":');
const districts = search('朝阳', { type: 'district' });
districts.forEach((district, index) => {
    console.log(`   ${index + 1}. ${district.name} (${district.adcode})`);
    console.log(`      坐标: [${district.center[0]}, ${district.center[1]}]`);
    console.log(`      完整路径: ${district.fullPath}`);
});
console.log('');

// 5. 搜索所有类型
console.log('5. 搜索所有类型 "北京":');
const allResults = search('北京');
allResults.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.name} (${result.level}) - ${result.adcode}`);
    console.log(`      完整路径: ${result.fullPath}`);
});
console.log('');

// 6. 根据adcode查询
console.log('6. 根据adcode查询 110000 (北京市):');
const beijing = getByAdcode(110000);
if (beijing) {
    console.log(`   名称: ${beijing.name}`);
    console.log(`   级别: ${beijing.level}`);
    console.log(`   坐标: [${beijing.center[0]}, ${beijing.center[1]}]`);
    console.log(`   子级数量: ${beijing.childrenNum}`);
} else {
    console.log('   未找到对应的数据');
}
