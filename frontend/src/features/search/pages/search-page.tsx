import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import FilterBar from '@/features/search/components/filter-bar';
import HomeLayout from '@/layouts/home-layout';

const SearchPage = () => {
  return (
    <HomeLayout>
      <div className="main-bg-content">
        <FilterBar />
        <EventList category="Âm nhạc" />
        <EventList wrapperClassName="mt-4" category="Nghệ thuật" />

        <EventList wrapperClassName="mt-4" category="Thể thao" />
        <EventList wrapperClassName="mt-4" category="Khác" />
      </div>
      <Footer />
    </HomeLayout>
  );
};

export default SearchPage;
