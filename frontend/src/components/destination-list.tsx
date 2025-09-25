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
    img:
      'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2Ff9%2F65%2F0a%2F820ff0dd8178de627b64574b8a475fee.png&w=1920&q=75',
    href: 'search.html?location=tp-ho-chi-minh',
  },
  {
    name: 'Hà Nội',
    img:
      'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F8c%2F60%2F7e%2F9cfb9b5c032a63acd87599a23871b2c7.png&w=1920&q=75',
    href: 'search.html?location=ha-noi',
  },
  {
    name: 'Đà Lạt',
    img:
      'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F87%2Fa5%2Fca%2Fc85260e784845d634bb8a4a8070238ab.png&w=1920&q=75',
    href: 'search.html?location=da-lat',
  },
  {
    name: 'Vị trí khác',
    img:
      'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F24%2F27%2F08%2F683a9d51b6011b6081815cf2409918f1.png&w=1920&q=75',
    href: 'search.html?location=vi-tri-khac',
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
      <h2 className="text-white text-base font-normal mb-4">Điểm đến thú vị</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((d, i) => (
          <DestinationCard key={i} {...d} />
        ))}
      </div>
    </div>
  );
};

export default DestinationList;
