import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

// Map url segments -> tiếng Việt
const LABELS: Record<string, string> = {
  '': 'Trang chủ',
  account: 'Tài khoản',
  settings: 'Cài đặt tài khoản',
  info: 'Thông tin tài khoản',
  tickets: 'Vé của tôi',
  events: 'Sự kiện của tôi',
  my: 'Cá nhân',
};

export default function BreadcrumbShadcn() {
  const location = useLocation();
  const rawSegments = location.pathname.split('/').filter(Boolean);

  const crumbs = [{ to: '/', label: LABELS[''] }];
  rawSegments.reduce((acc, seg) => {
    const next = `${acc}/${seg}`.replace('//', '/');
    crumbs.push({ to: next, label: LABELS[seg] ?? seg });
    return next;
  }, '');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <BreadcrumbItem key={c.to}>
              {isLast ? (
                <BreadcrumbPage className="font-medium text-white">
                  {c.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="text-gray-400 hover:text-white transition">
                  <Link to={c.to}>{c.label}</Link>
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator className="text-gray-400" />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
