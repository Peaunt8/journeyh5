# 轻游迹 TripLite

一个轻量级的旅行规划 H5 应用，支持用户注册登录、多出行计划管理、行程规划和打包清单功能。

## 功能特性

- 🔐 用户注册/登录（手机号 + 密码）
- 📋 多出行计划管理（每个计划相互隔离）
- 📍 目的地信息管理
- 📅 每日行程安排
- 📝 备注事项记录
- 🎒 打包清单（带进度追踪）
- 🌐 中英文切换
- 💾 数据云端存储（Supabase）

## 快速开始

### 方式 1：使用 Supabase 云端数据库（推荐）

#### 步骤 1：创建 Supabase 项目
1. 访问 https://supabase.com
2. 注册/登录账号
3. 创建新项目（免费套餐足够使用）

#### 步骤 2：初始化数据库
1. 进入项目控制台
2. 点击左侧 **SQL Editor**
3. 新建查询，粘贴 `supabase-init.sql` 文件内容
4. 点击 **Run** 执行

#### 步骤 3：配置认证
1. 进入 **Authentication** -> **Providers**
2. 启用 **Phone** 登录方式
3. 在 **Settings** -> **Auth** 中添加测试用户（可选）

#### 步骤 4：获取 API 密钥
1. 进入 **Settings** -> **API**
2. 复制以下两个值：
   - Project URL
   - anon/public key

#### 步骤 5：修改 HTML 文件
打开 `travel-planner.html`，找到约第 530 行：

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

替换为你自己的 Supabase 项目信息。

### 方式 2：本地存储模式（无需数据库）

如果不配置 Supabase，应用会自动切换到本地存储模式：
- 用户数据存储在浏览器 localStorage
- 适合演示和本地测试
- 数据不会同步到其他设备

## 部署

### GitHub Pages
1. 将文件推送到 GitHub 仓库
2. 进入仓库 Settings -> Pages
3. 选择 main 分支，保存
4. 访问 `https://用户名.github.io/仓库名/travel-planner.html`

### Vercel / Netlify
直接拖拽项目文件夹到 Vercel 或 Netlify 即可自动部署。

## 开发与发布流程

### 回归测试（发布前必做）

在每次发布代码前，必须运行回归测试验证所有核心功能：

```bash
# 方式 1：直接运行测试
node regression-test.js

# 方式 2：运行完整的预发布验证流程
# Windows
pre-release.bat

# Linux/Mac
./pre-release.sh
```

### 回归测试检查项

| 测试项 | 说明 |
|--------|------|
| ✅ 核心文件存在性 | index.html, supabase-init.sql 存在 |
| ✅ Supabase 配置 | URL 和 Key 正确配置 |
| ✅ 认证函数 | handleLogin, handleRegister, getUserId 存在 |
| ✅ 登录错误处理 | 错误提示、解构赋值正确 |
| ✅ 注册流程验证 | 手机号、密码长度、验证码验证 |
| ✅ SQL 脚本完整性 | 三张表和触发器都已创建 |
| ✅ 背景图配置 | 沙滩背景图 URL 正确 |
| ✅ 中英文支持 | 切换函数和数据属性完整 |
| ✅ 出行计划管理 | 列表渲染、创建、ID 获取正确 |
| ✅ 会话验证 | checkAuth 和 getSession 调用正确 |

### 发布步骤

1. **运行回归测试** - 确保所有测试通过
2. **提交更改** - `git add -A && git commit -m "描述"`
3. **推送到 GitHub** - `git push`
4. **验证部署** - 访问 GitHub Pages 检查更新

### 自动化脚本

- `regression-test.js` - 回归测试脚本（10 项自动化测试）
- `pre-release.bat` - Windows 预发布验证脚本（测试 + 提交 + 推送）
- `test-report.json` - 测试报告（自动生成）

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `travel-planner.html` | 主应用文件 |
| `supabase-init.sql` | Supabase 数据库初始化脚本 |
| `README.md` | 本说明文档 |

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- Supabase (PostgreSQL + Auth)
- 本地存储兼容模式

## 注意事项

1. **验证码**：演示版本中验证码固定为 `123456`
2. **密码**：要求至少 6 位字符
3. **数据隔离**：每个用户只能看到自己的出行计划
4. **自动保存**：修改行程/清单时自动保存到数据库

## 开发说明

### 数据结构

**trips 表**
- `id`: UUID
- `user_id`: 用户 ID（手机号或 auth.uid）
- `name`: 计划名称
- `destination`: 目的地
- `start_date/end_date`: 出行日期

**trip_data 表**
- `trip_id`: 关联 trips.id
- `checklist`: JSONB 存储打包清单
- `custom_items`: JSONB 存储自定义物品
- `day_plans`: JSONB 存储每日行程
- `notes`: 备注
- `destination`: 目的地详情

### 添加新功能
直接在 HTML 文件中修改即可，所有代码都在单个文件中。

## License

MIT
