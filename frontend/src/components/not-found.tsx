import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8">
        <h1 className="text-6xl md:text-9xl font-bold text-indigo-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold mb-2">
          Trang không tồn tại
        </h2>
        <p className="text-md md:text-lg text-gray-600 mb-8">
          Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-300">
          Về trang chủ
        </Link>
      </div>
      <div className="mt-8 text-center">
        <svg
          className="w-32 h-32 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;
