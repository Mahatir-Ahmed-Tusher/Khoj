'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, Download, ShoppingCart, User } from 'lucide-react'

interface DownloadableBook {
  id: string
  title: string
  author: string
  review: string
  downloadLink: string
  thumbnail: string
}

interface RecommendedBook {
  id: string
  title: string
  author: string
  review: string
  purchaseLink: string
  thumbnail: string
}

const downloadableBooks: DownloadableBook[] = [
  {
    id: '1',
    title: 'ফ্যাক্ট চেকিং ও ভেরিফিকেশন হ্যান্ডবুক',
    author: 'কদরুদ্দীন শিশির',
    review: 'বাংলাদেশে ফ্যাক্ট-চেকিং বিষয়ে প্রথম পূর্ণাঙ্গ গ্রন্থ হিসেবে কদরুদ্দীন শিশিরের এই বই নিঃসন্দেহে একটি মাইলফলক। গ্লোবাল ইনভেস্টিগেটিভ জার্নালিজম নেটওয়ার্কের সদস্য হিসেবে তাঁর অভিজ্ঞতা এবং MRDI-র প্রকাশনায় বইটি পেয়েছে আরও গ্রহণযোগ্যতা।\n\n৮৬ পাতার বইটি মোট পাঁচটি অধ্যায়ে বিভক্ত। প্রথম দুই অধ্যায়ে ফ্যাক্ট-চেকিং-এর ইতিহাস, ধারণা ও বাংলাদেশের সূচনালগ্নের প্রেক্ষাপট তুলে ধরা হয়েছে। তৃতীয় ও চতুর্থ অধ্যায়ে রয়েছে নানা কার্যকর অনলাইন টুলসের ব্যবহারবিধি, যা নতুনদের কাছে একেবারেই অচেনা হলেও ফ্যাক্ট-চেকিংয়ে কার্যকর। শেষ অধ্যায়ে তথ্য অনুসন্ধানের কৌশল ও ফ্যাক্ট-চেকিং-এর নৈতিকতা নিয়ে আলোকপাত করা হয়েছে।\n\nবইটি এমনভাবে লেখা যে সাধারণ ফেসবুক ব্যবহারকারীরাও ভাইরাল গুজবের সত্যতা যাচাই করতে পারবেন। একই সঙ্গে যারা ইতোমধ্যেই ফ্যাক্ট-চেকিং কাজে যুক্ত, তাদের জন্যও এটি একটি হ্যান্ডবুকের মতো সহায়ক।',
    downloadLink: 'https://drive.google.com/file/d/18p1DIukP1hZ4jgiglmpmXS7GeNvg2J1L/view?usp=sharing',
    thumbnail: 'https://i.postimg.cc/Hn0pRSrc/image.png'
  },
  {
    id: '2',
    title: 'অলৌকিক নয়, লৌকিক — প্রথম খণ্ড',
    author: 'প্রবীর ঘোষ',
    review: 'প্রবীর ঘোষের এই বই বাংলায় যুক্তিবাদী আন্দোলনের মাইলফলক। এখানে তিনি সরাসরি নানা অলৌকিক ঘটনা, ধর্মীয় বিশ্বাস, জ্যোতিষ, তন্ত্র-মন্ত্র ও আধ্যাত্মিক দাবিকে বৈজ্ঞানিক দৃষ্টিতে পরীক্ষা করেছেন। তিনি প্রতিটি দাবি বাস্তব যুক্তি, পর্যবেক্ষণ এবং প্রমাণ দিয়ে খণ্ডন করেছেন।\n\nবাংলার পাঠকের কাছে এটি এক নতুন দৃষ্টিভঙ্গি তৈরি করে—"যা শুনছি তা কি সত্যি?" এই প্রশ্নটা করতে শেখায়। fact-checking এর মূল শিক্ষা এখানেই: শুধু বিশ্বাস নয়, যাচাই করতে হবে। এই বই পড়লে কুসংস্কার মোকাবেলার সাহস ও যুক্তির ভিত্তি তৈরি হয়।',
    downloadLink: 'https://drive.google.com/file/d/1_Cg5GWJpuj70rPH6W7RdlQVsjGqX0Htm/view?usp=sharing',
    thumbnail: 'https://i.postimg.cc/JzZymQSq/image.png'
  },
  {
    id: '3',
    title: 'অলৌকিক নয়, লৌকিক — দ্বিতীয় খণ্ড',
    author: 'প্রবীর ঘোষ',
    review: 'প্রথম খণ্ড পাঠকদের দৃষ্টি খুলে দিয়েছিল, কিন্তু দ্বিতীয় খণ্ডে লেখক আরও সুসংবদ্ধভাবে বিভিন্ন কেস স্টাডি উপস্থাপন করেন। তিনি সরাসরি মঞ্চে, মাঠে কিংবা মানুষের অভিজ্ঞতায় গিয়ে পরীক্ষা-নিরীক্ষা চালিয়ে দেখান যে কথিত অলৌকিক ঘটনাগুলি আসলে কিভাবে ঘটছে।\n\nএই বই একদিকে যেমন অনুসন্ধানী সাংবাদিকতার ধাঁচে সাজানো, তেমনি বিজ্ঞানের হাতিয়ার দিয়ে প্রতারণা ধরিয়ে দেয়। বাংলাভাষী fact-checker, সাংবাদিক বা গবেষকদের জন্য এটি অপরিহার্য।',
    downloadLink: 'https://drive.google.com/file/d/1gO2-c9e_2Xo4LpsThdi35p2AiL0tpU6H/view?usp=sharing',
    thumbnail: 'https://i.postimg.cc/pTfbLmR3/image.png'
  },
  {
    id: '4',
    title: 'ত্রিশ লক্ষ শহিদ বাহুল্য নাকি বাস্তবতা',
    author: 'আরিফ রহমান',
    review: 'বাঙালি বড় বিস্মৃতিপরায়ণ জাতি । নিজেদের ইতিহাস ভুলে বসে থাকে। বিকৃত করে অহর্নিশি। বাঙালি বিতর্কে জড়িয়ে পড়ে শহিদের সংখ্যা নিয়ে, স্বাধীনতার ঘােষক নিয়ে, স্বাধীন বাংলাদেশের প্রথম রাষ্ট্রপতি নিয়ে এমন কোনাে বিষয় নেই যা নিয়ে বাঙালি বিতর্ক করে না। বিষয়টি আমাদের জন্য দুর্ভাগ্যের এবং অস্বস্তির । বাঙালি জাতির সবচেয়ে বড় গর্বের ফসল মুক্তিযুদ্ধ আর এই মুক্তিযুদ্ধের ইতিহাসে সবচেয়ে বেশি বিতর্ক সম্ভবত শহিদের সংখ্যা নিয়ে। বলা হয়ে থাকে বঙ্গবন্ধু নাকি লক্ষ এবং মিলিয়নের পার্থক্য না বুঝে গুলিয়ে ফেলেছিলেন। মুক্তিযুদ্ধ সংক্রান্ত এই অপপ্রচারটির সঠিক জবাব দেওয়াটা অত্যন্ত জরুরী। এখানেই এই গ্রন্থটির সার্থকতা। এই বইটিতে সংকলন করা হয়েছে। প্রচুর পেপার কাটিং, মুক্তিযুদ্ধের সময় কার ছবি, গণহত্যার খতিয়ান, ডেমােগ্রাফি থেকে পাওয়া জন্ম-মৃত্যুহার সংক্রান্ত ডাটা, বীরাঙ্গনাদের জবানবন্দি, পাকিস্তানি জেনারেলদের বই থেকে উদ্ধৃতিসহ অসংখ্য রেফারেন্স। এসব থেকে যে কোনো মানুষ পরিষ্কারভাবে বুঝে নিতে পারবে ১৯৭১ সালের গণহত্যায় শহিদের প্রকৃত সংখ্যা কত ।',
    downloadLink: 'https://drive.google.com/file/d/1LclnM0IKBXfLtjEnv5Kpj-TfQkfFA4Lk/view?usp=sharing',
    thumbnail: 'https://i.postimg.cc/mrGGf3G7/image.png'
  },
  {
    id: '5',
    title: 'Calling Bullshit: The Art of Skepticism in a Data-Driven World',
    author: 'Carl T. Bergstrom & Jevin D. West',
    review: 'আজকের পৃথিবীতে সবচেয়ে বড় সমস্যা হচ্ছে ডেটা ও গ্রাফকে ব্যবহার করে মানুষকে ভুল পথে চালানো। এই বই শেখায়, কিভাবে "অর্থবহ দেখালেও মিথ্যা" ডেটা চিহ্নিত করা যায়।\n\nসোশ্যাল মিডিয়ার ভুয়া তথ্য, বিজ্ঞাপনের অতিরঞ্জন, গবেষণার ভুল উপস্থাপন—সবকিছুর উদাহরণ দিয়ে ব্যাখ্যা করা হয়েছে। fact-checker হিসেবে কাজ করতে চাইলে বইটির টুলকিট পদ্ধতি হাতে-কলমে সাহায্য করবে।',
    downloadLink: 'https://drive.google.com/file/d/15Z53l-DFgK9wZh75dz7MTVI5pSgu1auD/view?usp=sharing',
    thumbnail: 'https://i.postimg.cc/W3bCTXYq/image.png'
  },
  {
    id: '6',
    title: 'May Contain Lies',
    author: 'Alex Edmans',
    review: 'Edmans গবেষণায় দেখিয়েছেন—অনেক সময় বৈজ্ঞানিক গবেষণা বা সংবাদ নিরপেক্ষভাবে উপস্থাপন করা হয় না। শিরোনামে সেনসেশনালাইজ করা হয়, অথবা ডেটা থেকে ভিন্ন ব্যাখ্যা টানা হয়।\n\nতিনি পাঠককে শেখান, "আমি যা পড়ছি—এটা কি পুরো সত্য, নাকি অর্ধেক?" বইটি বিশেষ করে বিশ্ববিদ্যালয় পড়ুয়া ও সাংবাদিকদের জন্য গুরুত্বপূর্ণ, কারণ fact-checking এর ক্ষেত্রে প্রশ্ন করার অভ্যাস তৈরি করে।',
    downloadLink: 'https://cdn.penguin.co.uk/dam-assets/books/9780241630181/9780241630181-sample.pdf',
    thumbnail: 'https://i.postimg.cc/3xZHh4r6/image.png'
  },
  {
    id: '7',
    title: 'The Death of Expertise',
    author: 'Tom Nichols',
    review: 'Tom Nichols দেখিয়েছেন, আধুনিক সমাজে বিশেষজ্ঞদের মতামতকে সাধারণ মানুষ প্রায়ই উপেক্ষা করে। ইন্টারনেট যুগে সবাই মনে করে তারা সব জানে। এর ফলে গুজব, অর্ধসত্য, ওষুধ সম্পর্কে ভুল তথ্য—সবকিছু দ্রুত ছড়ায়।\n\nএই বই আমাদের শেখায়, "জ্ঞান" ও "মতামত" এক জিনিস নয়। fact-checking করতে গেলে বিশেষজ্ঞ সূত্রকে গুরুত্ব দিতে হয়। বইটি বিশেষভাবে প্রাসঙ্গিক, কারণ বর্তমান সময়ে সবাই নিজেদের ফেসবুক পোস্টকে "বিশেষজ্ঞ মত" হিসেবে চালিয়ে দেয়।',
    downloadLink: 'https://dmpi.pasca.radenintan.ac.id/wp-content/uploads/sites/14/2018/11/The-Death-of-Expertise.pdf',
    thumbnail: 'https://i.postimg.cc/8crjXBSx/image.png'
  },
  {
    id: '8',
    title: 'The Misinformation Age: How False Beliefs Spread',
    author: 'Cailin O\'Connor & James Owen Weatherall',
    review: 'এই বইটি তত্ত্বভিত্তিক—তবে অত্যন্ত কার্যকর। লেখকদ্বয় দেখিয়েছেন, মিথ্যা বিশ্বাস কিভাবে সমাজে নেটওয়ার্কের মাধ্যমে ছড়িয়ে পড়ে। গোষ্ঠী-চাপ, পুনরাবৃত্তি, এবং মিথ্যা তথ্যের শক্তিশালী উপস্থাপন—এসব কীভাবে "সত্যের বিকল্প" তৈরি করে তা এখানে বিশ্লেষণ করা হয়েছে।\n\nfact-checker এর জন্য বইটি বোঝা জরুরি, কারণ এটি শেখায় কেন সত্য বললেও অনেকে বিশ্বাস করে না। অর্থাৎ, শুধু প্রমাণ নয়, মানুষের সামাজিক মানসিকতাও বুঝতে হয়।',
    downloadLink: 'https://cdn.bookey.app/files/pdf/book/en/the-misinformation-age.pdf',
    thumbnail: 'https://i.postimg.cc/prtp75LT/image.png'
  },
  {
    id: '9',
    title: 'The Half-Life of Facts',
    author: 'Samuel Arbesman',
    review: 'তথ্য স্থায়ী নয়। বিজ্ঞানের অনেক সত্য সময়ের সাথে বদলে যায়। Arbesman এই বইয়ে ব্যাখ্যা করেছেন যে তথ্যেরও একধরনের "আধা-জীবন" আছে—কিছু সময় পর সেই তথ্য মুছে যায় বা অপ্রাসঙ্গিক হয়ে পড়ে।\n\nfact-checker হিসেবে এই ধারণা অত্যন্ত গুরুত্বপূর্ণ, কারণ গত ২০ বছর আগে সঠিক যে তথ্য ছিল, এখন হয়তো ভুল। এই বই আমাদের শেখায় সত্যকে সময়ের প্রেক্ষাপটে বিচার করতে।',
    downloadLink: 'https://cdn.bookey.app/files/pdf/book/en/the-half-life-of-facts.pdf',
    thumbnail: 'https://i.postimg.cc/05fkxBtZ/image.png'
  },
  {
    id: '10',
    title: 'Trust Me, I\'m Lying: Confessions of a Media Manipulator',
    author: 'Ryan Holiday',
    review: 'এই বইটি একেবারে ভেতরের দিক থেকে লেখা। লেখক নিজেই মিডিয়া ম্যানিপুলেটর হিসেবে কাজ করেছেন—কিভাবে ব্লগার, নিউজ সাইট ও সোশ্যাল মিডিয়াকে ব্যবহার করে তিনি গুজব ও ভুয়া খবর ছড়িয়েছেন, তার স্বীকারোক্তি এই বই।\n\nপাঠকের কাছে বইটি ভয়ঙ্কর সত্য উন্মোচন করে—মিডিয়া কত সহজে ভুল পথে চালিত হতে পারে। fact-checker হিসেবে এই বই পড়লে বোঝা যায়, ভুয়া খবর শুধু ভুল নয়, সেটি ইচ্ছাকৃতভাবেই তৈরি করা হয়।',
    downloadLink: 'https://cdn.bookey.app/files/pdf/book/en/trust-me--i\'m-lying.pdf',
    thumbnail: 'https://i.postimg.cc/rF3vLGLQ/image.png'
  }
]

