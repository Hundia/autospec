import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-primary hover:text-primary-hover transition-colors"
            >
              TaskFlow
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-text-secondary hover:text-text transition-colors text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
