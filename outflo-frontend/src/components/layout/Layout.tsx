
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="container mx-auto px-3 sm:px-4 text-center text-gray-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Campaign Spark Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
