export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/khoj-logo.png" 
                alt="খোঁজ লোগো" 
                className="w-8 h-8 object-contain"
              />
              <h3 className="text-lg font-semibold font-tiro-bangla">খোঁজ সম্পর্কে</h3>
            </div>
            <p className="text-gray-300 mb-4 font-tiro-bangla">
            খোঁজ বাংলা ভাষার সর্বপ্রথম কৃত্রিম বুদ্ধিমত্তাভিত্তিক ফ্যাক্টচেকিং প্রতিষ্ঠান। 
            আমাদের লক্ষ্য, বাংলাভাষী সমাজকে ভুয়া তথ্যের অন্ধকার থেকে মুক্ত করে সত্যের আলোয় সচেতন রাখা।

            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61580245735019" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@khoj-factchecker" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-tiro-bangla">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li>
                <a href="/factchecks" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  ফ্যাক্টচেক সমূহ
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  AI ফ্যাক্টচেক
                </a>
              </li>
              <li>
                <a href="/image-check" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  ছবি যাচাই
                </a>
              </li>
              <li>
                <a href="/image-search" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  ছবি সার্চ
                </a>
              </li>
              <li>
                <a href="/text-check" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  লেখা যাচাই
                </a>
              </li>
              <li>
                <a href="/source-search" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  উৎস সন্ধান
                </a>
              </li>
              <li>
                <a href="/mukti-corner" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  মুক্তিযুদ্ধ কর্নার
                </a>
              </li>
              <li>
                <a href="/mythbusting" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  মিথবাস্টিং
                </a>
              </li>
              <li>
                <a href="/e-library" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  ই-গ্রন্থ সম্ভার
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  আমাদের সম্পর্কে
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-tiro-bangla">সহায়তা</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  গোপনীয়তা নীতি
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  শর্তাবলী
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/how-to-write" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  লেখা পাঠানোর নিয়ম
                </a>
              </li>
              <li>
                <a href="/api-docs" className="text-gray-300 hover:text-white transition-colors font-tiro-bangla">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-tiro-bangla">যোগাযোগ</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 font-tiro-bangla">
                <span className="block">ইমেইল:</span>
                <a href="mailto:fact@khoj-bd.com" className="text-primary-400 hover:text-primary-300">
                  fact@khoj-bd.com
                </a>
              </li>
              <li className="text-gray-300 font-tiro-bangla">
                <span className="block">ঠিকানা:</span>
                <span className="text-primary-400">
                  E-14/X, ICT Tower, Agargaon, Dhaka-1207
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-tiro-bangla">
            © ২০২৫ খোঁজ। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  )
}