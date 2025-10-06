import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';

import OrganizerLayout from '@/layouts/organizer-layout';
import HomeLayout from '@/layouts/home-layout';
import AccountLayout from '@/layouts/account-layout';

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
import { MyInfoPage, MyTicketPage } from '@/features/account';
import NotFoundPage from '@/components/not-found';

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
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

          <Route path="/my" element={<AccountLayout />}>
            <Route path="info" element={<MyInfoPage />} />
            <Route path="tickets" element={<MyTicketPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
