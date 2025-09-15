interface PageTitleProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageTitle({ icon, children }: PageTitleProps) {
  return (
    <h1 className="text-2xl font-bold flex items-center gap-2">
      {icon}
      {children}
    </h1>
  );
}
