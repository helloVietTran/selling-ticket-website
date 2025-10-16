import React from 'react';
import { Link } from 'react-router-dom';

type Destination = {
  name: string;
  img: string;
  href: string;
};

const destinations: Destination[] = [
  {
    name: 'Tp. Hồ Chí Minh',
    img: '/assets/hcm.webp',
    href: '/search?province=79',
  },
  {
    name: 'Hà Nội',
    img: '/assets/hn.webp',
    href: '/search?province=01',
  },
  {
    name: 'Đà Nẵng',
    img: '/assets/dn.webp',
    href: '/search?province=48',
  },
  {
    name: 'Vị trí khác',
    img: '/assets/ot.webp',
    href: '/search?province=all',
  },
];

type DestinationCardProps = Destination;

const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  img,
  href,
}) => {
  return (
    <Link to={href} className="group relative block rounded-xl overflow-hidden">
      <img
        src={img}
        alt={name}
        className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-800/80 to-transparent p-3">
        <p className="text-white text-lg font-semibold">{name}</p>
      </div>
    </Link>
  );
};

type DestinationListProps = {
  wrapperClassName?: string;
};

const DestinationList: React.FC<DestinationListProps> = ({
  wrapperClassName = '',
}) => {
  return (
    <div className={wrapperClassName}>
      <h2 className="text-gray-400 text-base font-semibold mb-4">Điểm đến thú vị</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((d, i) => (
          <DestinationCard key={i} {...d} />
        ))}
      </div>
    </div>
  );
};

export default DestinationList;
