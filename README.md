# China Geo Search

中国地理数据模糊搜索工具，支持省、市、区的模糊搜索。

## 功能特性

- 🔍 支持省、市、区的模糊搜索
- 📍 提供完整的行政路径信息
- 🏷️ 支持按行政区划代码(adcode)精确查询
- 📊 提供数据统计信息
- 🚀 高性能，支持大量数据快速搜索
- 📦 零依赖，开箱即用

## 安装

```bash
npm install china-geo-search
```

## 使用方法

### 基本使用

```javascript
const { search, getByAdcode, getStats } = require('china-geo-search');

// 搜索所有类型
const results = search('北京');
console.log(results);

// 搜索特定类型
const cities = search('成都', { type: 'city' });
console.log(cities);

// 按adcode查询
const beijing = getByAdcode(110000);
console.log(beijing);

// 获取统计信息
const stats = getStats();
console.log(stats);
```

### 高级使用

```javascript
const { ChinaGeoSearch } = require('china-geo-search');

// 创建自定义实例
const geoSearch = new ChinaGeoSearch();

// 搜索并获取完整路径
const results = geoSearch.search('朝阳');
results.forEach(result => {
    console.log(`${result.name} - ${result.fullPath}`);
    console.log(`坐标: [${result.center[0]}, ${result.center[1]}]`);
});
```

## API 文档

### 搜索方法

#### `search(query, options)`

搜索地理数据

**参数:**
- `query` (string): 搜索关键词
- `options` (object, 可选): 搜索选项
  - `type` (string): 搜索类型，可选值：'all', 'province', 'city', 'district'，默认为 'all'

**返回值:**
- `Array`: 搜索结果数组，每个结果包含：
  - `name`: 名称
  - `adcode`: 行政区划代码
  - `level`: 级别 (province/city/district)
  - `center`: 中心坐标 [经度, 纬度]
  - `centroid`: 质心坐标 [经度, 纬度]
  - `parent`: 父级信息
  - `fullPath`: 完整行政路径
  - `similarity`: 相似度 (0-1)
  - `matchType`: 匹配类型

#### `getByAdcode(adcode)`

根据行政区划代码获取详细信息

**参数:**
- `adcode` (number): 行政区划代码

**返回值:**
- `Object|null`: 地理数据对象或null

#### `getStats()`

获取数据统计信息

**返回值:**
- `Object`: 包含以下属性：
  - `provinces`: 省份数量
  - `cities`: 城市数量
  - `districts`: 区县数量
  - `total`: 总数量

## 使用示例

### 搜索省份

```javascript
const { search } = require('china-geo-search');

const provinces = search('广东', { type: 'province' });
console.log(provinces);
// 输出: [{ name: '广东省', adcode: 440000, level: 'province', ... }]
```

### 搜索城市

```javascript
const cities = search('深圳', { type: 'city' });
console.log(cities);
// 输出: [{ name: '深圳市', adcode: 440300, level: 'city', ... }]
```

### 搜索区县

```javascript
const districts = search('朝阳', { type: 'district' });
console.log(districts);
// 输出: [{ name: '朝阳区', adcode: 110105, level: 'district', ... }]
```

### 获取完整行政路径

```javascript
const results = search('朝阳区');
results.forEach(result => {
    console.log(result.fullPath);
    // 输出: 北京市 > 朝阳区
});
```

## 命令行使用

```bash
# 搜索所有类型
node index.js 北京

# 搜索特定类型
node index.js 成都 city
node index.js 朝阳 district

# 查看统计信息
node index.js
```

## 数据来源

本库使用的数据来源于中国行政区划数据，包含：
- 34个省级行政区
- 333个地级市
- 2844个县级行政区

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持省、市、区模糊搜索
- 提供完整的API文档
