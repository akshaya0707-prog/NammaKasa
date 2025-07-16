import React from 'react';

function TopBar() {
  return (
    <header className="bg-gray-900 text-gray-100 flex items-center justify-between px-6 py-4 shadow-md">
      {/* Left side: Logo + App Name */}
      <div className="flex items-center space-x-3">
        <img
          src="/logo.png.png" // Place your logo in /public/logo.png
          alt="NammaKasa Logo"
          className="h-10 w-10 object-contain"
        />
        <span className="text-xl font-semibold tracking-wide">NammaKasa</span>
      </div>

      {/* Right side: Nav Links */}
      <nav>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Routes
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default TopBar;
