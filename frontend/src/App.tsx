import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OrganizerLayout from './layouts/organizer-layout';
import EventsPage from './pages/events-page';
import RevenuePage from './pages/revenue-page';
import OrdersPage from './pages/orders-page';
import CheckInPage from './pages/check-in-page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrganizerLayout />}>
          <Route path="events" element={<EventsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="check-in" element={<CheckInPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
