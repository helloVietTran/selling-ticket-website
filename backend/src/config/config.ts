import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
  });
}

export const config = {
  env_name: process.env.NODE_ENV!,
  port: process.env.PORT!,
  jwt_secret: process.env.JWT_SECRET!,
  refresh_secret: process.env.REFRESH_SECRET!,
  api_prefix: process.env.API_PREFIX!,
  api_version: process.env.API_VERSION!,
  db: {
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
    user: process.env.DB_USER!,
    pass: process.env.DB_PASS!,
    name: process.env.DB_NAME!
  },
  admin: {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!
  },
  resource_path: process.env.RESOURCE_PATH,
  vnp: {
    vnp_TmnCode: process.env.vnp_TmnCode,
    vnp_HashSecret: process.env.vnp_HashSecret,
    payment_api: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    query_transaction_api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
  }
};
