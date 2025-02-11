# Ant Design Pro - 多环境配置指南

## 🚀 环境变量说明
本项目支持 **总后台** 和 **商户后台** 两种模式，使用 `ADMIN_FLAG` 和 `MERCHANT_FLAG` 来区分。

### **🔹 开发环境**
使用 `npm run start:admin` 或 `npm run start:merchant` 来启动不同的后台模式：
```bash
# 启动总后台（Admin）
npm run start:admin

# 启动商户后台（Merchant）
npm run start:merchant


export default defineConfig({
  define: {
    ADMIN_FLAG: process.env.ADMIN_FLAG || "0",
    MERCHANT_FLAG: process.env.MERCHANT_FLAG || "0",
  },
});


const isAdmin = ADMIN_FLAG === "1";
const isMerchant = MERCHANT_FLAG === "1";

return (
  <div>
    {isAdmin && <h2 style={{ color: "blue" }}>【总后台】模式</h2>}
    {isMerchant && <h2 style={{ color: "green" }}>【商户后台】模式</h2>}
  </div>
);