
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sparkles, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/campaigns', 
      name: 'Campaigns', 
      icon: <Sparkles className="w-4 h-4 mr-2" /> 
    },
    { 
      path: '/generate-message', 
      name: 'Message Generator', 
      icon: <MessageSquare className="w-4 h-4 mr-2" /> 
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sparkles className="w-6 h-6 text-brand-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                Campaign Spark
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:text-brand-600 hover:bg-gray-50"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
