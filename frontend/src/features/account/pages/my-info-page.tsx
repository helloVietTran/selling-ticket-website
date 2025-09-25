import PageTitle from '@/components/page-title';
import AccountInfoCard, {
  mockData,
} from '@/features/account/components/account-info-card';

const MyInfoPage = () => {
  return (
    <>
      <PageTitle>Thông tin cá nhân</PageTitle>
      <AccountInfoCard initialData={mockData} />
    </>
  );
};

export default MyInfoPage;
