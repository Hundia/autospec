import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
          TaskFlow &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default Layout;
