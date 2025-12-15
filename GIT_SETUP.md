# Git 配置指南

## 配置 Git 用戶信息

在推送代碼到 GitHub 之前，您需要配置您的 Git 用戶名和郵箱。

### 步驟 1：設置用戶名

請將 `YOUR_NAME` 替換為您的真實姓名或用戶名：

```bash
git config --global user.name "gistshu"
```

例如：
```bash
git config --global user.name "gistshu"
```

### 步驟 2：設置郵箱

請將 `YOUR_EMAIL` 替換為您的郵箱地址（建議使用與 GitHub 帳號相同的郵箱）：

```bash
git config --global user.email "gistshu@gmail.com"
```

例如：
```bash
git config --global user.email "gistshu@gmail.com"
```

### 步驟 3：驗證配置

確認配置是否正確：

```bash
git config --global user.name
git config --global user.email
```

或查看所有全局配置：

```bash
git config --global --list
```

## 僅為此專案配置（可選）

如果您只想為這個專案設置不同的用戶信息，可以使用：

```bash
cd c:\Coding\python\MarioWeb

# 為此專案設置用戶名
git config user.name "gistshu"

# 為此專案設置郵箱
git config user.email "gistshu@gmail.com"
```

## 初始化 Git 儲存庫

配置完成後，您可以初始化 Git 儲存庫：

```bash
cd c:\Coding\python\MarioWeb

# 初始化 Git
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial commit: Super Pikachu Bros game"

# 查看狀態
git status
```

## 推送到 GitHub

1. 在 GitHub 上創建新儲存庫（例如：`MarioWeb`）

2. 添加遠端儲存庫：
```bash
git remote add origin https://github.com/gistshu/MarioWeb.git
```

3. 推送代碼：
```bash
git branch -M main
git push -u origin main
```

## 常見問題

### Q: 應該使用哪個郵箱？
**A:** 建議使用與您 GitHub 帳號相同的郵箱，這樣提交記錄會自動關聯到您的 GitHub 帳號。

### Q: 如果設置錯誤怎麼辦？
**A:** 只需重新運行配置命令即可覆蓋之前的設置。

### Q: 如何查看當前配置？
**A:** 運行 `git config --global --list` 查看所有全局配置。

---

**準備好配置您的 Git 了嗎？** 🚀

請在終端中執行上述命令，將 `YOUR_NAME` 和 `YOUR_EMAIL` 替換為您的實際信息。
