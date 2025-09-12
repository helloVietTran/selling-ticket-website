import { Link } from 'react-router-dom';

type Category = {
  label: string;
  value: string;
};

const categories: Category[] = [
  { label: 'Âm nhạc', value: 'music' },
  { label: 'Nghệ thuật', value: 'art' },
  { label: 'Thể Thao', value: 'sport' },
  { label: 'Khác', value: 'other' },
];

const Navigation = () => {
  return (
    <div className=" bg-black">
      <nav className="navigation-container py-5">
        <ul className="flex gap-8 text-gray-100 text-sm font-medium">
          {categories.map(cat => (
            <li key={cat.value}>
              <Link
                to={`/search?category=${cat.value}`}
                className="hover:text-emerald-400 transition-colors">
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
