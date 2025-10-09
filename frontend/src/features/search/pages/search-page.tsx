import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import FilterBar from '@/features/search/components/filter-bar';

const SearchPage = () => {
  return (
    <>
      <div className="bg-main-content py-4">
        <div className="main-container">
          <FilterBar />
          <EventList />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
