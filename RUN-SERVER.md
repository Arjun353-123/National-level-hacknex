# 🚀 How to Run the Server

## The Problem
The `next` command is not found in your system PATH. This is a common issue with npm global installs on Windows.

## ✅ Solution: Run Directly from Terminal

### Option 1: Using Visual Studio Code Terminal (RECOMMENDED)
1. Open VS Code in this folder
2. Open a new terminal (Terminal → New Terminal)
3. Type: `npm run dev`
4. Press Enter

VS Code's integrated terminal usually handles npm paths better.

### Option 2: Using PowerShell with npx
1. Open PowerShell in this folder
2. Type: `npx --yes next@14.2.0 dev`
3. Press Enter
4. Wait for it to start (may take 30-60 seconds first time)

### Option 3: Using CMD (Command Prompt)
1. Open Command Prompt (cmd.exe) in this folder
2. Type: `npm run dev`
3. Press Enter

## ✅ What You Should See

When it works, you'll see:
```
> medical-image-intelligence@1.0.0 dev
> next dev

  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

## 🌐 Then Open Your Browser

Go to: **http://localhost:3000**

---

## 📝 Test Credentials

**Admin:** 
- Email: `admin@hospital.com`
- Password: anything

**Patient:**
- Email: `patient@email.com`  
- Password: anything

---

## 🐛 Still Not Working?

Try installing Next.js globally:
```bash
npm install -g next
```

Then run:
```bash
npm run dev
```

---

## 💡 Alternative: Use Yarn

If npm continues to have issues:
```bash
# Install yarn globally
npm install -g yarn

# Then use yarn
yarn dev
```

---

Happy coding! 🎉
