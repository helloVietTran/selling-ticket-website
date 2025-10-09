import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import EventSlider from '@/components/event-slider';
import { EventCategory } from '@/constant';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <div className="bg-main-content">
        <div className="main-container">
          <EventSlider />

          <EventList wrapperClassName="mt-4" category={EventCategory.SPORT} />


        </div>
      </div>
      <Footer />
    </>
  );
}
