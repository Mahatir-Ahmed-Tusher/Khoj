import Link from 'next/link'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-times-now">শর্তাবলী</h1>
            <p className="text-gray-600 font-tiro-bangla">সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>
          </div>

          <div className="prose prose-lg max-w-none font-tiro-bangla">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">১. পরিষেবার বিবরণ</h2>
              <p className="text-gray-700 mb-4">
                খোঁজ (Khoj) একটি কৃত্রিম বুদ্ধিমত্তা-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম যা ব্যবহারকারীদের যেকোনো দাবির সত্যতা যাচাই করতে সাহায্য করে। আমাদের পরিষেবার মধ্যে রয়েছে:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>টেক্সট-ভিত্তিক ফ্যাক্টচেকিং</li>
                <li>ছবি যাচাইকরণ</li>
                <li>উৎস সন্ধান</li>
                <li>মিথবাস্টিং</li>
                <li>মুক্তিযুদ্ধ কর্নার</li>
                <li>ই-গ্রন্থ সম্ভার</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">২. ব্যবহারের শর্তাবলী</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-times-now">২.১ গ্রহণযোগ্য ব্যবহার</h3>
                  <p className="text-gray-700 mb-2">আপনি আমাদের পরিষেবা নিম্নলিখিত উদ্দেশ্যে ব্যবহার করতে পারেন:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>তথ্যের সত্যতা যাচাই</li>
                    <li>গবেষণা এবং শিক্ষামূলক উদ্দেশ্য</li>
                    <li>ব্যক্তিগত তথ্য যাচাই</li>
                    <li>সামাজিক মিডিয়ায় প্রচারিত তথ্য যাচাই</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-times-now">২.২ নিষিদ্ধ ব্যবহার</h3>
                  <p className="text-gray-700 mb-2">নিম্নলিখিত ব্যবহার নিষিদ্ধ:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>অবৈধ উদ্দেশ্যে ব্যবহার</li>
                    <li>অন্য ব্যবহারকারীদের ক্ষতি করা</li>
                    <li>সিস্টেমের নিরাপত্তা ভঙ্গ করা</li>
                    <li>স্প্যাম বা ক্ষতিকারক কনটেন্ট আপলোড</li>
                    <li>কপিরাইট লঙ্ঘন</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৩. ব্যবহারকারী দায়িত্ব</h2>
              <p className="text-gray-700 mb-4">ব্যবহারকারীদের নিম্নলিখিত দায়িত্ব রয়েছে:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>সঠিক এবং সত্য তথ্য প্রদান</li>
                <li>অন্য ব্যবহারকারীদের অধিকার সম্মান করা</li>
                <li>আমাদের পরিষেবার নিরাপত্তা রক্ষা করা</li>
                <li>আইন মেনে চলা</li>
                <li>পরিষেবার সীমাবদ্ধতা বুঝে নেওয়া</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৪. বুদ্ধিমত্তা সম্পত্তি</h2>
              <p className="text-gray-700 mb-4">
                খোঁজ ওয়েবসাইটের সমস্ত কনটেন্ট, ডিজাইন, লোগো এবং সফটওয়্যার আমাদের বুদ্ধিমত্তা সম্পত্তি। 
                এই সমস্ত উপাদান কপিরাইট, ট্রেডমার্ক এবং অন্যান্য বুদ্ধিমত্তা সম্পত্তি আইন দ্বারা সুরক্ষিত।
              </p>
              <p className="text-gray-700">
                আমাদের পূর্ব অনুমতি ছাড়া এই উপাদানগুলি ব্যবহার, কপি বা পরিবর্তন করা নিষিদ্ধ।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৫. দায়বদ্ধতা সীমাবদ্ধতা</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-times-now">৫.১ পরিষেবার সীমাবদ্ধতা</h3>
                  <p className="text-gray-700">
                    যদিও আমরা সর্বোচ্চ নির্ভুলতা নিশ্চিত করার চেষ্টা করি, আমাদের ফ্যাক্টচেকিং ফলাফল ১০০% নির্ভুল নাও হতে পারে। 
                    ব্যবহারকারীদের নিজস্ব বিচার-বুদ্ধি ব্যবহার করা উচিত।
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-times-now">৫.২ ক্ষতির দায়বদ্ধতা</h3>
                  <p className="text-gray-700">
                    আমরা আমাদের পরিষেবা ব্যবহারের ফলে সৃষ্ট কোন ক্ষতির জন্য দায়ী নই। 
                    এটি পরোক্ষ, বিশেষ, ঘটনামূলক বা ফলস্বরূপ ক্ষতির ক্ষেত্রেও প্রযোজ্য।
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৬. পরিষেবার পরিবর্তন</h2>
              <p className="text-gray-700 mb-4">
                আমরা সময়ে সময়ে আমাদের পরিষেবার পরিবর্তন, আপডেট বা বন্ধ করতে পারি। 
                গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আমরা ব্যবহারকারীদের অবহিত করব।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৭. অ্যাকাউন্ট বন্ধ</h2>
              <p className="text-gray-700 mb-4">
                আমরা নিম্নলিখিত ক্ষেত্রে ব্যবহারকারীর অ্যাকাউন্ট বন্ধ করতে পারি:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>শর্তাবলী লঙ্ঘন</li>
                <li>অনিয়মিত ব্যবহার</li>
                <li>অন্যান্য ব্যবহারকারীদের ক্ষতি</li>
                <li>আইন লঙ্ঘন</li>
                <li>সিস্টেমের নিরাপত্তা হুমকি</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৮. তৃতীয় পক্ষের পরিষেবা</h2>
              <p className="text-gray-700 mb-4">
                আমরা তৃতীয় পক্ষের পরিষেবা (যেমন AI মডেল, সার্চ ইঞ্জিন) ব্যবহার করি। 
                এই পরিষেবাগুলির নিজস্ব শর্তাবলী রয়েছে এবং আমরা এগুলির জন্য দায়ী নই।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৯. শর্তাবলীর পরিবর্তন</h2>
              <p className="text-gray-700 mb-4">
                আমরা সময়ে সময়ে এই শর্তাবলী আপডেট করতে পারি। 
                পরিবর্তনগুলি ওয়েবসাইটে প্রকাশ করা হবে এবং ব্যবহার করা মানে নতুন শর্তাবলী গ্রহণ করা।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">১০. আইন এবং বিচারক্ষেত্র</h2>
              <p className="text-gray-700 mb-4">
                এই শর্তাবলী বাংলাদেশের আইন দ্বারা পরিচালিত হবে। 
                কোন বিরোধের ক্ষেত্রে ঢাকার আদালতের এখতিয়ার থাকবে।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">১১. যোগাযোগ</h2>
              <p className="text-gray-700 mb-4">
                শর্তাবলী সম্পর্কিত কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>ইমেইল:</strong> fact@khoj-bd.com<br />
                  <strong>ঠিকানা:</strong> Mirpur 12, Dhaka, Bangladesh
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-tiro-bangla"
            >
              ← হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
