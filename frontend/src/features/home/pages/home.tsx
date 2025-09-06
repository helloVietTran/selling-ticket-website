import EventList from '@/components/event-list';
import Footer from '@/components/footer';
import HomeLayout from '@/layouts/home-layout';
import Navigation from '@/features/home/components/navigation';

export default function Home() {
  return (
    <HomeLayout>
      <Navigation />

      <div className="p-4 bg-[#272729] ">
        <EventList category="Âm nhạc" />
        <EventList wrapperClassName="mt-4" category="Nghệ thuật" />

        <EventList wrapperClassName="mt-4" category="Thể thao" />
        <EventList wrapperClassName="mt-4" category="Khác" />
      </div>
      <Footer />
    </HomeLayout>
  );
}
