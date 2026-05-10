import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Branding & Contact */}
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              El Reno Nail Spa
            </h2>
            <p className="text-gray-400 mb-6 italic">Nail Perfection, Every Time ✨</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start text-gray-300 hover:text-white transition">
                <i className="fas fa-map-marker-alt mr-3 text-red-500 mt-1 flex-shrink-0" />
                <p>1605 Investors Ave, El Reno, OK 73036</p>
              </div>
              <div className="flex items-start text-gray-300 hover:text-white transition">
                <i className="fas fa-phone-alt mr-3 text-red-500 mt-1 flex-shrink-0" />
                <a href="tel:14056665565" className="hover:text-red-400 transition">
                  (405) 666-5565
                </a>
              </div>
              <div className="flex items-start text-gray-300 hover:text-white transition">
                <i className="fas fa-envelope mr-3 text-red-500 mt-1 flex-shrink-0" />
                <a href="mailto:elrenonailspa@gmail.com" className="hover:text-red-400 transition">
                  elrenonailspa@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <i className="fas fa-clock mr-2 text-red-500" />
                Hours
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gray-300">12:00 PM – 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Mon – Sat</span>
                  <span className="text-gray-300">10:00 AM – 7:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:pl-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/appointment" className="text-gray-400 hover:text-red-400 transition duration-300 flex items-center">
                  <i className="fas fa-calendar-check mr-2 text-red-500/60" />
                  Appointments
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-red-400 transition duration-300 flex items-center">
                  <i className="fas fa-spa mr-2 text-red-500/60" />
                  Services
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-red-400 transition duration-300 flex items-center">
                  <i className="fas fa-image mr-2 text-red-500/60" />
                  Gallery
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-red-400 transition duration-300 flex items-center">
                  <i className="fas fa-envelope mr-2 text-red-500/60" />
                  Contact
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-400 hover:text-red-400 transition duration-300 flex items-center">
                  <i className="fas fa-lock mr-2 text-red-500/60" />
                  Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Info */}
          <div className="md:pl-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Follow Us
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Connect with us on social media for updates, promotions, and nail inspiration!
            </p>
            <div className="flex space-x-4 mb-8">
              <a
                href="https://www.facebook.com/elrenonailspa/"
                className="w-12 h-12 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-110"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f text-lg" />
              </a>
              <a
                href="https://www.instagram.com/elrenonailspa/"
                className="w-12 h-12 bg-gray-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-110"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram text-lg" />
              </a>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                ⭐ 5-Star Rated Service
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                📍 Serving El Reno, OK with pride
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider & Copyright */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} El Reno Nail Spa. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-3">
            Crafted with care and attention to detail, just like your nails. 💅
          </p>
        </div>
      </div>
    </footer>
  );
}
