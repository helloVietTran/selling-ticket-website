import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrganizerLayout, CheckInPage, EventsPage, OrdersPage, RevenuePage } from './features/organizer';

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
