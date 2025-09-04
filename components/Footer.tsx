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
              <h3 className="text-lg font-semibold font-solaiman-lipi">খোঁজ সম্পর্কে</h3>
            </div>
            <p className="text-gray-300 mb-4 font-solaiman-lipi">
              খোঁজ কৃত্রিম বুদ্ধিমত্তার সাহায্যে যেকোনো দাবির সত্যতা যাচাই করে, দ্রুত ও নির্ভুল তথ্য সামনে আনে।
              আমাদের লক্ষ্য—বাংলাভাষী সমাজকে ভুয়া তথ্যের অন্ধকার থেকে মুক্ত করে সত্যের আলোয় সচেতন রাখা।
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
              <a href="https://github.com/Mahatir-Ahmed-Tusher/Khoj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-solaiman-lipi">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li>
                <a href="/factchecks" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  ফ্যাক্টচেক সমূহ
                </a>
              </li>
              <li>
                <a href="/aifactcheck" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  AI ফ্যাক্টচেক
                </a>
              </li>
              <li>
                <a href="/image-check" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  ছবি যাচাই
                </a>
              </li>
              <li>
                <a href="/text-check" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  লেখা যাচাই
                </a>
              </li>
              <li>
                <a href="/source-search" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  উৎস সন্ধান
                </a>
              </li>
              <li>
                <a href="/mukti-corner" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  মুক্তিযুদ্ধ কর্নার
                </a>
              </li>
              <li>
                <a href="/mythbusting" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  মিথবাস্টিং
                </a>
              </li>
              <li>
                <a href="/e-library" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  ই-গ্রন্থ সম্ভার
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="https://onneshon-bd.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  অন্বেষণ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-solaiman-lipi">আইনি ও সহায়তা</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  গোপনীয়তা নীতি
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  শর্তাবলী
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors font-solaiman-lipi">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-solaiman-lipi">যোগাযোগ</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 font-solaiman-lipi">
                <span className="block">ইমেইল:</span>
                <a href="mailto:mahatirtusher@gmail.com" className="text-primary-400 hover:text-primary-300">
                  mahatirtusher@gmail.com
                </a>
              </li>
              <li className="text-gray-300 font-solaiman-lipi">
                <span className="block">ঠিকানা:</span>
                <span className="text-primary-400">
                  Mirpur 12, Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-solaiman-lipi">
            © ২০২৫ খোঁজ। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  )
}