const recommendedBooks: RecommendedBook[] = [
  {
    id: '1',
    title: 'ভূত এক্সপোজড – বিজ্ঞানের চোখে ভূত',
    author: 'ব্যাঙের ছাতার বিজ্ঞান গ্রুপের এক দল লেখক',
    review: 'অলৌকিক বিষয়ে মানুষের অন্ধবিশ্বাস নতুন কিছু নয়। ফটোশপ থাক বা না থাক, ভূত-জ্বিনের গল্পের প্রতি মানুষের আগ্রহ সবসময় প্রবল। সেই সুযোগে নানা পির-ফকির, ধোঁকাবাজ ও তথাকথিত "ভূত শিকারি টিম" এখন ব্যবসা জমজমাট করে তুলেছে। সামাজিক যোগাযোগমাধ্যম আর এফ.এম. রেডিওতে প্রতিদিনই শোনা যায় অগণিত ভূতের গল্প—শেষ কথাটা প্রায় একই: "বিশ্বাস করেন রাসেল ভাই!"\n\nকিন্তু বিজ্ঞান কী বলে? লেখকের ভাষায়—ভূত, জ্বিন, কালো জাদু, টেলিপ্যাথি কিংবা টেলিকাইনেসিস—এসবের পক্ষে আজও একটিও বৈজ্ঞানিক প্রমাণ নেই। পৃথিবীর বিভিন্ন প্রান্তে অলৌকিক ঘটনার প্রমাণ দেখাতে কোটি কোটি টাকার পুরস্কার ঘোষণা করা হয়েছে, অথচ একটিও কংক্রিট প্রমাণ আজ পর্যন্ত কেউ হাজির করতে পারেনি।\n\nতাহলে এত ভৌতিক ঘটনার ব্যাখ্যা কী? বইয়ে লেখক তিনটি প্রধান কারণ উল্লেখ করেছেন:\n১) গুজব,\n২) ইচ্ছাকৃত মিথ্যাচার,\n৩) ভ্রম বা ভুল ব্যাখ্যা।\n\n"ব্যাঙের ছাতার বিজ্ঞান" দলের দীর্ঘদিনের অনুসন্ধানে ভূতের অস্তিত্বের কোনো সুনির্দিষ্ট প্রমাণ মেলেনি। বরং পাওয়া গেছে অসংখ্য ভ্রান্ত ধারণা, মানুষের ভয়, আর কিছু কৌশলে তৈরি প্রতারণা।\n\nবইটি শুধু কুসংস্কার খণ্ডন করে না, বরং পাঠককে যুক্তি দিয়ে ভাবতে শেখায়—যা দেখছি, তা কি সত্যিই তাই? সঠিক অনুসন্ধানী দৃষ্টিভঙ্গি গড়ে তুলতে এই বই একেবারে উপযুক্ত।',
    purchaseLink: 'https://www.rokomari.com/book/282537/vhut-exposed',
    thumbnail: 'https://i.postimg.cc/fyw0y0nP/image.png'
  },
  {
    id: '2',
    title: 'অ-মীমাংসিত রহস্য',
    author: 'জহিরুল ইসলাম',
    review: 'ফেসবুকে এবং কিছু অনলাইন নিউজ পেপারে "অমীমাংসিত রহস্য" জাতীয় ঘটনাগুলাে খুব পপুলার। অনেক সিম্পল ঘটনাকেও অমীমাংসিত-রহস্যময়-ভয়ংকরভূতুড়ে-ভৌতিক-প্যারানরমাল ঘটনা বানিয়ে রিপ্রেজেন্ট করা হয়। সেই পরিপ্রেক্ষিতে এই আর্টিকেলগুলাে লেখা। এখানে রহস্যময় কয়েকটি ঘটনা উপস্থাপন করা হয়েছে, এবং সেগুলাের বৈজ্ঞানিক ব্যাখ্যা দেওয়ার চেষ্টা করা হয়েছে। ব্যাখ্যাগুলাে কোনােটাই আমার নয়, সবই বিভিন্ন পত্র-পত্রিকায় প্রকাশিত হয়েছে। ব্যাখ্যাটা জানলে সেগুলাে আর কোনাে রহস্যই থাকে না। তাই এই সিরিজের নাম অমীমাংসিত রহস্য। আমাদের সভ্যতা যত এগােচ্ছে, বিজ্ঞানের নতুন নতুন জিনিস তত বেশি আবিষ্কার হচ্ছে। অজানা জিনিস আমাদের জানা হয়ে যাচ্ছে। রহস্য আর রহস্য থাকছে না। অমীমাংসিত জিনিসগুলাের মীমাংসা হয়ে যাচ্ছে। এই সময়েও কেউ যদি ইচ্ছা করে জানা জিনিসকে অমীমাংসিত রহস্য হিসেবে উপস্থাপন করতে চায়, তাহলে তার উদ্দেশ্য সম্পর্কে প্রশ্ন উঠবে। ১৭টি ভিন্ন ভিন্ন রহস্য আছে এখানে। ৭টি রহস্য বাংলাদেশের, ১০টি দেশের বাইরের।',
    purchaseLink: 'https://www.rokomari.com/book/214243/o-mimangsito-rohosso',
    thumbnail: 'https://i.postimg.cc/76QyGppy/image.png'
  }
]

