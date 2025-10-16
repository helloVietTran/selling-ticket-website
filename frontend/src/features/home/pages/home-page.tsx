import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import EventSlider from '@/components/event-slider';
import { EventCategory } from '@/constant';
import DestinationList from '@/components/destination-list';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <div className="bg-main-content">
        <div className="main-container pb-6">
          <EventSlider />

          <EventList category={EventCategory.ART} />
          <EventList category={EventCategory.MUSIC} />
          <EventList category={EventCategory.SPORT} />
          <EventList category={EventCategory.OTHER} />

          <DestinationList />
        </div>
      </div>
      <Footer />
    </>
  );
}
