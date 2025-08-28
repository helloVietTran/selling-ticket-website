

## 📂 Cấu trúc thư mục

```
\---src
    |   app.js
    |   server.js
    |
    +---config
    |       config.js
    |       data-source.js
    |       db.js
    |       
    +---controllers
    |       auth.controller.js
    |       
    +---middlewares
    +---models
    |       Attendee.model.js
    |       Organizer.model.js
    |       Role.model.js
    |       User.model.js
    |       
    +---routes
    |       auth.route.js
    |       index.js
    |       
    \---validators

```

---

## 🔑 Giải thích nhanh

- **app.js**  
  - Tạo instance `express()`, cấu hình middleware (`morgan`, `cors`, body-parser), đăng ký route.  

- **server.js**  
  - Import `app` và start server, điểm bắt đầu của dự án

- **config/**  
  - `config.js`: đọc `.env` và chuẩn hóa config chung.  
  - `data-source.js`: cấu hình TypeORM (database, entities, migrations).  
  - `db.js`: khởi tạo và quản lý kết nối DB.  

- **controllers/**  
  - Chứa logic nghiệp vụ của từng route (ví dụ: login, register).  

- **middlewares/**  
  - Xử lý request trước khi vào controller (auth, validate, error handler).  

- **models/**  
  - Định nghĩa entity TypeORM (mapping với bảng DB).  

- **routes/**  
  - Khai báo API endpoint, mapping tới controller tương ứng.  

- **validators/**  
  - Chứa logic validate dữ liệu đầu vào.  


- **.env**  
  - Chứa biến môi trường: PORT, DB config, JWT secret, API prefix/version,…  
  - Không được public

---

## Cài và Chạy dự án

```bash
# clone dự án
git clone https://github.com/helloVietTran/booking-event-and-buying-ticket-web

# di chuyển tới thư mục dự án
cd booking-event-and-buying-ticket-web/backend

# cài dependencies
npm install

# Tạo file .env và cấu hình
cp .env

npm run dev

