import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-times-now">গোপনীয়তা নীতি</h1>
            <p className="text-gray-600 font-tiro-bangla">সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>
          </div>

          <div className="prose prose-lg max-w-none font-tiro-bangla">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">১. পরিচিতি</h2>
              <p className="text-gray-700 mb-4">
                খোঁজ (Khoj) আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।
              </p>
              <p className="text-gray-700">
                আমাদের ওয়েবসাইট ব্যবহার করে আপনি এই নীতির শর্তাবলীতে সম্মত হন।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">২. আমরা কী তথ্য সংগ্রহ করি</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-times-now">২.১ সরাসরি প্রদত্ত তথ্য</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>নাম এবং যোগাযোগের তথ্য</li>
                    <li>ইমেইল ঠিকানা</li>
                    <li>ফ্যাক্টচেক অনুরোধের বিষয়বস্তু</li>
                    <li>ব্যবহারকারী প্রতিক্রিয়া এবং মতামত</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-times-now">২.২ স্বয়ংক্রিয়ভাবে সংগ্রহিত তথ্য</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>আইপি ঠিকানা</li>
                    <li>ব্রাউজার টাইপ এবং সংস্করণ</li>
                    <li>অপারেটিং সিস্টেম</li>
                    <li>ওয়েবসাইট ব্যবহারের সময়কাল</li>
                    <li>পৃষ্ঠা ভিজিটের তথ্য</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৩. তথ্যের ব্যবহার</h2>
              <p className="text-gray-700 mb-4">আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>ফ্যাক্টচেক পরিষেবা প্রদান</li>
                <li>ওয়েবসাইটের কার্যকারিতা উন্নত করা</li>
                <li>ব্যবহারকারী অভিজ্ঞতা উন্নত করা</li>
                <li>সুরক্ষা এবং নিরাপত্তা নিশ্চিত করা</li>
                <li>আইনি বাধ্যবাধকতা পূরণ করা</li>
                <li>যোগাযোগ এবং সেবা সম্পর্কিত তথ্য প্রদান</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৪. তথ্য ভাগাভাগি</h2>
              <p className="text-gray-700 mb-4">
                আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে ভাগাভাগি করি না, তবে নিম্নলিখিত ক্ষেত্রে ব্যতিক্রম হতে পারে:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>আপনার স্পষ্ট সম্মতি থাকলে</li>
                <li>আইনি বাধ্যবাধকতা পূরণের জন্য</li>
                <li>আমাদের পরিষেবা প্রদানের জন্য প্রয়োজনীয় সেবা প্রদানকারীদের সাথে</li>
                <li>সুরক্ষা এবং নিরাপত্তা নিশ্চিত করার জন্য</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৫. তথ্য সুরক্ষা</h2>
              <p className="text-gray-700 mb-4">
                আমরা আপনার তথ্য সুরক্ষার জন্য নিম্নলিখিত ব্যবস্থা গ্রহণ করি:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>এনক্রিপ্টেড ডেটা ট্রান্সমিশন</li>
                <li>নিয়মিত সুরক্ষা অডিট</li>
                <li>সীমিত কর্মী অ্যাক্সেস</li>
                <li>নিয়মিত ব্যাকআপ এবং পুনরুদ্ধার পরীক্ষা</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৬. আপনার অধিকার</h2>
              <p className="text-gray-700 mb-4">আপনার নিম্নলিখিত অধিকার রয়েছে:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>আপনার ব্যক্তিগত তথ্য দেখার অধিকার</li>
                <li>ভুল তথ্য সংশোধনের অধিকার</li>
                <li>তথ্য মুছে ফেলার অধিকার</li>
                <li>তথ্য প্রক্রিয়াকরণ সীমিত করার অধিকার</li>
                <li>তথ্য বহনযোগ্যতার অধিকার</li>
                <li>প্রতিবাদের অধিকার</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৭. কুকিজ এবং ট্র্যাকিং</h2>
              <p className="text-gray-700 mb-4">
                আমরা আপনার অভিজ্ঞতা উন্নত করার জন্য কুকিজ ব্যবহার করি। আপনি আপনার ব্রাউজার সেটিংসে কুকিজ নিষ্ক্রিয় করতে পারেন।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৮. তৃতীয় পক্ষের লিংক</h2>
              <p className="text-gray-700 mb-4">
                আমাদের ওয়েবসাইটে তৃতীয় পক্ষের ওয়েবসাইটের লিংক থাকতে পারে। আমরা এই ওয়েবসাইটগুলির গোপনীয়তা নীতির জন্য দায়ী নই।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">৯. নীতির পরিবর্তন</h2>
              <p className="text-gray-700 mb-4">
                আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আমরা আপনাকে অবহিত করব।
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-times-now">১০. যোগাযোগ</h2>
              <p className="text-gray-700 mb-4">
                গোপনীয়তা সম্পর্কিত কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>ইমেইল:</strong> sysitech1971@gmail.com<br />
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
