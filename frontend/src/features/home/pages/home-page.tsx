import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import HomeLayout from '@/layouts/home-layout';
import Navigation from '@/components/navigation';
import EventSlider from '@/components/event-slider';


export default function HomePage() {
  return (
    <HomeLayout>
      <Navigation />
      <div className="main-bg-content">
        <EventSlider />
        <EventList category="Âm nhạc" />
        <EventList wrapperClassName="mt-4" category="Nghệ thuật" />

        <EventList wrapperClassName="mt-4" category="Thể thao" />
        <EventList wrapperClassName="mt-4" category="Khác" />
      </div>
      <Footer />
    </HomeLayout>
  );
}