export default function ELibraryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900 font-solaiman-lipi">
              ই-গ্রন্থাগার
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-solaiman-lipi mb-6">
            ফ্যাক্ট চেকিং ও যুক্তিবাদী সাহিত্যের বিশাল সম্ভার
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-lg text-gray-800 font-solaiman-lipi">
              বই পড়ুন, শিখুন, ভাবুন, এবং খোঁজ-এর সাথে যুক্ত হয়ে জ্ঞানের আলোকে আলোকিত হোন!
            </p>
          </div>
        </div>

        {/* Downloadable Books Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              📚 বই পড়া যাবে ডাউনলোড করে
            </h2>
            <p className="text-lg text-gray-600 font-solaiman-lipi">
              নিচের বইগুলো বিনামূল্যে ডাউনলোড করে পড়তে পারবেন
            </p>
          </div>

          <div className="space-y-12">
            {downloadableBooks.map((book) => (
              <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Book Thumbnail */}
                  <div className="flex-shrink-0">
                    <img 
                      src={book.thumbnail} 
                      alt={book.title}
                      className="w-48 h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>

                  {/* Book Metadata */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 font-solaiman-lipi">
                      {book.title}
                    </h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-lg text-gray-700 font-solaiman-lipi">
                          লেখকঃ {book.author}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-solaiman-lipi">
                        ধরণঃ ফ্যাক্ট চেকিং, যুক্তিবাদ, গবেষণা
                      </div>
                      <div className="text-sm text-gray-600 font-solaiman-lipi">
                        স্ট্যাটাসঃ বিনামূল্যে ডাউনলোড
                      </div>
                    </div>

                    {/* Review */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                        পর্যালোচনা
                      </h4>
                      <div className="text-gray-700 leading-relaxed font-solaiman-lipi">
                        {book.review.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Download Link */}
                    <div className="border-t pt-4">
                      <a 
                        href={book.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium font-solaiman-lipi"
                      >
                        ডাউনলোডঃ বইটি পড়তে ডাউনলোড করুন <span className="underline">এখানে</span>।
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Books Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              🛒 রেকমেন্ডেশন
            </h2>
            <p className="text-lg text-gray-600 font-solaiman-lipi">
              নিচের বইগুলো বিভিন্ন বইয়ের দোকান থেকে কিনে পড়তে পারবেন
            </p>
          </div>

          <div className="space-y-12">
            {recommendedBooks.map((book) => (
              <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Book Thumbnail */}
                  <div className="flex-shrink-0">
                    <img 
                      src={book.thumbnail} 
                      alt={book.title}
                      className="w-48 h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>

                  {/* Book Metadata */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 font-solaiman-lipi">
                      {book.title}
                    </h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-lg text-gray-700 font-solaiman-lipi">
                          লেখকঃ {book.author}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-solaiman-lipi">
                        ধরণঃ যুক্তিবাদ, বিজ্ঞান, গবেষণা
                      </div>
                      <div className="text-sm text-gray-600 font-solaiman-lipi">
                        স্ট্যাটাসঃ কেনার জন্য উপলব্ধ
                      </div>
                    </div>

                    {/* Review */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                        পর্যালোচনা
                      </h4>
                      <div className="text-gray-700 leading-relaxed font-solaiman-lipi">
                        {book.review.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Purchase Link */}
                    <div className="border-t pt-4">
                      <a 
                        href={book.purchaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium font-solaiman-lipi"
                      >
                        কেনার জন্যঃ বইটি কিনতে ক্লিক করুন <span className="underline">এখানে</span>।
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi text-center">
            এই লাইব্রেরি সম্পর্কে
          </h3>
          <div className="text-gray-700 font-solaiman-lipi leading-relaxed text-lg text-center">
            আমাদের ই-গ্রন্থাগারে আপনি পাবেন ফ্যাক্ট চেকিং, যুক্তিবাদ, বিজ্ঞান, এবং সঠিক তথ্য যাচাই সম্পর্কিত বইয়ের বিশাল সম্ভার। 
            কিছু বই বিনামূল্যে ডাউনলোড করে পড়তে পারবেন, আবার কিছু বই বিভিন্ন বইয়ের দোকান থেকে কিনে পড়তে পারবেন। 
            প্রতিটি বইয়ের সাথে বিস্তারিত পর্যালোচনা দেওয়া হয়েছে যাতে আপনি সঠিক বইটি বেছে নিতে পারেন।
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
