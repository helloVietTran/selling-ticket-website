import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  OrganizerLayout,
  CheckInPage,
  EventsPage,
  OrdersPage,
  RevenuePage,
} from './features/organizer';
import { HomePage } from './features/home';
import { SearchPage } from './features/search';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route path="events" element={<EventsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="check-in" element={<CheckInPage />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
