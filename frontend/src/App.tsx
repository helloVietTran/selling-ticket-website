import { BrowserRouter, Routes, Route } from 'react-router-dom';

import OrganizerLayout from '@/layouts/organizer-layout';
import HomeLayout from '@/layouts/home-layout';

import {
  CheckinPage,
  EventsPage,
  OrdersPage,
  RevenuePage,
} from '@/features/organizer';
import { HomePage } from '@/features/home';
import { SearchPage } from '@/features/search';
import { EventDetailPage } from '@/features/event-detail';
import { SelectTicketPage } from '@/features/select-ticket';
import { BookingPage } from '@/features/booking';
import { CreateEventPage } from '@/features/create-event';
import MyInfoPage from './features/my-ticket';
import MyTicketPage from './features/my-info';
import NotFoundPage from './components/not-found';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route
            path="/events/:id/select-ticket"
            element={<SelectTicketPage />}
          />
          <Route path="/events/:id/bookings/:id" element={<BookingPage />} />
        </Route>

        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route path="create-event" element={<CreateEventPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="check-in" element={<CheckinPage />} />
        </Route>


        <Route path="/my/info" element={<MyInfoPage />} />
        <Route path="/my/tickets" element={<MyTicketPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
