# GitHub Pages 部署指南

## 📦 部署到 GitHub Pages

### 步驟 1：初始化 Git 儲存庫

在專案目錄中執行：

```bash
cd c:\Coding\python\MarioWeb
git init
git add .
git commit -m "Initial commit: Super Pikachu Bros game"
```

### 步驟 2：創建 GitHub 儲存庫

1. 前往 [GitHub](https://github.com)
2. 點擊右上角的 "+" > "New repository"
3. 命名儲存庫（例如：`super-pikachu-bros`）
4. **不要**初始化 README、.gitignore 或 license（因為本地已有）
5. 點擊 "Create repository"

### 步驟 3：推送到 GitHub

```bash
# 添加遠端儲存庫（替換為您的 GitHub 用戶名）
git remote add origin https://github.com/gistshu/super-pikachu-bros.git

# 推送代碼
git branch -M main
git push -u origin main
```

### 步驟 4：啟用 GitHub Pages

1. 進入您的 GitHub 儲存庫頁面
2. 點擊 "Settings" 標籤
3. 在左側選單中找到 "Pages"
4. 在 "Source" 部分：
   - Branch: 選擇 `main`
   - Folder: 選擇 `/ (root)`
5. 點擊 "Save"

### 步驟 5：訪問您的遊戲

幾分鐘後，您的遊戲將在以下網址上線：

```
https://YOUR_USERNAME.github.io/super-pikachu-bros/
```

GitHub 會在 Settings > Pages 顯示確切的 URL。

## 🔧 自定義域名（可選）

如果您有自己的域名：

1. 在 GitHub Pages 設定中，在 "Custom domain" 欄位輸入您的域名
2. 在您的域名服務商設置 CNAME 記錄指向 `YOUR_USERNAME.github.io`

## 📝 更新遊戲

每次修改代碼後，只需：

```bash
git add .
git commit -m "Update game"
git push
```

GitHub Pages 會自動更新。

## ✅ 檢查清單

- [x] README.md - 專案說明
- [x] .gitignore - 排除不必要的檔案
- [x] .nojekyll - 防止 Jekyll 處理
- [x] index.html - 主頁面
- [x] style.css - 樣式表
- [x] game.js - 遊戲引擎
- [x] entities.js - 遊戲實體
- [x] level.js - 關卡設計
- [x] assets.js - 資源管理

## 🎮 測試

部署後，請測試：
- ✅ 遊戲可以正常載入
- ✅ 投幣功能正常
- ✅ 遊戲控制正常運作
- ✅ 在不同裝置上測試（桌面、平板、手機）

## 🐛 故障排除

### 遊戲無法載入
- 檢查瀏覽器控制台是否有錯誤
- 確認所有 JavaScript 檔案路徑正確
- 清除瀏覽器緩存後重試

### GitHub Pages 未更新
- 等待 5-10 分鐘讓 GitHub 建置
- 檢查 Actions 標籤查看建置狀態
- 清除瀏覽器緩存

### 404 錯誤
- 確認儲存庫設定為 Public
- 檢查 Settings > Pages 是否正確設定
- 確認分支名稱為 `main`

---

**準備好了嗎？現在就部署您的遊戲吧！** 🚀
