# QuanLyTaiChinh Backend API

Backend API cho ứng dụng quản lý tài chính cá nhân sử dụng Node.js, Express, TypeScript và MongoDB Atlas.

## 🚀 Tính năng

- **Xác thực & Phân quyền**: JWT-based authentication
- **Quản lý tài khoản**: Tài khoản cá nhân và gia đình
- **Quản lý ví**: Ví tiền mặt, ngân hàng, ví điện tử
- **Giao dịch**: Thu chi, vay mượn với đầy đủ tính năng
- **Chia hóa đơn**: Chia sẻ chi phí với nhiều người
- **Cho vay/Đi vay**: Quản lý các khoản vay với lãi suất
- **Bảo mật**: Rate limiting, helmet, CORS
- **Validation**: Comprehensive input validation
- **Error Handling**: Centralized error handling

## 🛠️ Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Development**: nodemon, ts-node

## 📦 Cài đặt

1. **Clone repository và di chuyển vào thư mục backend**:
```bash
cd backend
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Tạo file environment**:
```bash
cp .env.example .env
```

4. **Cấu hình MongoDB Atlas**:
   - Tạo cluster trên [MongoDB Atlas](https://cloud.mongodb.com/)
   - Lấy connection string và cập nhật `MONGODB_URI` trong `.env`
   - Cập nhật các biến môi trường khác

5. **Chạy development server**:
```bash
npm run dev
```

## 🔧 Scripts

```bash
# Development
npm run dev          # Chạy với nodemon
npm run build        # Build TypeScript
npm run start        # Chạy production build

# Testing & Linting
npm test            # Chạy tests
npm run lint        # Kiểm tra code style
npm run lint:fix    # Tự động fix linting issues
```

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/         # Database và cấu hình
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Entry point
├── dist/              # Compiled JavaScript
├── .env.example       # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile

### Accounts
- `GET /api/accounts` - Lấy danh sách tài khoản
- `POST /api/accounts` - Tạo tài khoản mới
- `GET /api/accounts/:id` - Lấy thông tin tài khoản

### Wallets
- `GET /api/wallets?accountId=:id` - Lấy danh sách ví
- `POST /api/wallets` - Tạo ví mới
- `PUT /api/wallets/:id` - Cập nhật ví
- `DELETE /api/wallets/:id` - Xóa ví

### Transactions
- `GET /api/transactions?accountId=:id` - Lấy danh sách giao dịch
- `POST /api/transactions` - Tạo giao dịch mới
- `PUT /api/transactions/:id` - Cập nhật giao dịch
- `DELETE /api/transactions/:id` - Xóa giao dịch

### Bill Splits
- `GET /api/bill-splits?accountId=:id` - Lấy danh sách chia hóa đơn
- `POST /api/bill-splits` - Tạo chia hóa đơn mới
- `PATCH /api/bill-splits/:id/participants/:name/payment` - Cập nhật thanh toán
- `PATCH /api/bill-splits/:id/settle` - Hoàn thành chia hóa đơn
- `DELETE /api/bill-splits/:id` - Xóa chia hóa đơn

### Loans
- `GET /api/loans?accountId=:id` - Lấy danh sách khoản vay
- `POST /api/loans` - Tạo khoản vay mới
- `PATCH /api/loans/:id/payment` - Thanh toán khoản vay
- `DELETE /api/loans/:id` - Xóa khoản vay

## 🔒 Bảo mật

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs với salt rounds cao
- **Rate Limiting**: Giới hạn requests per IP
- **Input Validation**: Comprehensive validation cho tất cả inputs
- **CORS**: Configured cho frontend domain
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data trong .env

## 🗄️ Database Schema

### Users
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  currentAccountId?: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

### Accounts
```typescript
{
  name: string
  type: 'personal' | 'family'
  ownerId: ObjectId
  members: [{
    userId: ObjectId
    role: 'admin' | 'member' | 'viewer'
    name: string
    joinedAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Wallets
```typescript
{
  accountId: ObjectId
  name: string
  type: 'cash' | 'bank' | 'e-wallet'
  balance: number
  currency: 'VND' | 'USD' | 'EUR'
  bankInfo?: string
  color: string
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

1. **Build project**:
```bash
npm run build
```

2. **Set production environment variables**

3. **Start production server**:
```bash
npm start
```

## 📝 Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...
DB_NAME=quanlytaichinh

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.