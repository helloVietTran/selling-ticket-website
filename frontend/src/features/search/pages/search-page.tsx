import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import FilterBar from '@/features/search/components/filter-bar';

const SearchPage = () => {
  return (
    <>
      <div className="main-bg-content">
        <FilterBar />
        <EventList category="Âm nhạc" />
        <EventList wrapperClassName="mt-4" category="Nghệ thuật" />

        <EventList wrapperClassName="mt-4" category="Thể thao" />
        <EventList wrapperClassName="mt-4" category="Khác" />
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
