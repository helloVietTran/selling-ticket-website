import { Link } from 'react-router-dom';

type Category = {
  label: string;
  value: string;
};

const categories: Category[] = [
  { label: 'Âm nhạc', value: 'music' },
  { label: 'Nghệ thuật', value: 'art' },
  { label: 'Thể Thao', value: 'sports' },
  { label: 'Khác', value: 'other' },
];

export default function Navigation() {
  return (
    <div className=" bg-black">
      <nav className="header-container !py-4">
        <ul className="flex gap-8 text-white text-sm">
          {categories.map(cat => (
            <li key={cat.value}>
              <Link
                to={`/search?category=${cat.value}`}
                className="hover:text-emerald-400 transition-colors"
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
