/**
 * 测试文件
 */

const { search, getByAdcode, getStats, ChinaGeoSearch } = require('./index.js');

console.log('=== 中国地理数据搜索工具 - 测试 ===\n');

// 测试1: 基本搜索功能
console.log('测试1: 基本搜索功能');
try {
    const results = search('北京');
    console.log(`✓ 搜索"北京"成功，找到 ${results.length} 个结果`);
    
    if (results.length > 0) {
        const firstResult = results[0];
        console.log(`  第一个结果: ${firstResult.name} (${firstResult.level})`);
        console.log(`  完整路径: ${firstResult.fullPath}`);
    }
} catch (error) {
    console.log(`✗ 搜索失败: ${error.message}`);
}
console.log('');

// 测试2: 按类型搜索
console.log('测试2: 按类型搜索');
try {
    const provinces = search('广东', { type: 'province' });
    const cities = search('深圳', { type: 'city' });
    const districts = search('朝阳', { type: 'district' });
    
    console.log(`✓ 省份搜索: 找到 ${provinces.length} 个结果`);
    console.log(`✓ 城市搜索: 找到 ${cities.length} 个结果`);
    console.log(`✓ 区县搜索: 找到 ${districts.length} 个结果`);
} catch (error) {
    console.log(`✗ 按类型搜索失败: ${error.message}`);
}
console.log('');

// 测试3: adcode查询
console.log('测试3: adcode查询');
try {
    const beijing = getByAdcode(110000);
    const shanghai = getByAdcode(310000);
    const invalid = getByAdcode(999999);
    
    if (beijing) {
        console.log(`✓ 北京查询成功: ${beijing.name}`);
    } else {
        console.log('✗ 北京查询失败');
    }
    
    if (shanghai) {
        console.log(`✓ 上海查询成功: ${shanghai.name}`);
    } else {
        console.log('✗ 上海查询失败');
    }
    
    if (invalid === null) {
        console.log('✓ 无效adcode查询正确返回null');
    } else {
        console.log('✗ 无效adcode查询应该返回null');
    }
} catch (error) {
    console.log(`✗ adcode查询失败: ${error.message}`);
}
console.log('');

// 测试4: 统计信息
console.log('测试4: 统计信息');
try {
    const stats = getStats();
    console.log(`✓ 统计信息获取成功:`);
    console.log(`  省份: ${stats.provinces}`);
    console.log(`  城市: ${stats.cities}`);
    console.log(`  区县: ${stats.districts}`);
    console.log(`  总计: ${stats.total}`);
    
    if (stats.total > 0) {
        console.log('✓ 数据加载正常');
    } else {
        console.log('✗ 数据未加载');
    }
} catch (error) {
    console.log(`✗ 统计信息获取失败: ${error.message}`);
}
console.log('');

// 测试5: 自定义实例
console.log('测试5: 自定义实例');
try {
    const customSearch = new ChinaGeoSearch();
    const results = customSearch.search('成都');
    console.log(`✓ 自定义实例搜索成功，找到 ${results.length} 个结果`);
} catch (error) {
    console.log(`✗ 自定义实例测试失败: ${error.message}`);
}
console.log('');

// 测试6: 错误处理
console.log('测试6: 错误处理');
try {
    // 测试空查询
    const emptyResults = search('');
    if (emptyResults.length === 0) {
        console.log('✓ 空查询正确处理');
    } else {
        console.log('✗ 空查询应该返回空数组');
    }
    
    // 测试无效类型
    const invalidTypeResults = search('北京', { type: 'invalid' });
    console.log(`✓ 无效类型查询处理: 找到 ${invalidTypeResults.length} 个结果`);
    
} catch (error) {
    console.log(`✗ 错误处理测试失败: ${error.message}`);
}
console.log('');

// 测试7: 性能测试
console.log('测试7: 性能测试');
try {
    const testQueries = ['北京', '上海', '广州', '深圳', '杭州'];
    const startTime = Date.now();
    
    testQueries.forEach(query => {
        search(query);
    });
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / testQueries.length;
    
    console.log(`✓ 性能测试完成:`);
    console.log(`  查询数量: ${testQueries.length}`);
    console.log(`  总耗时: ${totalTime}ms`);
    console.log(`  平均每次: ${avgTime.toFixed(2)}ms`);
    
    if (avgTime < 10) {
        console.log('✓ 性能良好');
    } else {
        console.log('⚠ 性能需要优化');
    }
} catch (error) {
    console.log(`✗ 性能测试失败: ${error.message}`);
}
console.log('');

console.log('=== 测试完成 ===');
