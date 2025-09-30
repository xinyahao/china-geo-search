# 发布指南

## 发布到 npm

### 1. 准备工作

确保你已经完成了以下步骤：

1. 在 [npmjs.com](https://www.npmjs.com) 注册账号
2. 在终端中登录 npm：
   ```bash
   npm login
   ```

### 2. 更新版本号

在发布新版本之前，更新 `package.json` 中的版本号：

```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 小版本 (1.0.0 -> 1.1.0)
npm version minor

# 大版本 (1.0.0 -> 2.0.0)
npm version major
```

### 3. 发布到 npm

```bash
# 发布到 npm
npm publish

# 如果是第一次发布，可能需要添加 --access public
npm publish --access public
```

### 4. 验证发布

发布成功后，可以通过以下方式验证：

1. 访问 [npmjs.com](https://www.npmjs.com) 搜索你的包名
2. 在另一个项目中安装测试：
   ```bash
   npm install china-geo-search
   ```

## 发布到 GitHub

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建新仓库
2. 更新 `package.json` 中的 repository 字段

### 2. 推送代码

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/yourusername/china-geo-search.git

# 推送到 GitHub
git push -u origin main
```

### 3. 创建 Release

1. 在 GitHub 仓库页面点击 "Releases"
2. 点击 "Create a new release"
3. 填写版本号和发布说明
4. 点击 "Publish release"

## 发布检查清单

在发布之前，请确保：

- [ ] 所有测试通过
- [ ] README.md 文档完整
- [ ] package.json 信息正确
- [ ] 版本号已更新
- [ ] 代码已提交到 git
- [ ] 没有敏感信息泄露

## 维护指南

### 更新依赖

```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update

# 更新特定依赖
npm install package-name@latest
```

### 处理 Issue 和 PR

1. 及时回复 Issue
2. 审查 Pull Request
3. 合并后更新版本号
4. 发布新版本

### 版本管理

建议使用语义化版本控制：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

## 常见问题

### Q: 发布时提示包名已存在
A: 需要修改 `package.json` 中的 `name` 字段为唯一名称

### Q: 发布失败提示权限问题
A: 确保已经登录 npm 并且有发布权限

### Q: 如何撤销发布
A: 在 24 小时内可以使用 `npm unpublish` 撤销

### Q: 如何更新已发布的版本
A: 修改版本号后重新发布即可
