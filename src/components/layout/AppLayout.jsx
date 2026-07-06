import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-navy">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
