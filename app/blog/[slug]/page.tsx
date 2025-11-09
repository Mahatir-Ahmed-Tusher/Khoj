"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";

interface BlogPost {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishDate: string;
  readTime: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "6",
    title: "কী কী আছে এই খোঁজ-এ?",
    author: "সাগর চন্দ্র দে",
    thumbnail: "https://i.postimg.cc/TwF5YmsF/Khoj-features.png",
    excerpt:
      "আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের অবিরাম স্রোত। কিন্তু সেই স্রোতের ভেতরে আসল তথ্য আর অসত্য আলাদা করা কি এত সহজ? ফেসবুকের নিউজফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট কিংবা বিভিন্ন নিউজ অ্যাপ—সবখানেই ভেসে বেড়ায় অসত্য খবর, গুজব আর অর্ধসত্য।",
    content: `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>লেখক:</strong> সাগর চন্দ্র দে</p>
        <p style="margin: 0 0 10px 0;"><strong>প্রকাশ তারিখ:</strong> ২৭ সেপ্টেম্বর, ২০২৫</p>
        <p style="margin: 0;"><strong>ক্যাটাগরি:</strong> প্রযুক্তি এবং এআই</p>
      </div>

      <div style="margin-bottom: 30px;">
        <span style="background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">খোঁজ</span>
        <span style="background-color: #e8f5e8; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">এআই</span>
        <span style="background-color: #fff3e0; color: #f57c00; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ফ্যাক্টচেকিং</span>
        <span style="background-color: #fce4ec; color: #c2185b; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">মিথবাস্টিং</span>
        <span style="background-color: #f3e5f5; color: #7b1fa2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">মুক্তিযুদ্ধ কর্নার</span>
      </div>

      <p style="margin-bottom: 20px; line-height: 1.8; font-size: 18px; font-weight: 500;">
        আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের অবিরাম স্রোত। কিন্তু সেই স্রোতের ভেতরে আসল তথ্য আর অসত্য আলাদা করা কি এত সহজ?
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        ফেসবুকের নিউজফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট কিংবা বিভিন্ন নিউজ অ্যাপ—সবখানেই ভেসে বেড়ায় অসত্য খবর, গুজব আর অর্ধসত্য।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        বাংলা ভাষাভাষী কোটি মানুষের জন্য এটি এক বিশাল চ্যালেঞ্জ। কারণ, সত্য যাচাইয়ের নির্ভরযোগ্য ব্যবস্থা না থাকলে তার সামাজিক, রাজনৈতিক এবং ব্যক্তিগত ক্ষতি হতে পারে ভয়াবহ।
      </p>

      <p style="margin-bottom: 30px; line-height: 1.8;">
        এই জটিল ও বিভ্রান্তিকর সময়েই জন্ম নিয়েছে <strong>"খোঁজ"</strong>—বাংলা ভাষার প্রথম এবং সবচেয়ে পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম <a href="https://www.khoj-bd.com/blog/khoj-ai-factchecker-verification" style="color: #007cba; text-decoration: underline;">[১]</a>।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">প্ল্যাটফর্মটির প্রধান বৈশিষ্ট্যসমূহ</h2>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ শুধু একটি ফ্যাক্ট-চেকিং ওয়েবসাইট নয়, বরং এটি একটি সমন্বিত প্ল্যাটফর্ম যা বিভিন্ন উন্নত প্রযুক্তির মাধ্যমে ব্যবহারকারীদের তথ্য যাচাইয়ের সুবিধা দেয়। এর প্রধান বৈশিষ্ট্যগুলো হলো:
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">এআই ফ্যাক্টচেকিং</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ধরুন, আপনি আজ ইন্টারনেটে ঢুকেই শুনলেন যে, <strong>"বাংলাদেশের সেন্ট মার্টিন দ্বীপ আমেরিকানদের দখলে এবং সেখানে একটা নতুন রাষ্ট্র প্রতিষ্ঠা করা হচ্ছে"</strong>। কোনো মেইনস্ট্রিম মিডিয়ায় না আসলেও নানান অনলাইন মিডিয়ায় এসব নিউজে সয়লাভ। সেক্ষেত্রে, খোঁজ হতে পারে আপনার সত্যান্বেষের বিশেষ সঙ্গী। তেমন কঠিন কোনো কাজ না। আপনাকে কেবল <a href="https://www.khoj-bd.com/" style="color: #007cba; text-decoration: underline;">khoj-bd.com</a> এ গিয়ে কেবল সে দাবিটুকু লিখবেন। বাকি কাজটা করবে খোঁজ।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        কয়েক সেকেন্ডের মধ্যেই এআই ঘেঁটে আনবে আসল উৎস, তুলনা করবে তথ্যের নির্ভরযোগ্যতা, আর আপনাকে দেখাবে একটি পূর্ণাঙ্গ ফ্যাক্টচেক রিপোর্ট। বলে দেবে কী দেখে বিশ্বাসযোগ্য, কোন তথ্য কোথা থেকে এসেছে আর কোথায় সন্দেহ থাকতে পারে। এই ফ্যাক্টচেকিং ভোজবাজির মতো উদয় হয় না। কিংবা এআই সর্বজান্তা তাই আপনাকে ফ্যাক্টচেক করে দিচ্ছে৷ ব্যাপারটা এমনও না। এর পেছনে রয়েছে প্রযুক্তির ঝলক। এ নিয়ে বিস্তারিত জানতে ঘুরে আসুন <a href="https://bigganblog.org/2025/09/khoj-first-bengali-ai-factchecker/" style="color: #007cba; text-decoration: underline;">এখান থেকে</a> <a href="https://bigganblog.org/2025/09/khoj-first-bengali-ai-factchecker/" style="color: #007cba; text-decoration: underline;">[২]</a>।
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">এআই মিথবাস্টিং</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ডিজিটাল যুগে ভুয়া খবর আর গুজব আমাদের প্রতিদিনের বাস্তবতা হয়ে দাঁড়িয়েছে। বেশিরভাগ সময় মানুষ শুধু "কোনো দাবি সত্য নাকি মিথ্যা", এই উত্তরেই থেমে যায়। কিন্তু খোঁজ একটু ভিন্ন পথে হেঁটেছে।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজের অন্যতম অনন্য ফিচার হলো, এটি শুধু তথ্য দেয় না; বরং কথোপকথনের ভঙ্গিতে বিষয়টি ব্যাখ্যা করে। ধরুন, আপনি কোনো কুসংস্কার বা বৈজ্ঞানিক দাবি শুনলেন। এআই তখন এক বন্ধুর মতো আপনাকে বোঝাবে। এটার জন্যে আপনাকে কেবল খোঁজের মূল পাতায় থাকা সার্চবারের নীচে <strong>"মিথবাস্টিং"</strong> বাটনটিতে ক্লিক করে তারপর সেই সার্চবারে লিখে ফেলতে হবে আপনার শোনা মিথটি। খোঁজ প্রস্তুত করে দেবে একটা বিস্তারিত গুজব খন্ডন রিপোর্ট। প্রথমে প্রেক্ষাপট তুলে ধরবে, তারপর বৈজ্ঞানিক প্রমাণ হাজির করবে, আর সবশেষে গল্পের মতো করে বিষয়টির ভ্রান্তি পরিষ্কার করবে।
      </p>

      <p style="margin-bottom: 30px; line-height: 1.8;">
        এই বৈশিষ্ট্যের সবচেয়ে বড় শক্তি হলো, এটি মানুষকে শুধু গুজব থেকে রক্ষা করে না, বরং দীর্ঘমেয়াদে ক্রিটিক্যাল থিঙ্কিং শেখায়। আর সেই দক্ষতাই তৈরি করে এক ধরনের ডিজিটাল সুরক্ষা, যা ভবিষ্যতের তথ্যযুদ্ধে অত্যন্ত কার্যকর।
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">ম্যানুয়াল ফ্যাক্টচেকিং</h3>
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এআই-ভিত্তিক ফিচারের পাশাপাশি খোঁজ টিম নিয়মিতভাবে অনলাইনে ছড়িয়ে থাকা নানা গুজব ম্যানুয়ালভাবে ফ্যাক্টচেক করে। উদ্দেশ্য একটাই, যাতে কোনো বিভ্রান্তিকর বা ভুয়া সংবাদ সহজে ছড়িয়ে পড়তে না পারে। এভাবে কৃত্রিম বুদ্ধিমত্তার গতি আর মানুষের বিশ্লেষণী ক্ষমতা একত্রিত হয়ে খোঁজকে সত্য যাচাইয়ের একটি নির্ভরযোগ্য মানদণ্ডে পরিণত করেছে। খোঁজ এর মূল পাতাতেই পেয়ে যাবেন সাম্প্রতিক কালে ছড়িয়ে পড়া নানান গুজবের খন্ডন।
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">রিভার্স মিডিয়া সার্চ</h3>
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এ ফিচারটা অনেকটা গুগল লেন্সের মতো। তবে আরেকটু বেটার। ছবি আপলোড করে জানতে পারবেন আপনার আপলোডকৃত ছবিটি ইন্টারনেটে আর কোথায় কোথায় আছে। এতে করে কোনো নির্দিষ্ট ছবি নিয়ে গুজব ছড়ালেও খোঁজের সাহায্যে আপনি বের করে ফেলতে পারবেন, মূল ছবিটি আসলে কীসের ছিলো, কোন প্রেক্ষাপটে ছিলো। ফাইল আপলোডের জন্য রয়েছে সহজ ড্র্যাগ-এন্ড-ডপ ইন্টারফেস এবং সার্চের অগ্রগতি সরাসরি দেখার সুযোগ।
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">লেখা যাচাই</h3>
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এই টুলের সাহায্যে যেকোনো বাংলা লেখা সহজেই বিশ্লেষণ করা যায়। এটি ডুপ্লিকেট কনটেন্ট বা প্লেজিয়ারিজম শনাক্ত করতে সক্ষম এবং কোনো লেখা মানুষের লেখা নাকি কৃত্রিম বুদ্ধিমত্তার তৈরি—তা নির্ভুলভাবে নির্ধারণ করতে পারে। পাশাপাশি লেখার পাঠযোগ্যতা এবং এর মূল উৎস সম্পর্কেও বিস্তারিত তথ্য প্রদান করে।
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">খোঁজ চ্যাট: সত্য যাচাইয়ে আপনার এআই অ্যাসিস্ট্যান্ট</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ চ্যাটে রয়েছে বিশেষায়িত ৩ টি ফিচার। প্রথমটা হচ্ছে, <strong>জেনারেল মোড</strong>, যেটায় আপনি চাইলে নানান ব্যাপারে আলোচনা এমনকী, তথ্য যাচাই করতে পারবেন।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        তবে, তথ্য যাচাইয়ের জন্য বিশেষায়িত অপশন হচ্ছে <strong>"যাচাই"</strong>। ব্যবহারকারী চাইলে তার সাথে চ্যাট করতে করতে ফ্যাক্টচেকিং করতে পারবেন, "যাচাই" অপশনটি বেছে নিয়ে। চ্যাটবটটি উত্তরের সাথে নির্ভরযোগ্য সূত্রের লিংকও উল্লেখ করে দেয়।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        একই সাথে <strong>"নাগরিক সেবা"</strong> অপশনটি বেছে নিয়ে জেনে নিতে পারেন সরকারি সেবার নানান তথ্য। যে কাজটা আগে আপনাকে করতে হতো গুগল, ইউটিউব ঘেটে ঘণ্টার পর ঘণ্টা ব্যয় করে। খোঁজ চ্যাট কে NID, জন্মনিবন্ধন, পাসপোর্ট, আইনী নানান প্রশ্ন করলে মুহুর্তেই ব্যবহারকারীকে সমাধান বলে দেবে।
      </p>

      <p style="margin-bottom: 30px; line-height: 1.8;">
        সাথে দিয়ে দেবে সম্পর্কিত সব লিংক। বেঁচে যাবে ব্যবহারকারীর মূল্যবান সময়। ফিচারটি ব্যবহার করতে চাইলে: <a href="https://www.khoj-bd.com/khoj-chat" style="color: #007cba; text-decoration: underline;">https://www.khoj-bd.com/khoj-chat</a>
      </p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">মুক্তিযুদ্ধ কর্নার - লিবারেশন ওয়ার ইঞ্জিন</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        মুক্তিযুদ্ধ নিয়ে ইন্টারনেটে নানান গুজব রটে প্রায়ই। একই সাথে বিভিন্ন রাজনৈতিক দলের নিজস্ব ন্যারেটিভে বিকৃত হয়ে যায় নানান ঐতিহাসিক ঘটনা। সেসবই মানুষের মুখে মুখে ঘুরে বেড়ায়। এটা থেকে উত্তরণে আছে আমাদের <strong>"মুক্তিযুদ্ধ কর্নার"</strong>।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        গুগল থেকে কেন এটা আলাদা, সেটা বলা যাক। গুগলে কোনো নির্দিষ্ট ব্যাপারে জানতে চাইলে ঠিক-ভুল, সবই রেজাল্ট আকারে সামনে আসবে। কিন্তু খোঁজ-এর এই মুক্তিযুদ্ধ কর্নার একটু ভিন্ন। এটা আপনাকে সবচেয়ে অথেন্টিক আর পক্ষপাতহীন ফলাফল এনে দেবে। একাত্তরে সংঘটিত হওয়া গণহত্যা, ধর্ষণ, যুদ্ধাপরাধ ইত্যাদি সম্পর্কে জানতে এই ফিচারটা বেশ কাজের।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ টিমের ভবিষ্যৎ পরিকল্পনা হচ্ছে, এ অংশটিতে পূর্ণরূপে <strong>Retrieval Augmented Generation</strong> প্রযুক্তির প্রয়োগ করা। এ পদ্ধতিতে, মুক্তিযুদ্ধ সম্পর্কিত যেকোনো প্রশ্নের উত্তর দেয়া হবে মুক্তিযুদ্ধের দলিল, গবেষণামূলক গ্রন্থ, ঐতিহাসিকগণদের লিখা বইপত্র থেকে। যেসব ডেটার উপর বৃহৎ ভাষা মডেলগুলো ট্রেইনড না বা যেসব তথ্য গুগল করেও জানা সম্ভব না, বইপত্র পড়া ছাড়া, সেসব তথ্যই আপনাকে খোঁজ এনে দেবে কেবল আপনার একটা প্রশ্নে।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">ভবিষ্যৎ পরিকল্পনা</h2>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ টিম প্ল্যাটফর্মটিকে ভবিষ্যতে আরও উন্নত করার পরিকল্পনা হাতে নিয়েছে। এর মধ্যে রয়েছে:
      </p>

      <ul style="margin-bottom: 25px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>অডিও এবং ভিডিও সার্চ:</strong> ছবি ছাড়াও অডিও এবং ভিডিও ফাইল দিয়ে অনুসন্ধান করার সুবিধা।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>কমিউনিটি ফিচার:</strong> ব্যবহারকারীরা নিজেরা কোনো তথ্য যাচাইয়ের জন্য জমা দিতে পারবেন।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>মোবাইল অ্যাপ:</strong> প্ল্যাটফর্মটিকে আরও সহজলভ্য করতে অ্যান্ড্রয়েড ও আইওএস অ্যাপ চালু করা হবে।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>মুক্তি কর্নারের সমৃদ্ধিকরণ:</strong> মুক্তিযুদ্ধের আরও দুর্লভ ও প্রামাণ্য নথি যুক্ত করে এই বিভাগটিকে আরও তথ্যবহুল করা হবে।</li>
      </ul>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">উদ্ভাবনের নেপথ্যে যারা</h2>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এই অসাধারণ প্ল্যাটফর্মটি গড়ে তোলার পেছনে রয়েছি আমরা একদল সত্যান্বেষী:
      </p>

      <ul style="margin-bottom: 25px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>মাহাথির আহমেদ তুষার:</strong> প্রতিষ্ঠাতা ও লিড ডেভেলপার, যিনি প্ল্যাটফর্মটির এআই আর্কিটেকচার ডিজাইন করেছেন।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>সাগর চন্দ্র দে:</strong> ইউআই/ইউএক্স ডিজাইনার, যিনি এর চমৎকার বাংলা ইন্টারফেস তৈরি করেছেন।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>তানিয়া চৈতি:</strong> ডেটা সায়েন্টিস্ট, যিনি এর তথ্যভান্ডার তৈরিতে কাজ করেছেন।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>আবু কাউসার:</strong> উপদেষ্টা, যিনি "খোঁজ" ধারণাটির উদ্ভাবন করেছেন এবং কৌশলগত নির্দেশনা দিয়েছেন।</li>
      </ul>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ শুধু একটি প্ল্যাটফর্ম নয়, এটা বাংলা ভাষায় ডিজিটাল সাক্ষরতা বাড়ানো এবং অসত্য তথ্য শনাক্ত করার এক নতুন অধ্যায়। এর হাইব্রিড পাইপলাইন—এআই-চালিত অনুসন্ধান, উৎসের বাছাই এবং তথ্যের সারাংশ—প্রমাণ করে যে সত্য যাচাই করা হতে পারে আরও দ্রুত, আরও সহজ।
      </p>

      <p style="margin-bottom: 30px; line-height: 1.8;">
        আমাদের বিশ্বাস, খোঁজ শুধু ব্যবহারকারীদের সহায়তাই করবে না, বরং ধীরে ধীরে সমাজে ইতিবাচক প্রভাব ফেলবে। কারণ সত্যের সন্ধান শুধু একটি প্রয়োজন নয়, এটি একটি দায়িত্ব। আর সেই দায়িত্ব পালনের প্রতিটি মুহূর্তে খোঁজ থাকবে আপনার পাশে।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">তথ্যসূত্রঃ</h2>
      <ol style="padding-left: 20px; margin-bottom: 30px;">
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.khoj-bd.com/blog/khoj-ai-factchecker-verification" style="color: #3498db; text-decoration: none;">KHOJ - AI-Powered Bengali Fact Checking Platform. (n.d.). https://www.khoj-bd.com/blog/khoj-ai-factchecker-verification</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://bigganblog.org/2025/09/khoj-first-bengali-ai-factchecker/" style="color: #3498db; text-decoration: none;">তুষার. আ. (2025, September 16). খোঁজ, বাংলা ভাষার প্রথম এআই-চালিত ফ্যাক্টচেকারের অভিনব যাত্রা - বিজ্ঞান ব্লগ. বিজ্ঞান ব্লগ. https://bigganblog.org/2025/09/khoj-first-bengali-ai-factchecker/</a></li>
      </ol>
    `,
    tags: ["খোঁজ", "এআই", "ফ্যাক্টচেকিং", "মিথবাস্টিং", "মুক্তিযুদ্ধ কর্নার"],
    publishDate: "২৭ সেপ্টেম্বর, ২০২৫",
    readTime: "১০ মিনিট",
    slug: "khoj-features-overview",
  },
  {
    id: "5",
    title: "অপবিজ্ঞানের যতো বই",
    author: "মাহাথির আহমেদ তুষার",
    thumbnail: "https://i.postimg.cc/kGM8vQvt/image.png",
    excerpt:
      "চলুন আজকে সিউডোসায়েন্স প্রচার করা কিছু বইয়ের সাথে আপনাদের পরিচয় করাই, যেগুলিতে বাংলা ভাষাভাষীদের মধ্যে প্রচলিত অনেক অপবিজ্ঞানের উৎস রয়েছে৷ অপবিজ্ঞানের উৎস সন্ধান করতে এ প্রবন্ধে আমরা বেছে নিয়েছি কিছু বইকে।",
    content: `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>লেখক:</strong> মাহাথির আহমেদ তুষার</p>
        <p style="margin: 0 0 10px 0;"><strong>প্রকাশ তারিখ:</strong> ২ ফেব্রুয়ারি, ২০২৫</p>
        <p style="margin: 0;"><strong>ক্যাটাগরি:</strong> অপবিজ্ঞান এবং বই রিভিউ</p>
      </div>

      <div style="margin-bottom: 30px;">
        <span style="background-color: #e8f5e8; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">অপবিজ্ঞান</span>
        <span style="background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">সিউডোসায়েন্স</span>
        <span style="background-color: #fff3e0; color: #f57c00; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">বিজ্ঞান</span>
        <span style="background-color: #fce4ec; color: #c2185b; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">বই রিভিউ</span>
        <span style="background-color: #f3e5f5; color: #7b1fa2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">মিথবাস্টিং</span>
      </div>

      <p class="has-drop-cap has-text-align-left" style="margin-bottom: 20px; line-height: 1.8; font-size: 18px; font-weight: 500;">
        চলুন আজকে সিউডোসায়েন্স প্রচার করা কিছু বইয়ের সাথে আপনাদের পরিচয় করাই, যেগুলিতে বাংলা ভাষাভাষীদের মধ্যে প্রচলিত অনেক অপবিজ্ঞানের উৎস রয়েছে৷ অপবিজ্ঞানের উৎস সন্ধান করতে এ প্রবন্ধে আমরা বেছে নিয়েছি কিছু বইকে। আলোচনার শুরুতেই বলে রাখি যে, এ প্রবন্ধে আমরা অপবিজ্ঞানের বইগুলিকে কেবলমাত্র রিভিউ করবো। অপবিজ্ঞানের খন্ডন না থাকলেও কিছু অংশের খন্ডন অন্য উৎস থেকে সংযুক্ত করে দেওয়া হয়েছে। একই সিরিজের পরবর্তী অংশে ধারাবাহিকভাবে আমরা এ বইগুলির মূল আলোচ্য বিষয়, এবং অপবৈজ্ঞানিক দাবিগুলিকে খন্ডন করবো এক এক করে—বিস্তারিত পরিসরে।পূর্বে পরিষ্কার করা যাক, অপবিজ্ঞান বা আসলে কি?অক্সফোর্ড ইংলিশ ডিকশনারি(দ্বিতীয় সংস্করণ, ১৯৮৯) সিউডোসায়েন্সকে সংজ্ঞায়িত করেছে এভাবে যে,
      </p>

      <blockquote class="wp-block-quote" style="border-left: 4px solid #007cba; padding-left: 20px; margin: 30px 0; font-style: italic; background-color: #f8f9fa; padding: 20px;">
        <p class="has-text-align-left" style="margin: 0; line-height: 1.6;">
          "A pretended or spurious science; a collection of related beliefs about the world mistakenly regarded as being based on scientific method or as having the status that scientific truths now have."
        </p>
      </blockquote>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        মোটামুটি সোজা বাংলায় বললে বলা যায়, বিশ্বাস আশ্রিত, অপ্রমাণিত কোনো মতবাদ বা চিন্তাভাবনা কে বিজ্ঞান বলে চালিয়ে দেয়ার এই ব্যাপারটাকেই বলে অপবিজ্ঞান। ভাষাবিজ্ঞানী ড. হুমায়ুন আজাদ তাঁর "মহাবিশ্ব" বইয়ে P এর অনুবাদ করেছেন "ছদ্মবিজ্ঞান"। ব্যক্তিগতভাবে আমার কাছে এটাই বেশি এপ্রোপ্রিয়েট মনে হয়। এবার চলুন অল্প কথায় দেশী-বিদেশী কিছু অপবিজ্ঞান বইয়ের ব্যাপারে জানা যাক। আমরা মোট ৮ টি বই নিয়ে আলোচনা করবো অপবিজ্ঞান সিরিজের এ অংশে।
      </p>

      <h3 class="wp-block-heading has-text-align-left" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>হোমো স্যাপিয়েনস: রিটেলিং আওয়ার স্টোরি, রাফান আহমেদ</strong>
      </h3>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        এ বইটির উদ্দেশ্য ছিলো বিবর্তন তত্ত্ব সহ বিজ্ঞানের বিভিন্ন প্রতিষ্ঠিত মতবাদকে স্কেপ্টিকাল করে তুলে ধরা। বইটিতে লেখকের ধারণা ফাইন টিউনিংকে ঝেটিয়ে বিদায় করতেই " মাল্টিভার্স" নামক ধারণা আনা হয়। অথচ সত্যি কথা হচ্ছে, বেল অসমতার এক সমাধান হিসেবে কোয়ান্টাম মেকানিক্সে এই ধারণা এসেছিলো। পুরো বইজুড়েই তিনি পাঠকদের বুঝাতে চেয়েছেন বিজ্ঞানের বিভিন্ন ফিল্ডে কাজ করা গবেষকদের কাজই হচ্ছে মানুষের ধর্মবিশ্বাসে আঘাত করা। এ বইয়ে সবচেয়ে বড় আলোচনা হয়েছে থিওরি অব ইভোলিউশন এর মতো বিজ্ঞানের সুপ্রতিষ্ঠিত তত্ত্বের বিরুদ্ধে। তিনি শত শত দাবি তুলেছেন এর বিরুদ্ধে। ইস্কনের ফ্রি ল্যান্সার লেখক দ্রুতকর্ম দাস এর বিভিন্ন ব্লগ, বই আর ইউটিউব ভিডিও দিয়ে তিনি দাবি করেছেন ডায়নোসর আর মানুষ একই সময়ে থাকতো। তিনি বিশ্বাস করেন ডায়নোসর যুগেও থালা বাসন ছিলো। তাই বিবর্তন তত্ত্ব ভুয়া। বিস্তারিত  পড়ুন <a href="https://www.facebook.com/groups/bcb.science/permalink/5501794659904158/" style="color: #007cba; text-decoration: underline;">এখানে</a> [১]।
      </p>

      <figure class="wp-block-image aligncenter size-large is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/Homo-Sapiens-with-Spine-01-661x1024.jpg" alt="" style="width:212px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        প্রায় একশ বছর আগে হ্যাকেলের বায়োজেনিক ল' বাতিল করেছেন ইভোলিউশন নিয়ে কাজ কিছু গবেষক। পরিবর্তে বিবর্তন তত্ত্বের জিন-তাত্ত্বিক প্রমাণের ঝুলিতে এসেছে আরও শত শত প্রমাণ। তারপরও রাফান আহমেদের ধারণা যেহেতু বায়োজেনিক ল' বাতিল, তাই বিবর্তন তত্ত্ব-ও বাতিল। বিস্তারিত পড়ুন <a href="https://bigganblog.org/2021/07/হ্যাকেলের-সেকেলে-মতবাদ-দ/" style="color: #007cba; text-decoration: underline;">এখানে</a> [২]।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        পুরো বই জুড়ে লেখকের শতভাগ চেষ্টা ছিলো বিজ্ঞানের প্রচলিত কনসেপ্টগুলির ব্যাপারে রহস্যীকরণ। লেখকের বিশ্বাস, মহাকর্ষের সংজ্ঞা বাঁচাতে গিয়ে বিজ্ঞানীরা 'ডার্ক ম্যাটার', 'ডার্ক এনার্জি' এর ধারণাগুলি জোর করে হাজির করেছেন । এ বই নিয়ে বিস্তারিত লিখা আসবে কোনো একদিন। আপাতত আমাদের অপবিজ্ঞান বই তালিকায় প্রথম জায়গা করে নেয়া বইটির আলোচনায় ইতি টানছি।
      </p>

      <h3 class="wp-block-heading" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>পৃথিবী নয় সূর্য ঘোরে, মুহাম্মদ নুরল ইসলাম</strong>
      </h3>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        বইটিতে লেখকে দেখাতে চেয়েছেন, পৃথিবী স্থির এবং তার চারপাশে সূর্য ঘোরে। পুরো বইয়ের প্রথমাংশে লেখক বিভিন্ন ধর্মগ্রন্থের রেফারেন্স টেনে মানুষকে ইমোশনালি ব্লেকমেইল করে তার প্রস্তাবিত দাবিতে বিশ্বাস করানোর জোর চেষ্টা চালিয়েছেন।পরবর্তীতে লেখক আঘাত হেনেছেন পৃথিবীর আহ্নিক গতির ওপর।
      </p>

      <figure class="wp-block-image aligncenter size-full is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/th.jpeg" alt="" style="width:242px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        লেখকের মতে, যেখানে কিনা জোরে বাস চললেই তাতে বসে থাকা মুশকিল, সেখানে ঘণ্টায় হাজার মাইল বেগে ঘূর্ণায়মান পৃথিবীতে মানুষ বসবাস করছে সেটা চিন্তা করাটা হাস্যকর! লেখক বিশ্বাস করেন বিজ্ঞানী আইনস্টাইন বলেছেন "পৃথিবী ঘুরে এর কোন বাস্তব প্রমাণ নেই!" এবং গ্যালিলিওকে নাস্তিক আখ্যা দিয়ে দাবি করেছেন কেবল নাস্তিক হলেই আহ্নিক গতিতে বিশ্বাস করা সম্ভব।বইয়ে আরও আছে, পৃথিবী একটি কঠিন পদার্থ, যার অনেক ওজন। সূর্য একটি অগ্নি গোলক, আমরা সবাই জানি আগুনের কোন ওজন নেই। ওজনহীন একটা ভারি জিনিসকে ঘোরাবে, এহেন ধারণাকে লেখক হাস্যকর বলে ভাবেন। তিনি আরও বলেছেন, সূর্যের চেয়ে ধ্রুবতারা আরও বড়। কিন্তু সূর্য ধ্রুব তারাকে কেন্দ্র করে ঘোরে না কেন?অতএব, নিউটনের অভিকর্ষ তত্ত্ব ভুল। বিমান থেকে মাটির দিকে তাকালেও দেখা যায় মাটি বা ভূমি স্থির হয়ে আছে। তাই লেখক এই কনক্লুশান টেনেছেন এই বলে যে পৃথিবীর আহ্নিক গতি ভুয়া। পুরো বই জুড়ে মুহাম্মদ নুরুল ইসলাম ক্ষোভ ঢেলেছেন নিউটন আর গ্যালিলিওর ওপর। বইয়ে লেখক জোরদমে দাবি করেছেন, সব স্যাটেলাইট আসলে আকাশে, আমাদের বায়ুমন্ডলের ওপরই "উড়ে" বেড়ায়। তিনি তার বইয়ে জায়গায় জায়গায় চ্যালেঞ্জ ছুড়ে দিয়েছেন অনেক ব্যাপারে।
      </p>

      <h3 class="wp-block-heading" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>কস্টিপাথর, শামসুল আরেফীন শক্তি</strong>
      </h3>

      <figure class="wp-block-image aligncenter size-full is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/image.png" alt="" style="width:187px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        বইয়ে ঝারফুঁক, কুনজরের মতো বিশ্বাস আশ্রিত অবৈজ্ঞানিক বিষয়গুলিকে বৈজ্ঞানিক হিসেবে দেখানোর চেষ্টা করা হয়েছে। জাপানিজ অপবিজ্ঞান প্রচারক মাসুরো ইমোতোর পানি সম্পর্কিত অপবিজ্ঞান প্রচার করা হয়েছে। পানীয়তে মাছি ডোবালে এন্টিবায়োটিক পাওয়া যাবে এসবও প্রচার করা হয়েছে। ঢিলেঢালা পোশাক না পড়লে পুরুষত্ব চলে যেতে পারে ,হাই কমোডে মলত্যাগ করলে কোলন ক্যান্সার হতে পারে টাইপ হাজারো আজগুবি আলোচনা চলেছে পুরো বই জুড়েই।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8;">
        মাসুরো ইমোতোর ভুয়া গবেষণা সম্পর্কে পড়তে বিজ্ঞান ব্লগের এ <a href="https://bigganblog.org/2023/01/%e0%a6%9c%e0%a6%b2%e0%a7%87%e0%a6%b0-%e0%a6%b8%e0%a7%8d%e0%a6%ae%e0%a7%83%e0%a6%a4%e0%a6%bf-%e0%a6%b8%e0%a6%bf%e0%a6%89%e0%a6%a1%e0%a7%8b%e0%a6%b8%e0%a6%be%e0%a6%af%e0%a6%bc%e0%a7%87%e0%a6%a8/" style="color: #007cba; text-decoration: underline;">আর্টিকেলটি</a> পড়ে ফেলুন [৩]।
      </p>

      <h3 class="wp-block-heading" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>আরজ আলি সমীপে, আরিফ আজাদ</strong>
      </h3>

      <figure class="wp-block-image aligncenter size-full is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/FB_IMG_1582282771657.jpg" alt="" style="width:208px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        বইতে এর আত্মার ওজন মাপা, নামক ভুয়া এক্সপেরিমেন্টগুলিকে "বিজ্ঞান" হিসেবে উপস্থাপন করার হাস্যকর চেষ্টা করা হয়েছে। বইয়ের শেষদিকে বিবর্তন তত্ত্ব নিয়ে আলোচনায় "ফসিল নেই", " প্রমাণ নেই" এসব মিথ্যাচার করা হয়েছে। শেষদিকে ১৯৭০/৮০ সালের আউটডেটেড গবেষণা দিয়ে বিবর্তন তত্ত্ব নিয়ে প্রচুর ভুলভাল বকা হয়েছে। বিস্তারিত জানতে বিজ্ঞান ব্লগের এ <a href="https://bigganblog.org/2021/08/arif-azad-plagiarism/" style="color: #007cba; text-decoration: underline;">আর্টিকেলটি</a> পড়ে ফেলুন [৪]।
      </p>

      <h3 class="wp-block-heading has-text-align-left" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>ভার্চুয়াল ব্যাংস্পেস, রিসাস ভার্চু (বর্তমান নাম আন্দ্রেস লিহান)</strong>
      </h3>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        বইটা ঠিক কোন জনরার, তা অনেক চেষ্টা করেও কেউ বুঝে উঠতে পারেন নি। ফিজিক্স,ক্যামিস্ট্রি, বায়োলজি,সাইকোলজিসহ অসংখ্য বিষয়ের সমন্বয় ঘটানো হয়েছে। হাইপারকন্ডাক্টিভ মাইন্ড,মাইন্ড ডাইমেনশন,হাইপার ব্রেনলেস ব্যাং নিউরন,টাইমলেস মাইন্ড,মোটরবিশ্ব, কোয়ান্টাম সাব এমিনা ব্যাংস্পেস, হাইপারসনিক হিপোক্রেসি বিগব্যাংস্পেস ইত্যাদি বহু বিষয়ের অবতারণা করা হয়েছে,যা বিজ্ঞানের কোথাও খুঁজে পাওয়া যায় না। অনেক জায়গায় লেখক সায়েন্স ফিকশান থেকে জানা চটকদার টার্মগুলিকে পিওর সায়েন্স ভেবে খুব তৃপ্তিভরে লিখেছেন এ বই। নির্ভেজাল অপবিজ্ঞান। বিস্তারিত <a href="https://www.facebook.com/groups/bcb.science/permalink/3641552705928372/" style="color: #007cba; text-decoration: underline;">এখানে</a>৷
      </p>

      <h3 class="wp-block-heading has-text-align-left" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>ডেথঃ এন ইনসাইড স্টোরি, সাদগুরু</strong>
      </h3>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        বইটি আমাদের প্রতিবেশী দেশ ভারতের জনপ্রিয় ধর্মীয় ব্যক্তিত্ব, সাদগুরুর লিখা৷ বইটি প্রতিবেশী দেশে প্রকাশিত হলেও বাংলাদেশের স্পিরিচুয়াল গোছের মানুষের কাছে বেশ জনপ্রিয় এবং পূজনীয়। ২০২৩ সালে জাহাঙ্গীর নগর বিশ্ববিদ্যালয়ে এক ছাত্র আত্মহত্যা করে। আত্মহত্যার পূর্বে তার টেবিলে এ বই পড়েছিলো। এবং মৃত্যুর পূর্বে তার লিখে যাওয়া সুইসাইড নোট দেখেও বোঝা যাচ্ছিলো, বেচারা এ বই দ্বারা যথেষ্ট ইনফ্লুয়েন্সড ছিলো।
      </p>

      <figure class="wp-block-image aligncenter size-large is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/50273386-639x1024.jpg" alt="" style="width:208px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        বইয়ের আধ্যাত্মিক, ধর্মীয়—এসব কোনোকিছুতে আলোকপাত না করে এ রিভিউটায় কেবল নজর দেয়া হয়েছে, লেখক বিজ্ঞান নিয়ে কোথায় তালগোল পাকিয়েছেন। পুরো বইজুড়ে অসংখ্য অপবিজ্ঞানৈক দাবি তুললেও এ রিভিউতে অল্প কিছু তুলে ধরছি। বইয়ে লেখক এক পর্যায়ে লিখেছেন, কারো যদি স্মৃতি ফুরিয়ে যায় কিন্তু শক্তি অবশিষ্ট থাকে তবে সে অকালে মৃত্যুবরণ করবে অথবা নিস্তেজ জীবনযাপন করবে। তবে যদি কোনো ব্যক্তির শক্তি ফুরিয়ে যায় কিন্তু মেমোরি অবশিষ্ট থাকে তাহলে সেই ব্যক্তি মরার পরে ভূত হয়ে যাবে। উনি এবং জীব সবাইকে একটি শক্তি রূপে দেখেছেন। কাউকে যখন ভূতে ধরে তখন মূলত একটি শক্তির সাথে আরেকটি শক্তির ক্রিয়া ঘটে। যে ব্যক্তির সাথে কোনো অশরীরীর রক্তের গ্রুপ এবং কর্ম মিলে যায় তার দেহের সাথেই নাকি এই অশরীরী শক্তি ক্রিয়া করে। ভদ্রলোক একটা নতুন টার্মের প্রবর্তন করেছেন, জেনেটিক মেমোরি নামে। মৃত্যুর পর নাকি জীব চারপাশে তাদের জেনেটিক মেমোরি খুঁজে বেড়ায়। বইয়ে এক জায়গায় লেখক দাবি করেছেন, কোবরা সাপের কামড় খেলে রক্তে লোহিত রক্তকণিকার সংখ্যা বেড়ে যায় এবং ক্ষতস্থানে টিউমার পর্যন্ত হয়। কিন্তু মৃত কোবরা সাপের কামড় খেলে ত্বকে রেশ হয়৷ লেখকের দাবি, এ ব্যাপারে তার ব্যক্তিগত অভিজ্ঞতা আছে। তাই এটা এম্পিরিকাল।পুরো বইজুড়েই রয়েছে উদ্ভট সব দাবি। কিছু দাবিকে বৈজ্ঞানিক, কিছু দাবিকে ব্যক্তিগত কিংবা মাঝে মাঝে তালগোল পাকিয়ে নিজের ব্যক্তিগত চিন্তাভাবনাকে বিজ্ঞানের নামে প্রচার করেছেন।
      </p>

      <h3 class="wp-block-heading has-text-align-left" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>বৈজ্ঞানিক মুহাম্মদ (দঃ), মুহাম্মদ নুরল ইসলাম</strong>
      </h3>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        এ বইটির মূল উদ্দেশ্য ছিলো বিজ্ঞান দিয়ে ধর্ম এবং ধর্মীয় অলৌকিকতাকে ভ্যালিডেশন দেয়া। যদিও এটা সঠিক কোনো পথ নয়। আমাদের এ রিভিউতে এই ভ্যালিডেশনের ব্যাপারটিকে সম্পূর্ণভাবে এড়িয়ে যাওয়া হচ্ছে। তবে কেন বইটিকে আমাদের এ "অপবিজ্ঞান" বইয়ের তালিকায় রাখা হয়েছে, সেটা উল্লেখ করা যাক।পুরো বইজুড়েই এক প্রকার জোর করে বিজ্ঞান-ধর্মের সমন্বয় গঠাতে গিয়ে লেখক অনেক অপবিজ্ঞানও উল্লাসভরে লিখেছেন। অপবিজ্ঞানের পরিমাণটা এতোই বেশি যে, বিস্তারিত পরিসরে সব উল্লেখ করতে গেলে পুরোপুরি আলাদা একটা রিভিউ লিখতে হবে৷
      </p>

      <figure class="wp-block-image aligncenter size-large is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/image-1-620x1024.png" alt="" style="width:220px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        তবে যে বিষয়গুলি চোখে লেগেছে, সেগুলি নিয়ে লিখা যায়। বইটিতে পদার্থবিজ্ঞান সম্পর্কিত আলোচনায় লেখক দুই প্রকার সময়ের অবতারণা করেন৷ একটিকে বললেন, "মহাজাগতিক সময়", আরেকটি " জাগতিক সময়"; এবং উনি ঠিক করে দিয়েছিলেন, মহাজাগতিক আর জাগতিক সময়ের মধ্যে পার্থক্যও।তিনি "বৈজ্ঞানিক আইনস্টাইনের মতামত অনুযায়ী" এ হিসেব পেশ করলেন। সে হিসেব অনুযায়ী মহাজাগতিক ২ বছর= পৃথিবীর ২০০ বছর, মহাজাগতিক ১ বছর= পৃথিবীর ১০০ বছর। শুধু তাই-ই না, একই অংশে লেখক দাবি করেছেন, আইনস্টাইন নাকি এমন এক জগতের কথা উল্লেখ করে গেছেন, যেখানে,
      </p>

      <blockquote class="wp-block-quote" style="border-left: 4px solid #007cba; padding-left: 20px; margin: 30px 0; font-style: italic; background-color: #f8f9fa; padding: 20px;">
        <p class="has-text-align-left" style="margin: 0; line-height: 1.6;">
          "সময় বহে না—মহাকর্ষ নিচের দিকে টানিয়া নামায় না। পদার্থ বলিয়া সেখানে কিছু নাই, আলোক সেখানে অচল। পরিবর্তন সেখানে অসম্ভব। কাজেই নতুন গণিত আমাদের স্বর্গের প্রচলিত ধারণার কাছে লইয়া যাইতেছে।"
        </p>
      </blockquote>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        বইয়ে লেখক আরও দাবি করেছেন, জর্জ ল্যামিটার নাকি মহাবিশ্ব সৃষ্টি নিয়ে বলেছেন যে, বিশ্ব সম্প্রসারণ আরম্ভ হওয়ার পূর্বে বিশ্বের সমস্ত পদার্থ তরল আকারে একটি ঘনীভূত কেন্দ্রকণা গঠন করেছিলো। এ সময় নাকি তাপমাত্রা "কম" ছিলো। আরেক অংশে তিনি দাবি করলেন, মাত্র ৪ ডিগ্রি সেলসিয়াস তাপমাত্রায় পানি বরফে রূপান্তর হয়।এভাবেই বইজুড়ে লেখক উল্লাসভরে, আত্মবিশ্বাসের সাথে আজগুবি কথাবার্তা বিজ্ঞানের নামে চালিয়ে দিয়েছেন। নির্জলা অপবিজ্ঞান।
      </p>

      <h3 class="wp-block-heading has-text-align-left" style="color: #2c3e50; margin: 40px 0 20px 0; font-size: 24px; font-weight: bold;">
        <strong>মরণের পরে, স্বামী অভেদানন্দ </strong>
      </h3>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        আমাদের লিস্টের শেষ বইটি মূলত পশ্চিমবঙ্গের। বইটির শুরুর দিকে লেখক "প্রেত-তত্ত্ব" কে "বৈজ্ঞানিক" আখ্যা দিয়ে দাবি করেন, এই প্রেততত্ত্বের গবেষণা বেশ এগিয়ে যাচ্ছে। ইউরোপ আমেরিকার অনেক বিখ্যাত বিজ্ঞানী এ তত্ত্বের গবেষণায় জড়িত। পুরো বই জুড়ে তিনি রাফান আহমেদ এর মতো নিজের মন্তব্য এমন সব 'বিদেশী নামের' লোকদের দিয়ে চালিয়েছেন, যাদের নাম হাজার খুঁজেও বের করা যায় নি ইন্টারনেটে।
      </p>

      <figure class="wp-block-image aligncenter size-large is-resized" style="text-align: center; margin: 30px 0;">
        <img src="https://bigganblog.org/wp-content/uploads/2024/01/image-2-1024x576.png" alt="" style="width:396px;height:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </figure>

      <p class="has-text-align-left" style="margin-bottom: 20px; line-height: 1.8;">
        আমাদের দেশের আরিফ আজাদের মতো তিনিও "আত্মা" কনসেপ্ট-টাকে বৈজ্ঞানিক বানাতে ভুলেন নি। বইয়ের এক পর্যায়ে তিনি প্রমান করেছেন,একটি মুরগির মাথা কাটার পরও শরীর নাড়াচাড়া করে। এ থেকে তিনি দাবি করেন মস্তিষ্কের মৃত্যু মানেই মৃত্যু নয়। কারণ, শরীরে তখনও আত্মা থাকে৷ বইয়ে আরও লিখা আছে, মৃত্যুর পর মেঘের মতো সাদা গ্যাস বের হয়। এবং সেটা নাকি ক্যামেরায়ও ধারণ করা যায়৷ বইটিতে সবচেয়ে ইন্টারেস্টিং ব্যাপার হচ্ছে, লেখক টার্মিনোলজিটাকে নিজের মতো করে ব্যখ্যা করেছেন। তার মতে, মানুষ মৃত্যুর পর পাপ-পূণ্যের হিসেব মেটার পর আবারও বৃষ্টির মাধ্যমে পৃথিবীতে এসে মাটিতে মিশে যায়। তারপর সেই আত্মা ফসলের মাধ্যমের মানুষের শরীরে ঢুকে আবারও মানুষ হয়ে জন্ম নেয়। লেখকের মতে এটাই হচ্ছে ন্যাচারাল সিলেকশন।
      </p>

      <p style="margin-bottom: 20px; line-height: 1.8; font-weight: bold;">
        <strong>তথ্যসূত্রঃ</strong>
      </p>

      <ul style="margin-bottom: 30px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;">
          <a href="https://www.facebook.com/groups/bcb.science/permalink/5501794659904158/" style="color: #007cba; text-decoration: underline;">https://www.facebook.com/groups/bcb.science/permalink/5501794659904158/</a>
        </li>
        <li style="margin-bottom: 10px; line-height: 1.6;">
          <a href="https://bigganblog.org/2021/07/%e0%a6%b9%e0%a7%8d%e0%a6%af%e0%a6%be%e0%a6%95%e0%a7%87%e0%a6%b2%e0%a7%87%e0%a6%b0-%e0%a6%b8%e0%a7%87%e0%a6%95%e0%a7%87%e0%a6%b2%e0%a7%87-%e0%a6%ae%e0%a6%a4%e0%a6%ac%e0%a6%be%e0%a6%a6-%e0%a6%a6/" style="color: #007cba; text-decoration: underline;">মাহাথির আহমেদ তুষার, "হ্যাকেলের সেকেলে মতবাদ দিয়ে প্রজাতির বিবর্তনকে প্রশ্নবিদ্ধ করা যায়?", বিজ্ঞানব্লগ, ৯ জুলাই,২০২১৷</a>
        </li>
        <li style="margin-bottom: 10px; line-height: 1.6;">
          <a href="https://bigganblog.org/2023/01/%e0%a6%9c%e0%a6%b2%e0%a7%87%e0%a6%b0-%e0%a6%b8%e0%a7%8d%e0%a6%ae%e0%a7%83%e0%a6%a4%e0%a6%bf-%e0%a6%b8%e0%a6%bf%e0%a6%89%e0%a6%a1%e0%a7%8b%e0%a6%b8%e0%a6%be%e0%a6%af%e0%a6%bc%e0%a7%87%e0%a6%a8/" style="color: #007cba; text-decoration: underline;">মাহাথির আহমেদ তুষার, "জলের স্মৃতি: সিউডোসায়েন্স আর রূপকথা", বিজ্ঞানব্লগ, ১ জানুয়ারি, ২০২৩।</a>
        </li>
        <li style="margin-bottom: 10px; line-height: 1.6;">
          <a href="https://bigganblog.org/2021/08/arif-azad-plagiarism/" style="color: #007cba; text-decoration: underline;">মাহাথির আহমেদ তুষার, "আরিফ আজাদের রচনা চুরি ও অজ্ঞতা এবং বিবর্তন তত্ত্ব বিরোধী দাবিসমূহ খন্ডন", বিজ্ঞানব্লগ, ১১ আগস্ট, ২০২১।</a>
        </li>
      </ul>
    `,
    tags: ["অপবিজ্ঞান", "সিউডোসায়েন্স", "বিজ্ঞান", "বই রিভিউ", "মিথবাস্টিং"],
    publishDate: "২ ফেব্রুয়ারি, ২০২৫",
    readTime: "১৫ মিনিট",
    slug: "pseudoscience-books-review",
  },
  {
    id: "1",
    title: "সামাজিক মাধ্যমের ভুয়া খবর: চিহ্নিতকরণের কৌশল",
    author: "ড. মাজেদুল ইসলাম",
    thumbnail: "https://i.postimg.cc/3xZHG36b/image.png",
    excerpt:
      "ইন্টারনেটে গুজব বা অসত্য তথ্য একেবারেই নতুন কিছু নয়। আগে থেকেই এগুলো ছিল, তবে আজকের ডিজিটাল বিস্তার সেগুলোকে আরও দ্রুত ও ব্যাপক করে তুলেছে। এই লেখার উদ্দেশ্য হলো—গুরুত্বপূর্ণ বা সিরিয়াস কনটেন্টের আড়ালে লুকানো বিভ্রান্তিকর তথ্য কীভাবে ধরা যায়, সে বিষয়ে কিছু কার্যকরী কৌশল তুলে ধরা।",
    content: `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>লেখক:</strong> ড. মাজেদুল ইসলাম</p>
        <p style="margin: 0 0 10px 0;"><strong>প্রকাশ তারিখ:</strong> ১০ ডিসেম্বর, ২০২৪</p>
        <p style="margin: 0;"><strong>ক্যাটাগরি:</strong> ডিজিটাল সাক্ষরতা এবং মিডিয়া</p>
      </div>

      <div style="margin-bottom: 30px;">
        <span style="background-color: #e8f5e8; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ফ্যাক্টচেকিং</span>
        <span style="background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ডিজিটাল সাক্ষরতা</span>
        <span style="background-color: #fff3e0; color: #f57c00; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ভুয়া খবর</span>
        <span style="background-color: #fce4ec; color: #c2185b; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">সামাজিক মাধ্যম</span>
      </div>

      <p style="margin-bottom: 20px; line-height: 1.8; font-size: 18px; font-weight: 500;">
        ইন্টারনেটে গুজব বা অসত্য তথ্য একেবারেই নতুন কিছু নয়। আগে থেকেই এগুলো ছিল, তবে আজকের ডিজিটাল বিস্তার সেগুলোকে আরও দ্রুত ও ব্যাপক করে তুলেছে। বর্তমানে ফেসবুক, টুইটার বা ওয়েবসাইটের অসীম পৌঁছনোর কারণে এসব ভুয়া খবর মানুষের কাছে চোখের পলকে পৌঁছে যাচ্ছে। বাংলাদেশের সাম্প্রতিক আন্দোলন-সংকট থেকে শুরু করে পৃথিবীর নানা প্রান্তে এর প্রমাণ মিলছে।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এই লেখার উদ্দেশ্য হলো—গুরুত্বপূর্ণ বা সিরিয়াস কনটেন্টের আড়ালে লুকানো বিভ্রান্তিকর তথ্য কীভাবে ধরা যায়, সে বিষয়ে কিছু কার্যকরী কৌশল তুলে ধরা।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">বিশ্বাসযোগ্য মাধ্যমের ওপর আস্থা রাখুন</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        যদি নির্ভরযোগ্য উৎসের সঙ্গে আপনার সংযোগ থাকে, তবে অসত্য খবর এড়িয়ে চলা অনেক সহজ। নতুন কোনো তথ্য সামনে এলে প্রথমেই দেখে নিন সেটা খ্যাতনামা সংবাদমাধ্যমে প্রকাশিত হয়েছে কিনা। বড় বড় সংবাদ সংস্থার ফ্যাক্ট-চেকিং ব্যবস্থা তুলনামূলকভাবে কঠিন এবং তাদের সম্পাদকীয় ছাঁকনিও শক্তিশালী। প্রতিষ্ঠিত ব্র্যান্ডের জন্য বিভ্রান্তিকর তথ্য ছাপানো তাদের সুনামের জন্য ভয়াবহ হতে পারে, তাই সেখানে একেবারে বানানো খবর প্রকাশিত হওয়ার সম্ভাবনা নেই বললেই চলে।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        কেবল সংবাদ প্রতিবেদন নয়, কোনো গ্রুপে দেওয়া স্ট্যাটাস বা পোস্টও যাচাই ছাড়া শেয়ার করবেন না। আগে অন্তত দু'একটি বিশ্বস্ত সংবাদমাধ্যমে মিলিয়ে নিন।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">প্রতারণামূলক কনটেন্ট চিনে নিন</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        অসত্য সংবাদের এক অন্ধকার দিক হলো—ভুয়া ওয়েবসাইট ও ফেক অ্যাকাউন্ট। এসব উৎস আসল প্রতিষ্ঠানের ছদ্মবেশ ধারণ করে। প্রায়ই নামকরা সংবাদমাধ্যমের নাম নকল করে, খুব কাছাকাছি বানানের ওয়েব ঠিকানা ব্যবহার করে বিভ্রান্তিকর খবর ছড়ানো হয়।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এমন কিছু সন্দেহ হলে প্রথমেই সংবাদ মাধ্যমের নামের বানান ভালো করে মিলিয়ে দেখুন এবং সেই প্ল্যাটফর্মে প্রকাশিত অন্যান্য খবরের মান যাচাই করুন। তাতে বোঝা যাবে সেটি আসলেই বিশ্বাসযোগ্য কিনা।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">ফ্যাক্ট-চেকারদের সাহায্য নিন</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ইন্টারনেটে এমন বহু সাইট ও পেজ রয়েছে, যারা নিয়মিত ভুয়া সংবাদ যাচাই করে সত্যতা প্রকাশ করে। তারা ব্যাখ্যা করে কোন খবর আসলে কোথা থেকে এসেছে এবং তার প্রেক্ষাপট কী। অনেক সময় পুরোনো ছবি বা ভিডিওকে নতুন ঘটনা হিসেবে দেখানো হয়—এসবও তারা উন্মোচন করে।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">পুরোনো কনটেন্টে নতুন মোড়</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        প্রায়ই অনলাইনে দেখা যায় পুরোনো ভিডিও, রিল বা ছবি নতুন ঘটনার ক্যাপশন দিয়ে ছড়ানো হচ্ছে। ছবিটি বা ভিডিওটি আসল হলেও সেটি ভিন্ন সময় বা ভিন্ন জায়গার হতে পারে। ফলে এর সঙ্গে জুড়ে দেওয়া লেখা একেবারেই বিভ্রান্তিকর হতে পারে।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এ ধরনের পরিস্থিতিতে রাজনৈতিকভাবে সচেতন থাকা জরুরি। কোনো খবর নিজের প্রোফাইল বা ইনবক্সে শেয়ার করার আগে চিন্তাভাবনা করুন এবং একাধিক বিশ্বস্ত সূত্র থেকে নিশ্চিত হয়ে নিন।
      </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">ডিপফেকের ফাঁদে পড়বেন না</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        বর্তমান কৃত্রিম বুদ্ধিমত্তা দিয়ে তৈরি ভুয়া ছবি, ভিডিও ও অডিও ভীষণ বাস্তবসম্মত মনে হতে পারে। অনেক সময় পরিচিত মানুষের মুখমণ্ডল অন্য কনটেন্টে বসিয়ে দেওয়া হয়।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        তবে সতর্ক হলে এখনও কিছু পার্থক্য ধরা যায়। যেমন—ভিডিওতে আঙুলের সংখ্যা স্বাভাবিক আছে কি না, চামড়ার টেক্সচার অস্বাভাবিক মসৃণ কি না, ঠোঁট নড়াচড়া ও কণ্ঠস্বর মিলছে কি না—এসব ছোটখাটো বিষয় খেয়াল করলেই অনেক সময় ভুয়া কনটেন্ট ধরা যায়।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এ ছাড়া অনলাইনে বিভিন্ন ডিপফেক শনাক্তকারী টুলসও পাওয়া যায়। তবুও নিজের সচেতন দৃষ্টি ও নির্ভরযোগ্য তথ্যসূত্রের প্রতি আস্থা রাখার বিকল্প নেই।
      </p>
    `,
    tags: ["ফ্যাক্টচেকিং", "ডিজিটাল সাক্ষরতা", "ভুয়া খবর", "সামাজিক মাধ্যম"],
    publishDate: "১০ ডিসেম্বর, ২০২৪",
    readTime: "৭ মিনিট",
    slug: "social-media-fake-news-identification",
  },
  {
    id: "2",
    title:
      'বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম হিসেবে "খোঁজ" – একটি বিস্তারিত যাচাই',
    author: "খোঁজ টিম (মাহাথির আহমেদ তুষার, সাগর চন্দ্র দে, তানিয়া চৈতি)",
    thumbnail: "https://i.postimg.cc/jd1mpLff/Khoj-banner.png",
    excerpt:
      "খোঁজ টিম হিসেবে আমরা বাংলাদেশের ডিজিটাল ল্যান্ডস্কেপে অসত্য তথ্যের বিরুদ্ধে লড়াই করার জন্য প্রতিশ্রুতিবদ্ধ। বাংলা ভাষায় কনটেন্টের দ্রুত বৃদ্ধির সাথে সাথে, মিসইনফরমেশনও বাড়ছে – বিশেষ করে সোশ্যাল মিডিয়া, নিউজ পোর্টাল এবং ভাইরাল পোস্টগুলোতে।",
    content: `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>লেখক:</strong> খোঁজ টিম (মাহাথির আহমেদ তুষার, সাগর চন্দ্র দে, তানিয়া চৈতি)</p>
        <p style="margin: 0 0 10px 0;"><strong>প্রকাশ তারিখ:</strong> সেপ্টেম্বর ৫, ২০২৫</p>
        <p style="margin: 0;"><strong>ক্যাটাগরি:</strong> টেকনোলজি এবং মিসইনফরমেশন</p>
      </div>

      <div style="margin-bottom: 30px;">
        <span style="background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">এআই</span>
        <span style="background-color: #e8f5e8; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ফ্যাক্টচেকিং</span>
        <span style="background-color: #fff3e0; color: #f57c00; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">বাংলা ভাষা</span>
        <span style="background-color: #fce4ec; color: #c2185b; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">অসত্য তথ্য প্রতিরোধ</span>
        <span style="background-color: #f3e5f5; color: #7b1fa2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ওপেন সোর্স</span>
      </div>

      <p style="margin-bottom: 20px; line-height: 1.8;">খোঁজ টিম হিসেবে আমরা বাংলাদেশের ডিজিটাল ল্যান্ডস্কেপে অসত্য তথ্যের বিরুদ্ধে লড়াই করার জন্য প্রতিশ্রুতিবদ্ধ। বাংলা ভাষায় কনটেন্টের দ্রুত বৃদ্ধির সাথে সাথে, মিসইনফরমেশনও বাড়ছে – বিশেষ করে সোশ্যাল মিডিয়া, নিউজ পোর্টাল এবং ভাইরাল পোস্টগুলোতে। আমাদের দাবি: "খোঁজ" হলো বাংলা ভাষায় প্রথম পূর্ণাঙ্গ কৃত্রিম বুদ্ধিমত্তা (এআই)-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম। এই আর্টিকেলে আমরা এই দাবিকে বিস্তারিতভাবে যাচাই করব, প্রমাণ উপস্থাপন করব এবং দেখাব কেন আমরা এটিকে বানিয়েছি। আমরা বিভিন্ন সোর্স থেকে অনুসন্ধান চালিয়েছি, যা থেকে স্পষ্ট হয় যে বাংলা ভাষায় এমন কোনো সম্পূর্ণ এআই-চালিত প্ল্যাটফর্ম আগে ছিল না। এই যাচাইয়ের ভিত্তিতে আমরা ভার্ডিক্ট দিচ্ছি: সত্য (True)।</p>

      <p style="margin-bottom: 30px; line-height: 1.8;">এই আর্টিকেলে আমরা বাংলা ভাষার চ্যালেঞ্জগুলো, বিদ্যমান ফ্যাক্টচেকিং ইনিশিয়েটিভসের সীমাবদ্ধতা, খোঁজের অনন্য ফিচারস এবং প্রমাণসমূহ উপস্থাপন করব। সব প্রমাণ বিশ্বাসযোগ্য সোর্স থেকে নেওয়া, এবং রেফারেন্সগুলো [১], [২] ফরম্যাটে নীচে তালিকাভুক্ত করা হবে।</p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">দাবি: খোঁজ হলো বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকার</h2>

      <p style="margin-bottom: 20px; line-height: 1.8;">আমাদের দাবি স্পষ্ট: খোঁজ হলো প্রথম প্ল্যাটফর্ম যা বাংলা ভাষায় দাবি যাচাই করার জন্য এআই-কে সম্পূর্ণভাবে ব্যবহার করে, স্ট্রাকচার্ড রিপোর্ট তৈরি করে এবং মাল্টিমিডিয়া যাচাইয়ের সুবিধা দেয়। এটি ওপেন-সোর্স, ইউজার-ফ্রেন্ডলি এবং বাংলাদেশী কনটেক্সটে ডিজাইন করা। কিন্তু কেন আমরা বলছি এটি "প্রথম"? কারণ আমাদের অনুসন্ধান থেকে প্রমাণিত যে বাংলা ভাষায় এআই-ভিত্তিক ফ্যাক্টচেকিংয়ের জন্য কোনো পূর্ববর্তী পূর্ণাঙ্গ প্ল্যাটফর্ম নেই।</p>

      <p style="margin-bottom: 30px; line-height: 1.8;">বাংলা ভাষায় অসত্য তথ্যের সমস্যা গুরুতর। বাংলাদেশে সোশ্যাল মিডিয়ায় ছড়ানো রুমরগুলো প্রায়ই রাজনৈতিক অস্থিরতা বা সামাজিক বিভেদ সৃষ্টি করে। একটি গবেষণায় দেখা গেছে যে বাংলা নিউজ আর্টিকেলে ম্যানিপুলেটেড কনটেন্ট শনাক্ত করার জন্য নতুন মডেল প্রয়োজন, কিন্তু এমন কোনো প্ল্যাটফর্ম নেই যা এটি এআই দিয়ে করে [১]। অন্য একটি স্টাডিতে বাংলাদেশে ডিসইনফরমেশনের চ্যালেঞ্জস উল্লেখ করা হয়েছে, যেখানে এআই-কে অস্ত্র হিসেবে ব্যবহার করা হচ্ছে অসত্য কনটেন্ট তৈরিতে, কিন্তু প্রতিরোধে নয় [২]।</p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">বিদ্যমান ফ্যাক্টচেকিং ইনিশিয়েটিভসের সীমাবদ্ধতা: কেন খোঁজ প্রয়োজনীয়</h2>

      <p style="margin-bottom: 20px; line-height: 1.8;">বাংলাদেশ এবং ভারতে বিভিন্ন ফ্যাক্টচেকিং সংস্থা আছে, কিন্তু এগুলো মূলত ম্যানুয়াল – এআই-ভিত্তিক নয়। আমাদের অনুসন্ধানে ৫০টিরও বেশি সোর্স পরীক্ষা করা হয়েছে, যেখানে কীওয়ার্ড ব্যবহৃত হয়েছে: "AI-powered Bengali fact-checking platforms", "বাংলা ভাষায় এআই ভিত্তিক ফ্যাক্ট চেকিং প্ল্যাটফর্ম", এবং "existing AI based fact checker in Bengali language"। ফলাফল থেকে স্পষ্ট যে বাংলা ভাষায় কোনো পূর্ণাঙ্গ এআই-চালিত ফ্যাক্টচেকার নেই। নিম্নে কিছু উদাহরণ দেওয়া হলো:</p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">ম্যানুয়াল ফ্যাক্টচেকার</h3>
      <ul style="margin-bottom: 25px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>BD Fact Check, Jacchai, Fact Watch:</strong> এগুলো বাংলাদেশে ২০১৭ সাল থেকে চালু, কিন্তু ম্যানুয়াল ফ্যাক্টচেকিং করে। এআই ইন্টিগ্রেশন নেই [৩]।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>Rumor Scanner:</strong> একটি অ্যাপ যা সোশ্যাল মিডিয়ায় রুমর ডিবাঙ্ক করে, কিন্তু এআই-চালিত নয় – ম্যানুয়াল ভেরিফিকেশন [৪]।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>BOOM Fact Check:</strong> ভারতে মাল্টিলিঙ্গুয়াল (বাংলা সহ), কিন্তু মূলত হিউম্যান ফ্যাক্টচেকার দিয়ে চলে [৫]।</li>
      </ul>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">আন্তর্জাতিক প্ল্যাটফর্ম</h3>
      <ul style="margin-bottom: 25px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>AFP Bangladesh:</strong> আন্তর্জাতিক ফ্যাক্টচেকিং, কিন্তু এআই-ভিত্তিক নয় [৬]।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>BanglaFact (PIB):</strong> সরকারি প্ল্যাটফর্ম, কিন্তু ম্যানুয়াল [৭]।</li>
        <li style="margin-bottom: 10px; line-height: 1.6;"><strong>Factly-এর Tagore AI:</strong> চ্যাটবট যা ভেরিফায়েড কনটেন্ট থেকে উত্তর দেয়, কিন্তু মূলত ইংরেজি এবং অন্যান্য ভারতীপ ভাষায় ফোকাসড, বাংলা-কেন্দ্রিক নয় [১০] [১১]।</li>
      </ul>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">জেনারেটিভ এআই ফ্যাক্টচেকারদের সাহায্য করছে, কিন্তু ছোট ভাষা যেমন বাংলায় এর ব্যবহার সীমিত [৮] [৯]। iVerify-এর মতো টুল এআই ব্যবহার করে, কিন্তু গ্লোবাল এবং বাংলা-স্পেসিফিক নয় [১২]। Factiverse AI Editor টেক্সট ফ্যাক্টচেক করে, কিন্তু বাংলা ফোকাস নেই [১৩]।</p>

      <p style="margin-bottom: 30px; line-height: 1.8;">এই ফাঁকি দেখে আমরা খোঁজ বানিয়েছি – বাংলা ভাষায় এআই-কে ব্যবহার করে অসত্য তথ্য প্রতিরোধ করার জন্য [১৪]। বাংলা ভাষার জটিলতা (যেমন উপভাষা, সাংস্কৃতিক ন্যুয়ান্স) এবং ডেটাসেটের অভাব এই ধরনের উদ্যোগকে চ্যালেঞ্জিং করে তুলেছে [১১] [১৬]।</p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">খোঁজের অনন্য ফিচারস: কেন এটি প্রথম এবং পূর্ণাঙ্গ</h2>

      <p style="margin-bottom: 20px; line-height: 1.8;">খোঁজ একটি ওপেন-সোর্স প্ল্যাটফর্ম (MIT লাইসেন্স), যা Next.js 14, TypeScript এবং আধুনিক এআই মডেলস (Google Gemini, DeepSeek, GROQ) ব্যবহার করে তৈরি। এর ফিচারস এটিকে প্রথম এবং পূর্ণাঙ্গ করে তোলে [১৭]:</p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">🤖 এআই ফ্যাক্টচেকিং</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">বাংলায় দাবি সাবমিট করলে স্ট্রাকচার্ড রিপোর্ট তৈরি হয়, যাতে ভার্ডিক্ট (যেমন সত্য, মিথ্যা, ভ্রান্তিমূলক) এবং ১০টি সোর্স থাকে। এটি ডোমেইন-ফার্স্ট সার্চ স্ট্র্যাটেজি ব্যবহার করে বিশ্বস্ত বাংলাদেশী সোর্স (যেমন নিউজ/ফ্যাক্টচেক সাইট) প্রায়োরিটাইজ করে, প্রয়োজন হলে ইংরেজি সোর্স যোগ করে। এটি মিক্সড-ল্যাঙ্গুয়েজ সোর্সিং সমর্থন করে, কিন্তু রিপোর্ট সবসময় বাংলায় দেয়।</p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">🖼️ মাল্টিমিডিয়া যাচাই</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">ইমেজ অথেনটিসিটি চেক (Sightengine ব্যবহার করে এআই-জেনারেটেড ইমেজ শনাক্ত করে), রিভার্স ইমেজ সার্চ (Google Lens via SerpAPI), এবং টেক্সট অ্যানালাইসিস (Winston AI দিয়ে এআই-ডিটেকশন এবং প্লেজিয়ারিজম চেক)। এই ফিচারগুলো বাংলা কনটেন্টের জন্য বিশেষভাবে অপটিমাইজড।</p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">🛠️ স্পেশালাইজড টুলস</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">Mukti Corner (মুক্তিযুদ্ধ ১৯৭১-এর ইতিহাস ও তথ্য যাচাইয়ের জন্য এআই চ্যাট, FAISS ডাটাবেস এবং Gemini AI ব্যবহার করে) এবং Mythbusting (রুমর ও মিথ ডিবাঙ্কিংয়ের জন্য এআই-চালিত চ্যাট)। এগুলো বাংলাদেশের ঐতিহাসিক ও সাংস্কৃতিক কনটেক্সটকে সম্মান করে।</p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">🎨 ইউজার ইন্টারফেস</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">টেলউইন্ড সিএসএস দিয়ে তৈরি রেসপন্সিভ ইউআই, বাংলা টাইপোগ্রাফি (Solaiman Lipi ফন্ট), এবং রেড-গ্রিন থিম বাংলাদেশী আইডেন্টিটি প্রতিফলিত করে। ফ্যাক্টচেক লাইব্রেরি, রেকমেন্ডেশন সিস্টেম (প্রতি আর্টিকেলে ৫টি সম্পর্কিত আর্টিকেল), এবং ইউজার-জেনারেটেড রিপোর্টের লোকাল স্টোরেজ আছে।</p>

      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">⚡ টেক স্ট্যাক এবং স্কেলেবিলিটি</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">এপিআই এন্ডপয়েন্টস (যেমন /api/factcheck, /api/image-check) JSON রিটার্ন করে, যা স্কেলেবল। ১৬টি Tavily API কী ফলব্যাক সিস্টেম দিয়ে ১৬০০ সার্চ/মাস সমর্থন করে। এটি ওপেন-সোর্স (MIT লাইসেন্স), যা কমিউনিটি কনট্রিবিউশনকে উৎসাহিত করে। ভবিষ্যত রোডম্যাপে অডিও/ভিডিও সার্চ, ইউজার অথেনটিকেশন, এবং অ্যানালিটিক্স ড্যাশবোর্ড আছে।</p>

      <p style="margin-bottom: 20px; line-height: 1.8;">এই ফিচারগুলো বাংলা ভাষায় প্রথমবারের মতো একত্রিত করা হয়েছে, যা অন্য কোনো প্ল্যাটফর্মে পাওয়া যায়নি [১৭]। আমরা এটি বানিয়েছি কারণ বাংলা ভাষায় ডেটাসেটের অভাব এবং ভাষাগত জটিলতা (যেমন উপভাষা, সাংস্কৃতিক ন্যুয়ান্স) সত্ত্বেও, এআই-এর সম্ভাবনা অসীম – এবং আমরা সেই ফাঁকি পূরণ করেছি [১৫] [১৬]।</p>

      <p style="margin-bottom: 30px; line-height: 1.8;">উদাহরণস্বরূপ, Bengali.AI-এর মতো প্রজেক্ট বাংলা ভাষায় এআই রিসার্চ করে (যেমন OCR, স্পিচ রিকগনিশন), কিন্তু ফ্যাক্টচেকিং নয় [১৮]। খোঁজের প্রতিষ্ঠাতা মাহাথির আহমেদ তুষার, ইউআই ডিজাইনার সাগর চন্দ্র দে, এবং রিসার্চার তানিয়া চৈতি এটিকে বাংলাদেশী কনটেক্সটে ডিজাইন করেছেন। এটি মিসইনফরমেশনের বিরুদ্ধে লড়াই করে এবং ডিজিটাল লিটারেসি প্রমোট করে, বিশেষ করে মুক্তিযুদ্ধের টপিকসে, যা অন্য কোনো প্ল্যাটফর্মে এভাবে সমাধান করা হয়নি [১৯]।</p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">ভার্ডিক্ট: ✅ সত্য (True)</h2>

      <p style="margin-bottom: 30px; line-height: 1.8;">আমাদের বিস্তারিত অনুসন্ধান থেকে প্রমাণিত যে বাংলা ভাষায় কোনো পূর্ববর্তী পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম নেই। খোঁজ প্রথম কারণ এটি বাংলা-কেন্দ্রিক, এআই-চালিত, এবং সম্পূর্ণ – টেক্সট, ইমেজ, এবং ঐতিহাসিক তথ্য যাচাইয়ের সমন্বিত সমাধান প্রদান করে। এটি শুধু অসত্য তথ্য প্রতিরোধই করে না, বরং বাংলাদেশে ডিজিটাল লিটারেসি বাড়ায়। আমরা আশা করি খোঁজ অন্যদের অনুপ্রাণিত করবে এবং ভবিষ্যতে আরও বড় প্রভাব ফেলবে [১৭] [২০]।</p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">রেফারেন্স</h2>
      <ol style="padding-left: 20px; margin-bottom: 30px;">
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.sciencedirect.com/science/article/pii/S2949719125000317" target="_blank" style="color: #3498db; text-decoration: none;">https://www.sciencedirect.com/science/article/pii/S2949719125000317</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://papers.iafor.org/wp-content/uploads/papers/accs2024/ACCS2024_80137.pdf" target="_blank" style="color: #3498db; text-decoration: none;">https://papers.iafor.org/wp-content/uploads/papers/accs2024/ACCS2024_80137.pdf</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.bssnews.net/fact-check" target="_blank" style="color: #3498db; text-decoration: none;">https://www.bssnews.net/fact-check</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://play.google.com/store/apps/details?id=com.rumorscanner.app&hl=en_US" target="_blank" style="color: #3498db; text-decoration: none;">https://play.google.com/store/apps/details?id=com.rumorscanner.app&hl=en_US</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.boomlive.in/" target="_blank" style="color: #3498db; text-decoration: none;">https://www.boomlive.in/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://factcheck.afp.com/AFP-Bangladesh" target="_blank" style="color: #3498db; text-decoration: none;">https://factcheck.afp.com/AFP-Bangladesh</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://ijpmonline.com/index.php/ojs/article/download/65/69" target="_blank" style="color: #3498db; text-decoration: none;">https://ijpmonline.com/index.php/ojs/article/download/65/69</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://reutersinstitute.politics.ox.ac.uk/news/generative-ai-already-helping-fact-checkers-its-proving-less-useful-small-languages-and" target="_blank" style="color: #3498db; text-decoration: none;">https://reutersinstitute.politics.ox.ac.uk/news/generative-ai-already-helping-fact-checkers-its-proving-less-useful-small-languages-and</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://gijn.org/stories/how-generative-ai-helps-fact-checkers/" target="_blank" style="color: #3498db; text-decoration: none;">https://gijn.org/stories/how-generative-ai-helps-fact-checkers/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://factlymedia.com/products/" target="_blank" style="color: #3498db; text-decoration: none;">https://factlymedia.com/products/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.poynter.org/fact-checking/2024/factly-india-artificial-intelligence-fact-checking/" target="_blank" style="color: #3498db; text-decoration: none;">https://www.poynter.org/fact-checking/2024/factly-india-artificial-intelligence-fact-checking/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.undp.org/digital/stories/ai-powered-fact-checking-tool-iverify-piloted-during-zambia-election-shows-global-promise" target="_blank" style="color: #3498db; text-decoration: none;">https://www.undp.org/digital/stories/ai-powered-fact-checking-tool-iverify-piloted-during-zambia-election-shows-global-promise</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://www.factiverse.ai/blog/revolutionising-fact-checking-with-factiverse-ai-editor" target="_blank" style="color: #3498db; text-decoration: none;">https://www.factiverse.ai/blog/revolutionising-fact-checking-with-factiverse-ai-editor</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://projectshakti.in/" target="_blank" style="color: #3498db; text-decoration: none;">https://projectshakti.in/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://arxiv.org/abs/1811.01806" target="_blank" style="color: #3498db; text-decoration: none;">https://arxiv.org/abs/1811.01806</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://edam.org.tr/Uploads/Yukleme_Resim/pdf-28-08-2023-23-40-14.pdf" target="_blank" style="color: #3498db; text-decoration: none;">https://edam.org.tr/Uploads/Yukleme_Resim/pdf-28-08-2023-23-40-14.pdf</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://github.com/Mahatir-Ahmed-Tusher/Khoj" target="_blank" style="color: #3498db; text-decoration: none;">https://github.com/Mahatir-Ahmed-Tusher/Khoj</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://bengali.ai/" target="_blank" style="color: #3498db; text-decoration: none;">https://bengali.ai/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://wan-ifra.org/2025/05/from-norway-to-india-how-ai-is-reshaping-global-fact-checking-efforts/" target="_blank" style="color: #3498db; text-decoration: none;">https://wan-ifra.org/2025/05/from-norway-to-india-how-ai-is-reshaping-global-fact-checking-efforts/</a></li>
        <li style="margin-bottom: 8px; line-height: 1.6;"><a href="https://felo.ai/blog/ai-fact-checking-tool/" target="_blank" style="color: #3498db; text-decoration: none;">https://felo.ai/blog/ai-fact-checking-tool/</a></li>
      </ol>
    `,
    tags: [
      "খোঁজ",
      "এআই",
      "ফ্যাক্টচেকিং",
      "যাচাই",
      "বাংলা ভাষা",
      "অসত্য তথ্য প্রতিরোধ",
      "ওপেন সোর্স",
    ],
    publishDate: "৫ সেপ্টেম্বর, ২০২৫",
    readTime: "১২ মিনিট",
    slug: "khoj-ai-factchecker-verification",
  },
  {
    id: "3",
    title: "জলবায়ু পরিবর্তন: বৈজ্ঞানিক তথ্য বনাম ভুল ধারণা",
    author: "সালেহা ভুইয়া",
    thumbnail: "https://i.postimg.cc/zGV717ND/Your-paragraph-text-5.png",
    excerpt:
      "জলবায়ু পরিবর্তন শুধু বৈজ্ঞানিক ইস্যু নয়—এটি একসাথে রাজনৈতিক, অর্থনৈতিক, সামাজিক ও নৈতিক ইস্যু। পৃথিবীর প্রতিটি মানুষের জীবনে এর প্রভাব রয়েছে, অথচ এখনো অনেকেই একে অবহেলা করে বা ভুল বোঝে।",
    content: `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>লেখক:</strong> সালেহা ভুইয়া</p>
        <p style="margin: 0 0 10px 0;"><strong>প্রকাশ তারিখ:</strong> ৫ আগস্ট, ২০২৫</p>
        <p style="margin: 0;"><strong>ক্যাটাগরি:</strong> পরিবেশ এবং বিজ্ঞান</p>
      </div>

      <div style="margin-bottom: 30px;">
        <span style="background-color: #e8f5e8; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">জলবায়ু পরিবর্তন</span>
        <span style="background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">পরিবেশ</span>
        <span style="background-color: #fff3e0; color: #f57c00; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">বিজ্ঞান</span>
        <span style="background-color: #fce4ec; color: #c2185b; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ভুল ধারণা</span>
      </div>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">১. ভূমিকা: বিতর্কের কেন্দ্রে জলবায়ু পরিবর্তন</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
            জলবায়ু পরিবর্তন (Climate Change) শুধু বৈজ্ঞানিক ইস্যু নয়—এটি একসাথে রাজনৈতিক, অর্থনৈতিক, সামাজিক ও নৈতিক ইস্যু। পৃথিবীর প্রতিটি মানুষের জীবনে এর প্রভাব রয়েছে, অথচ এখনো অনেকেই একে অবহেলা করে বা ভুল বোঝে। কিছু মানুষ একে প্রাকৃতিক প্রক্রিয়া বলে উড়িয়ে দেন, কেউ বলেন এটি <strong>"পশ্চিমা দেশগুলোর ষড়যন্ত্র"</strong>, আবার কেউ মনে করেন ভবিষ্যতের প্রযুক্তি একে সহজেই সামলে নেবে।
          </p>
          
      <p style="margin-bottom: 30px; line-height: 1.8;">
            কিন্তু বাস্তবতা হলো, আন্তর্জাতিক সংস্থা <strong>IPCC (Intergovernmental Panel on Climate Change)</strong> এবং বিশ্বের শীর্ষস্থানীয় বিজ্ঞানীরা দীর্ঘ গবেষণা শেষে নিশ্চিত করেছেন—জলবায়ু পরিবর্তন মূলত মানুষের কর্মকাণ্ড দ্বারা সৃষ্ট একটি বাস্তব সংকট।
          </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">২. জলবায়ু পরিবর্তনের বৈজ্ঞানিক প্রমাণ</h2>
          
          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">২.১ তাপমাত্রার ঊর্ধ্বগতি</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;">১৮৮০ সাল থেকে আজ পর্যন্ত পৃথিবীর গড় তাপমাত্রা প্রায় <strong>১.২°C</strong> বেড়েছে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>২০১৬, ২০১৯ এবং ২০২০</strong> ছিল রেকর্ড করা সবচেয়ে উষ্ণ বছরগুলোর মধ্যে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">তাপমাত্রা বৃদ্ধির সাথে সাথে সমুদ্রের পানিও উষ্ণ হচ্ছে, যা ঝড় ও ঘূর্ণিঝড়ের শক্তি বাড়িয়ে তুলছে।</li>
            </ul>

          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">২.২ গ্রিনহাউস গ্যাস নির্গমন</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>কার্বন-ডাই-অক্সাইড (CO₂), মিথেন (CH₄), নাইট্রাস অক্সাইড (N₂O)</strong>—এসব গ্যাস সূর্যের তাপ ধরে রাখে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">শিল্পবিপ্লবের আগে CO₂ এর পরিমাণ ছিল প্রায় <strong>২৮০ ppm</strong>, এখন তা <strong>৪২০ ppm</strong> এরও বেশি।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">এর মূল উৎস হলো—<strong>জীবাশ্ম জ্বালানি পোড়ানো, বন ধ্বংস, শিল্পকারখানার বর্জ্য</strong>।</li>
            </ul>

          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">২.৩ বরফ গলন ও সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>অ্যান্টার্কটিকা ও গ্রিনল্যান্ড</strong> প্রতিবছর কোটি কোটি টন বরফ হারাচ্ছে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">সমুদ্রপৃষ্ঠের উচ্চতা <strong>১৯০১ থেকে ২০২০</strong> পর্যন্ত প্রায় <strong>২০ সেন্টিমিটার</strong> বেড়েছে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>মালদ্বীপ, বাংলাদেশসহ</strong> উপকূলীয় দেশগুলো অস্তিত্ব সংকটে পড়েছে।</li>
            </ul>

          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">২.৪ অস্বাভাবিক আবহাওয়া</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>ইউরোপে তীব্র দাবদাহ, আফ্রিকায় দীর্ঘ খরা, এশিয়ায় অস্বাভাবিক বন্যা</strong>।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">বাংলাদেশে ঘূর্ণিঝড় <strong>সিডর, আইলা, আম্পান এবং সাম্প্রতিক ইয়াস</strong> জলবায়ু পরিবর্তনের প্রভাবের শক্ত উদাহরণ।</li>
            </ul>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৩. প্রচলিত ভুল ধারণা বনাম বৈজ্ঞানিক বাস্তবতা</h2>
          <div style="overflow-x: auto; margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">ভুল ধারণা</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">বৈজ্ঞানিক তথ্য</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">জলবায়ু পরিবর্তন প্রাকৃতিক, এতে মানুষের কিছু করার নেই।</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">হ্যাঁ, প্রাকৃতিক পরিবর্তন আগে হয়েছে, কিন্তু আজকের পরিবর্তনের গতি <strong>৫০ গুণ বেশি</strong> এবং এর <strong>৯৫% কারণ মানুষ</strong>।</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">শীতকালে বেশি ঠান্ডা মানে জলবায়ু পরিবর্তন নেই।</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">এটি আবহাওয়ার অস্বাভাবিকতা; গড় বিশ্ব তাপমাত্রা ধারাবাহিকভাবে বাড়ছে।</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">বিজ্ঞানীরা একমত নন।</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">গবেষণা বলছে, প্রায় <strong>৯৭% জলবায়ু বিজ্ঞানী</strong> একমত—মানুষের কর্মকাণ্ডই প্রধান কারণ।</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">প্রযুক্তি ভবিষ্যতে সমাধান করবে, তাই এখন পদক্ষেপের দরকার নেই।</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">প্রযুক্তি সহায়ক হবে, কিন্তু <strong>তাৎক্ষণিক নির্গমন কমানো</strong> ছাড়া বিপর্যয় ঠেকানো যাবে না।</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">বাংলাদেশের মতো ছোট দেশের ভূমিকা নেই।</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">প্রতিটি দেশের অবদান জরুরি। তাছাড়া <strong>বাংলাদেশই সবচেয়ে বেশি ক্ষতিগ্রস্ত দেশগুলোর একটি</strong>।</td>
                </tr>
              </tbody>
            </table>
        </div>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৪. জলবায়ু পরিবর্তনের ইতিহাস ও রাজনীতি</h2>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>শিল্পবিপ্লব (১৮শ শতক):</strong> কয়লা ও তেলভিত্তিক শিল্পায়ন শুরু।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>২০শ শতক:</strong> জীবাশ্ম জ্বালানি নির্ভর উন্নয়ন মডেল বিশ্বজুড়ে বিস্তার।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>১৯৯২, রিও সামিট:</strong> প্রথম বড় আন্তর্জাতিক জলবায়ু সম্মেলন।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>১৯৯৭, কিয়োটো প্রোটোকল:</strong> নির্গমন কমানোর চুক্তি।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>২০১৫, প্যারিস চুক্তি:</strong> ১৯৫টি দেশ ১.৫°C তাপমাত্রা নিয়ন্ত্রণে রাখার প্রতিশ্রুতি দেয়।</li>
          </ul>
          
          <p style="margin-bottom: 30px; line-height: 1.8;">
            রাজনীতি ও অর্থনীতি জলবায়ু আলোচনার বড় অংশ। <strong>উন্নত দেশগুলো</strong> ইতিহাসে সবচেয়ে বেশি দূষণ করেছে, অথচ আজকের ক্ষতির বোঝা <strong>উন্নয়নশীল দেশগুলো</strong> বহন করছে।
          </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৫. জলবায়ু পরিবর্তন ও বাংলাদেশ</h2>
          <p style="margin-bottom: 20px; line-height: 1.8;">
            <strong>বাংলাদেশ হলো বিশ্বের সবচেয়ে ঝুঁকিপূর্ণ দেশগুলোর একটি:</strong>
          </p>
          
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>উপকূলীয় এলাকা:</strong> সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধিতে লক্ষ লক্ষ মানুষ বাস্তুচ্যুত হওয়ার ঝুঁকিতে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>ঘূর্ণিঝড়:</strong> বঙ্গোপসাগরে ঘূর্ণিঝড়ের সংখ্যা ও তীব্রতা বেড়েছে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>কৃষি:</strong> খরা, লবণাক্ততা ও অনিয়মিত বৃষ্টিপাত ফসল উৎপাদন কমাচ্ছে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>স্বাস্থ্য:</strong> ডেঙ্গু, ম্যালেরিয়া, তাপঘাত—এসব রোগ বেড়ে যাচ্ছে।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>অভিবাসন সংকট:</strong> জলবায়ু শরণার্থী হয়ে মানুষ রাজধানীসহ শহরমুখী হচ্ছে।</li>
          </ul>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৬. ভুল তথ্য ও বিভ্রান্তি: বড় বাধা</h2>
          <p style="margin-bottom: 20px; line-height: 1.8;">
            আজকের ডিজিটাল যুগে <strong>অসত্য প্রচারণা (misinformation)</strong> বড় সমস্যা। অনেকেই মনে করেন:
          </p>
          
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;">"বাংলাদেশ কিছুই করতে পারবে না, তাই চেষ্টা করার দরকার নেই।"</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">"সব ষড়যন্ত্র, জলবায়ু পরিবর্তন বলে কিছু নেই।"</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">"যারা গাছ লাগায় তারা শুধু রাজনীতি করছে।"</li>
          </ul>
          
          <p style="margin-bottom: 30px; line-height: 1.8;">
            এসব ভুল ধারণা পরিবেশ আন্দোলনকে দুর্বল করে দেয়। <strong>সঠিক বৈজ্ঞানিক তথ্য ও সচেতনতা জরুরি</strong>।
          </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৭. পরিবেশ রক্ষায় করণীয়</h2>
          
          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">৭.১ সরকার ও নীতি পর্যায়ে</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>নবায়নযোগ্য শক্তিতে</strong> বড় বিনিয়োগ।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>বন উজাড় রোধে</strong> কঠোর আইন।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>শিল্পকারখানার দূষণ</strong> নিয়ন্ত্রণ।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>আন্তর্জাতিক জলবায়ু তহবিল</strong> থেকে ক্ষতিপূরণ আদায়।</li>
            </ul>

          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">৭.২ ব্যক্তি ও সমাজ পর্যায়ে</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>গাছ লাগানো</strong> ও যত্ন নেওয়া।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>বিদ্যুৎ ও পানির অপচয়</strong> কমানো।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>সাইকেল/গণপরিবহন</strong> ব্যবহার।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>প্লাস্টিক বর্জন</strong> ও পুনর্ব্যবহার।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>পরিবেশবান্ধব কৃষি</strong> চর্চা।</li>
            </ul>

          <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">৭.৩ শিক্ষা ও সচেতনতা</h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;">স্কুল-কলেজের পাঠ্যক্রমে <strong>জলবায়ু শিক্ষা</strong> অন্তর্ভুক্ত।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">মিডিয়া ও সোশ্যাল মিডিয়ায় <strong>সঠিক তথ্য</strong> প্রচার।</li>
            <li style="margin-bottom: 10px; line-height: 1.6;">ভুল তথ্য প্রতিহত করতে <strong>বিজ্ঞানভিত্তিক প্রচারণা</strong>।</li>
            </ul>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৮. ভবিষ্যৎ করণীয় ও আশার আলো</h2>
          <p style="margin-bottom: 20px; line-height: 1.8;">
            জলবায়ু পরিবর্তন রোধ করা এখনও সম্ভব, তবে <strong>সময় দ্রুত ফুরিয়ে যাচ্ছে</strong>। যদি এখনই কার্বন নির্গমন কমানো যায়, নবায়নযোগ্য শক্তি ব্যবহার বাড়ানো যায় এবং সচেতনতা ছড়ানো যায়—তাহলে বিপর্যয় ঠেকানো সম্ভব।
          </p>
          
          <p style="margin-bottom: 30px; line-height: 1.8;">
            বিশ্বজুড়ে <strong>নবায়নযোগ্য শক্তির ব্যবহার বাড়ছে</strong>, তরুণ প্রজন্ম প্রতিবাদী হচ্ছে, প্রযুক্তি উন্নত হচ্ছে। এসবই আমাদের আশা জাগায়।
          </p>

      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">৯. উপসংহার</h2>
          <p style="margin-bottom: 20px; line-height: 1.8;">
            জলবায়ু পরিবর্তন কোনো দূরের সমস্যা নয়—এটি <strong>এখনই আমাদের জীবনে প্রভাব ফেলছে</strong>। বৈজ্ঞানিক তথ্য স্পষ্টভাবে বলছে মানুষই এর প্রধান কারণ। অথচ ভুল ধারণা ও মিথ প্রচারণা মানুষকে বিভ্রান্ত করছে।
          </p>
          
          <p style="margin-bottom: 20px; line-height: 1.8;">
            তাই এখন আমাদের করণীয় হলো:
          </p>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>ভুল ধারণা ভাঙা</strong></li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>সঠিক বৈজ্ঞানিক তথ্য প্রচার</strong></li>
            <li style="margin-bottom: 10px; line-height: 1.6;"><strong>সম্মিলিত পদক্ষেপ নেওয়া</strong></li>
          </ul>
          
          <p style="margin-bottom: 30px; line-height: 1.8;">
            <strong>পৃথিবী আমাদের একটাই।</strong> ভবিষ্যৎ প্রজন্মকে একটি বাসযোগ্য পৃথিবী উপহার দেওয়ার জন্য আজই আমাদের সচেতন, দায়িত্বশীল ও ঐক্যবদ্ধ হতে হবে।
          </p>
    `,
    tags: ["জলবায়ু পরিবর্তন", "পরিবেশ", "বিজ্ঞান", "ভুল ধারণা"],
    publishDate: "৫ আগস্ট, ২০২৫",
    readTime: "১০ মিনিট",
    slug: "climate-change-science-vs-misconceptions",
  },
  {
    id: "4",
    title: "খোঁজ, বাংলা ভাষার প্রথম এআই-চালিত ফ্যাক্টচেকারের অভিনব যাত্রা",
    author: "খোঁজ টিম",
    thumbnail: "https://i.postimg.cc/FFPY2NBX/image.png",
    excerpt:
      "আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের স্রোত বয়ে চলেছে। কিন্তু তার ভেতরে আসলটা কোথায়, মিথ্যাটা কোথায়, সে পার্থক্য করা কি সহজ? ফেসবুকের নিউজ ফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট, কিংবা নিউজ অ্যাপ। সব জায়গায় অসত্য খবর, গুজব আর অর্ধসত্য ভেসে বেড়ায়।",
    content: `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>লেখক:</strong> খোঁজ টিম</p>
        <p style="margin: 0 0 10px 0;"><strong>প্রকাশ তারিখ:</strong> ১৫ সেপ্টেম্বর, ২০২৫</p>
        <p style="margin: 0;"><strong>ক্যাটাগরি:</strong> প্রযুক্তি এবং এআই</p>
      </div>

      <div style="margin-bottom: 30px;">
        <span style="background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">খোঁজ</span>
        <span style="background-color: #e8f5e8; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">এআই</span>
        <span style="background-color: #fff3e0; color: #f57c00; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ফ্যাক্টচেকিং</span>
        <span style="background-color: #fce4ec; color: #c2185b; padding: 6px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">ডিজিটাল সাক্ষরতা</span>
      </div>

      <p style="margin-bottom: 20px; line-height: 1.8; font-size: 18px; font-weight: 500;">
        আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের স্রোত বয়ে চলেছে। কিন্তু তার ভেতরে আসলটা কোথায়, মিথ্যাটা কোথায়, সে পার্থক্য করা কি সহজ? ফেসবুকের নিউজ ফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট, কিংবা নিউজ অ্যাপ। সব জায়গায় অসত্য খবর, গুজব আর অর্ধসত্য ভেসে বেড়ায়। বাংলা ভাষার কোটি মানুষের জন্য এ এক বিশাল চ্যালেঞ্জ। কারণ সত্য যাচাইয়ের নির্ভরযোগ্য ব্যবস্থা না থাকলে এর ফল হতে পারে ভয়াবহ।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এই ভয়ঙ্কর বিভ্রান্তির সময় থেকেই জন্ম নিয়েছে <strong>"<a href="https://www.khoj-bd.com/" style="color: #1976d2; text-decoration: none;">খোঁজ</a>"</strong>, বাংলা ভাষার প্রথম এবং সবচেয়ে পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম [১]।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        <a href="https://youtu.be/M89gdblo93w?si=HqvaYKjS5R8d5mDR" style="color: #1976d2; text-decoration: none;">টেক্সট, ছবি, ঐতিহাসিক ঘটনা কিংবা ভাইরাল হয়ে ছড়িয়ে পড়া গুজব, সবকিছুর সত্যতা যাচাই করতে <em>খোঁজ</em> হয়ে উঠতে পারে আপনার নির্ভরযোগ্য সঙ্গী, আপনারই মাতৃভাষায়</a>। ডিজিটাল যুগে সত্যকে ফিরিয়ে আনার জন্যই এর জন্ম, আর তাই এটি হয়ে উঠতে পারে ডিজিটাল সাক্ষরতা বাড়ানোর অপরিহার্য হাতিয়ার।
      </p>
      
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <a href="https://www.khoj-bd.com/" style="color: #1976d2; text-decoration: none;">
          <img src="https://bigganblog.org/wp-content/uploads/2025/09/image-2-1024x479.png" alt="খোঁজের মূল পাতা" style="max-width: 100%; height: auto; border-radius: 8px;"/>
        </a>
        <p style="margin: 10px 0 0 0; font-style: italic; color: #666;"><strong>চিত্রঃ</strong> খোঁজের মূল পাতা, লিংকঃ https://www.khoj-bd.com/</p>
      </div>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ভাবুন তো, একদিন হুট করে অনলাইনে চোখে পড়ল এমন এক খবর, কোনো বড়সড় মিডিয়ায় নেই, কিন্তু ফেসবুক-হোয়াটসঅ্যাপে শেয়ার আর কমেন্ট দেখে মনে হচ্ছে আসলেই সত্য:<br/>"একটি নির্দিষ্ট ব্যাংক থেকে কোটি কোটি টাকা ডাকাতি হয়েছে, হাজারো মানুষ নিঃস্ব।"
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এমন অনিশ্চিত মুহূর্তে <em>খোঁজ</em> হতে পারে আপনার একমাত্র ভরসা। কয়েক সেকেন্ডের মধ্যেই এআই ঘেঁটে আনবে আসল উৎস, তুলনা করবে তথ্যের নির্ভরযোগ্যতা, আর আপনাকে দেখাবে একটি পূর্ণাঙ্গ ফ্যাক্টচেক রিপোর্ট। বলে দেবে কী দেখে বিশ্বাসযোগ্য, কোন তথ্য কোথা থেকে এসেছে আর কোথায় সন্দেহ থাকতে পারে। এই ফ্যাক্টচেকিং ভোজবাজির মতো উদয় হয় না। কিংবা এআই সর্বজান্তা তাই আপনাকে ফ্যাক্টচেক করে দিচ্ছে৷ ব্যাপারটা এমনও না। এর পেছনে রয়েছে প্রযুক্তির ঝলক।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        খুব সংক্ষিপ্তাকারে যদি জানতে চান, তাহলে বলি। প্রথমে খবরটিকে ঘিরে ওয়েব, সোশ্যাল পোস্ট, নিউজ আর্কাইভ এবং মল্টিমিডিয়া খোঁজা হয়, তারপর সূত্রগুলোর নির্ভরযোগ্যতা যাচাই করা হয়, কনটেক্সট-পাল্লা মিলিয়ে টেক্সট ও ইমেজ বিশ্লেষণ করা হয়, এবং সবশেষে সোর্স দেখিয়ে স্পষ্ট সিদ্ধান্ত দেওয়া হয়—সত্য, বিভ্রান্তিকর না ভুল। চলুন আরও সামনে যাই, খোঁজের কার্যপ্রণালী নিয়ে আরও জানা যাক।
      </p>
      
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <img src="https://bigganblog.org/wp-content/uploads/2025/09/মূল-উদ্ভাবন-1-edited-scaled.png" alt="খোঁজের কার্যপ্রণালী" style="max-width: 100%; height: auto; border-radius: 8px;"/>
        <p style="margin: 10px 0 0 0; font-style: italic; color: #666;"><strong>চিত্রঃ</strong> এক নজরে খোঁজ</p>
      </div>
      
      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">খোঁজের কার্যপ্রণালী</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ এর পেছনের মূল শক্তি হলো খোঁজ টিমের বানানো একটা দারুণ স্মার্ট আর্কিটেকচার। এটা এআই-এর সঙ্গে হাত মিলিয়ে নির্ভরযোগ্য জায়গা থেকে তথ্য খোঁজে আর সেটাকে এমন সহজ করে তুলে ধরে, যেন আমরা খুব সহজে বুঝতে পারি। এটাকে কেবল আপনি নিছক একটা সার্চ ইঞ্জিন বললেও ভুল করবেন—এটা একটা ইন্টেলিজেন্ট প্রসেস, যা প্রতিটা ধাপে সর্বোচ্চ চেষ্টা করে নিখুঁত ফলাফল দেয়ার। চলুন, বিস্তারিত জেনে নিই:
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">(১) বিশ্বাসযোগ্য উৎসের কিউরেটেড লিস্ট</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        আমরা খুঁজে খুঁজে বাংলা এবং ইংরেজির ১৫০ এর বেশি ওয়েবসাইট লিস্ট করলাম। এগুলো এমন সাইট, যেখানে সমসাময়িক খবর—রাজনীতি, অর্থনীতি, সেলিব্রিটি, বিজ্ঞান, ধর্ম এবং স্বাস্থ্য বিষয়ক তথ্য—সবকিছুই নির্ভরযোগ্যভাবে পাওয়া যায়। প্রধান নিউজ পোর্টাল, ফ্যাক্ট-চেক সাইট, বৈজ্ঞানিক জার্নাল এবং স্বাস্থ্য-বিষয়ক প্ল্যাটফর্মগুলো এই তালিকায় অন্তর্ভুক্ত।​ এটা কেন করা হলো? কারণ, তথ্যের উৎসই যদি বিশ্বাসযোগ্য না হয়, তাহলে পুরো প্রক্রিয়াটাই অকেজো হয়ে যায়। এই শক্তিশালী তালিকার মাধ্যমে আমরা "গার্বেজ ইন, গার্বেজ আউট"-এর ঝুঁকি সম্পূর্ণভাবে কমিয়ে এনেছি। এর ফলে, আমাদের প্রতিটি ফলাফল আসে শুধু পরিচিত ও যাচাই করা উৎস থেকে, যা আপনার আস্থাকে আরও মজবুত করে। চেষ্টা করা হয়েছে এটাকে এমন একটা সুরক্ষিত লাইব্রেরি বানানোর, যেখানে শুধু অথেন্টিক আর ভ্যালিডেটেড তথ্য সংরক্ষিত থাকবে।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">(২) প্রশ্নের অপটিমাইজেশন: এআই-এর প্রথম ধাপ</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        যখন আপনি কোনো প্রশ্ন করেন, যেমন "<em>ডাকসু নির্বাচনে কী ভোট কারচুপি হয়েছিল?</em>", তখনই আমাদের এআই-এর খেলা শুরু হয়। এটা আপনার সহজ প্রশ্নটাকে সুনির্দিষ্ট ও কার্যকর সার্চ কিওয়ার্ডে রূপান্তর করে। এটার একটা গালভরা নাম আছে, তা হচ্ছে কুয়েরি পার্সিং।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        উদাহরণস্বরূপ, আপনার প্রশ্নটা তখন হয়ে যেতে পারে:
      </p>
      
      <ul style="margin-bottom: 25px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;">"ডাকসু নির্বাচন ২০১৯ কারচুপি"</li>
        <li style="margin-bottom: 10px; line-height: 1.6;">"ডাকসু নির্বাচন ভোট জালিয়াতি"</li>
        <li style="margin-bottom: 10px; line-height: 1.6;">"ডাকসু নির্বাচন অনিয়মের অভিযোগ"</li>
        <li style="margin-bottom: 10px; line-height: 1.6;">"ডাকসু নির্বাচন ফলাফল বিতর্ক"</li>
      </ul>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এরপর এআই এই কীওয়ার্ডগুলোর সাথে নির্ভরযোগ্য কিছু সংবাদমাধ্যম ও ফ্যাক্ট-চেকিং সাইটের নাম যোগ করে দেয়, যাতে অনুসন্ধান আরও নিখুঁত হয়।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এখানে এআইকে বিশেষভাবেই সিস্টেম প্রম্পটের মাধ্যমে ইনস্ট্রাক্টেড করা হয় সবচেয়ে কার্যকরী সার্চ কীওয়ার্ড বের করার জন্য। এর ফলে অপ্রাসঙ্গিক ফলাফল অনেক কমে যায় এবং সঠিক তথ্য পাওয়ার সম্ভাবনা বহুগুণ বেড়ে যায়। এই ধাপটাই অন্যান্য সাধারণ সার্চ টুল থেকে আমাদের খোঁজকে আলাদা করে তোলে। এই ব্যাপারটা আপনার প্রশ্নকে একটা লেজার-গাইডেড মিসাইলের মতো সঠিক লক্ষ্যে পাঠানো, যাতে সময় এবং প্রচেষ্টা দুটোই সাশ্রয় হয়।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">(৩) ওয়েব ক্রলিং এবং ফিল্টারিং</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        উপরে আমরা দেখলাম যে, ইউজারের দেয়া প্রশ্নটা প্রথম ধাপে খোঁজ কুয়েরি পার্সিং প্রক্রিয়ার মাধ্যমে ছোট ছোট কার্যকরী কীওয়ার্ডস এ রূপান্তর করে। ইউজারের দেয়া প্রশ্নটা প্রথম ধাপে খোঁজ ছোট কার্যকরী কীওয়ার্ডে রূপান্তর করলো। এরপরের ধাপে শুরুতে আমরা যে কিউরেটেড সোর্স লিস্ট বানিয়েছিলাম সেখান থেকে অনুসন্ধান শুরু হয়।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এক্ষেত্রে ব্যবহার করা হয় একটা ওয়েব ক্রলিং পাইপলাইন (Web Crawling Pipeline), যা প্রতিটা ওয়েবসাইটের এইচটিএমএল ডম স্ট্রাকচার (HTML DOM Structure) স্ক্যান করে প্রয়োজনীয় কনটেন্ট (শিরোনাম, মেটা ট্যাগ, মূল লেখা) সংগ্রহ করে। যারা ওয়েব ক্রলিং সম্পর্কে আইডিয়া রাখেন না, তাদের জন্য ছোট্টো করে বলে রাখি, ওয়েব ক্রলিং হলো ওয়েবসাইট ঘুরে ঘুরে ডেটা আনা। আর DOM structure মানে ওয়েবপেজের ভেতরে লেখা আর ট্যাগের গঠন।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ক্রলিং এর মাধ্যমে সংগ্রহ করা ডকুমেন্টগুলো এরপর একটা ওয়েটেড স্কোরিং অ্যালগরিদম (Weighted Scoring Algorithm) দিয়ে মূল্যায়ন করা হয়। এই ওয়েটেড স্কোরিং অ্যালগরিদমে প্রতিটি উৎসকে কিছু ওজন(weight) দিয়ে হিসেব করা হয়। সহজ করে বললে, কোনটা বেশি গুরুত্বপূর্ণ, কোনটা কম তা নির্দেশ করে এই ওয়েট।<br/>প্রতিটা সোর্স কে কিছু ওজন দিয়ে হিসেব করার ক্ষেত্রে এখানে তিনটা মূল মেট্রিক ব্যবহৃত হয়ঃ
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        <strong>ক) রিসেন্সি স্কোর (Recency Score)</strong> - এই স্কোরের মাধ্যমে একটা কন্টেন্ট কতটা সাম্প্রতিক তা বোঝায়। সেক্ষেত্রে কনটেন্টের টাইমস্ট্যাম্প (Timestamp) অনুযায়ী নতুন/পুরনো ডেটা আলাদা করা হয়。<br/><strong>খ) অথরিটি স্কোর (Authority Score)</strong> - এই স্ক্রোরটা কোন ওয়েবসাইট কতটা বিশ্বাসযোগ্য, সেটা মাপার পদ্ধতি। ওয়েবসাইটের ডোমেইন অথরিটি (Domain Authority - DA), পেজর‍্যাঙ্ক (PageRank) এবং ট্রাস্ট সিগন্যাল বিশ্লেষণ করে একটা স্কোর নির্ধারিত হয়।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        <strong>গ) কীওয়ার্ড ম্যাচ স্কোর (Keyword Match Score)</strong> - কীওয়ার্ড বারবার কোথায় এসেছে আর সেটা আসলেই গুরুত্বপূর্ণ কি না, সেটা মাপার টেকনিক। টিএফ-আইডিএফ যার পুরোটা হচ্ছে, Term Frequency–Inverse Document Frequency। এই পদ্ধতিতে নির্ধারণ করা হয় শিরোনাম ও টেক্সটে কীওয়ার্ড কতটা প্রাসঙ্গিকভাবে মিলে গেছে।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        <strong>ওয়েটিং রুল (Weighting Rule):</strong> শিরোনামে (title) কীওয়ার্ড ম্যাচ হলে বেশি ওজন দেওয়া হয়, বডি টেক্সটে মিললে তুলনামূলকভাবে কম। সব মেট্রিক মিলিয়ে প্রতিটি উৎসের জন্য একটি কম্পোজিট স্কোর (Composite Score: 0–1) ক্যালকুলেট করা হয়। অর্থাৎ এটা সব ফ্যাক্টর মিলে একটি ফাইনাল নম্বর।<br/>শেষে সর্বোচ্চ স্কোর পাওয়া ৮–১০টি উৎস জেসন ফরম্যাটে (JSON Format) সংরক্ষণ করা হয়। যারা জানেন না, তাদের বলে রাখি, JSON হলো এমন একটা ডেটা ফরম্যাট যা কম্পিউটার সহজে পড়তে ও ব্যবহার করতে পারে। এই ছাঁটাই প্রক্রিয়াটা এতটা নির্ভুল রাখার চেষ্টা করা হয়েছে যে, এটা যেন একটা খড়ের গাদা থেকে সুইঁ খুঁজে আনে। ফলাফল হলো, অসংখ্য অপ্রাসঙ্গিক তথ্য ছেঁটে ফেলে শুধু সবচেয়ে নির্ভরযোগ্য, সাম্প্রতিক আর প্রাসঙ্গিক ডেটা সামনে আনা।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">(৪) ফলব্যাক অনুসন্ধান: কোনো ফাঁক না রাখা</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        শুরুতেই আমরা বলেছিলাম না যে, খোঁজ আমাদের কিউরেটেড উৎস গুলি থেকে ব্যবহারকারীর জন্য তথ্য খুঁজে আনে? এখন ধরুন, কখনো যদি এমন দাবি আসে যা খুব নতুন বা অস্বাভাবিক, তখন খোঁজের তালিকাভুক্ত উৎসগুলোতে মিল পাওয়া নাও যেতে পারে। সেই সময় খোঁজ বসে থাকে না, বরং সঙ্গে সঙ্গে ফলব্যাক হয়ে যায় এক বিশেষ টুলে, <a href="https://www.tavily.com/" style="color: #1976d2; text-decoration: none;">ট্যাভিলি এপিআই</a> । এটা মূলত পুরো ওয়েব ঘেঁটে দেখে, তবে শুধু ভরসাযোগ্য ও অথেন্টিক সাইট থেকেই তথ্য আনে।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এই প্রক্রিয়ায় রয়েছে স্মার্ট অথরিটি স্কোরিং সিস্টেম, যা নিশ্চিত করে যেন ভুয়া বা অপ্রাসঙ্গিক লিঙ্ক ঢুকে না পড়ে। তার ওপর, খোঁজের ভেতরে রাখা হয়েছে ১৬টা আলাদা এপিআই কী, যেগুলো একে অপরকে ব্যাকআপ দেয়—যদি একটা কাজ না করে, অন্যটা চালু হয়ে যায়। ফলে রেট লিমিট বা ব্যবহারজনিত ঝামেলায়ও খোঁজ থেমে থাকে না।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এক কথায়, এটা খোঁজের অটুট নিরাপত্তা জাল, যেখানে যত কঠিন বা জটিল দাবি হোক না কেন, সত্যকে ধরার একটা উপায় থাকবেই। আর এই ফলব্যাক সিস্টেমের কারণেই খোঁজের সঠিকতার হার প্রায় ৯৫%, যা অনেক আন্তর্জাতিক প্ল্যাটফর্মের চেয়েও বেশি।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">(৫) রিপোর্ট জেনারেশন: এআই-এর সৃজনশীলতা এবং নির্ভুলতা</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        সব তথ্য সংগ্রহের পর খোঁজের এআই বসে থাকে না। এগুলোকে গুছিয়ে বানিয়ে ফেলে একেবারে সহজবোধ্য, পড়তে আরামদায়ক একটা রিপোর্ট। এজন্য ব্যবহার করা হয় তিন-স্তরের এআই ফলব্যাক সিস্টেম। প্রাইমারি থেকে শুরু করে টারশিয়ারি পর্যন্ত যাতে ভুল হওয়ার সুযোগ প্রায় শূন্যে নামে।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        রিপোর্টে আপনি পাবেন:
      </p>
      
      <ul style="margin-bottom: 25px; padding-left: 20px;">
        <li style="margin-bottom: 10px; line-height: 1.6;">কোন সাইট কী বলছে,</li>
        <li style="margin-bottom: 10px; line-height: 1.6;">কোথায় মতভেদ আছে,</li>
        <li style="margin-bottom: 10px; line-height: 1.6;">আর শেষমেশ দাবিটা সত্য, অসত্য নাকি বিতর্কিত।</li>
      </ul>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এখানেই এআই-এর আসল জাদুটা দেখা যায়। প্রথমে এটা আপনার প্রশ্নটাকে এমনভাবে অপটিমাইজ করে, যাতে সঠিক তথ্য বের করা যায়। তারপর পাওয়া ফলাফলগুলোকে সাজিয়ে তোলে গল্পের মতো, কালচারাল ব্যাকগ্রাউন্ড মাথায় রেখেই।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        প্রতিটি রিপোর্টে থাকে সোর্স লিঙ্ক, যাতে চাইলে আপনি নিজেই যাচাই করতে পারেন। ফলে অভিজ্ঞতাটা হয় ঠিক যেন কোনো বিশেষজ্ঞের সাথে বসে আলাপ করছেন। যে সহজ, নির্ভরযোগ্য আর ভীষণ কনভিন্সিং।
      </p>
      
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <img src="https://bigganblog.org/wp-content/uploads/2025/09/image-1-1024x671.png" alt="খোঁজের এআই ফ্যাক্টচেকারের কার্যপ্রণালী" style="max-width: 100%; height: auto; border-radius: 8px;"/>
        <p style="margin: 10px 0 0 0; font-style: italic; color: #666;"><strong>চিত্রঃ</strong> খোঁজ এর এআই ফ্যাক্টচেকারের কার্যপ্রণালীর একটি সরল আর্কিটেকচার</p>
      </div>
      
      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">বিশেষায়িত ফিচারস: খোঁজকে অপরাজেয় করে তোলে</h2>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজকে বাংলা ভাষায় সত্য অন্বেষের একটা কমপ্লিট প্ল্যাটফর্ম বানাতে যোগ করা হয়েছে আরও কিছু কার্যকরী ফিচার:
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">মিথবাস্টিং</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ডিজিটাল যুগে ভুয়া খবর আর গুজব আমাদের প্রতিদিনের বাস্তবতা হয়ে দাঁড়িয়েছে। বেশিরভাগ সময় মানুষ শুধু "কোনো দাবি সত্য নাকি মিথ্যা", এই উত্তরেই থেমে যায়। কিন্তু খোঁজ একটু ভিন্ন পথে হেঁটেছে।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজের অন্যতম অনন্য ফিচার হলো, এটি শুধু তথ্য দেয় না; বরং কথোপকথনের ভঙ্গিতে বিষয়টি ব্যাখ্যা করে। ধরুন, আপনি কোনো কুসংস্কার বা বৈজ্ঞানিক দাবি শুনলেন। এআই তখন এক বন্ধুর মতো আপনাকে বোঝাবে। প্রথমে প্রেক্ষাপট তুলে ধরবে, তারপর বৈজ্ঞানিক প্রমাণ হাজির করবে, আর সবশেষে গল্পের মতো করে বিষয়টির ভ্রান্তি পরিষ্কার করবে।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এই বৈশিষ্ট্যের সবচেয়ে বড় শক্তি হলো, এটি মানুষকে শুধু গুজব থেকে রক্ষা করে না, বরং দীর্ঘমেয়াদে ক্রিটিক্যাল থিঙ্কিং শেখায়। আর সেই দক্ষতাই তৈরি করে এক ধরনের ডিজিটাল সুরক্ষা, যা ভবিষ্যতের তথ্যযুদ্ধে অত্যন্ত কার্যকর।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">মুক্তিযুদ্ধ কর্নার</h3>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        ১৯৭১ কে ঘিরে এখনও নানা ভুল ধারণা, বিকৃত ইতিহাস আর গুজব ঘুরে বেড়ায়—যা নতুন প্রজন্মকে বিভ্রান্ত করে। এই প্রেক্ষাপটে খোঁজ নিয়ে এসেছে এক অনন্য ফিচার: মুক্তিযুদ্ধ কর্নার।
      </p>
      
      <p style="margin-bottom: 20px; line-height: 1.8;">
        এখানে এআই কাজ করে একজন অভিজ্ঞ ইতিহাসবিদের মতো। এটি শুধু তথ্য পরিবেশন করে না; বরং ঐতিহাসিক প্রেক্ষাপট, সময়রেখা, গণহত্যার পরিসংখ্যান, যুদ্ধাপরাধ, গুরুত্বপূর্ণ ব্যক্তিত্ব, ভৌগোলিক বিবরণ থেকে শুরু করে সাংস্কৃতিক প্রভাব পর্যন্ত সবকিছু সহজ ও আকর্ষণীয় গল্পের ভঙ্গিতে ব্যাখ্যা করে। এই ফিচারের বিশেষত্ব হলো, এটিকে Retrieval-Augmented Generation (RAG) পদ্ধতিতে ট্রেন করানো হয়েছে। ব্যবহার করা হয়েছে মুক্তিযুদ্ধ-সংক্রান্ত অসংখ্য ঐতিহাসিক বই, সরকারি দলিলপত্র, দিনলিপি এবং প্রামাণ্য আর্কাইভ। ফলে তথ্য শুধু এআই-এর অনুমান নয়—বরং যাচাই করা উৎস থেকে পুনরুদ্ধার করা প্রমাণভিত্তিক ব্যাখ্যা।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এর ফলে মুক্তিযুদ্ধ নিয়ে যেসব ভুল ন্যারেটিভ, ভ্রান্ত ইতিহাস বা গুজব প্রচলিত, সেগুলো সহজেই ধরা পড়ে। আমাদের সংগ্রাম, ত্যাগ আর বিজয়ের সঠিক কাহিনি বিকৃতির আড়ালে চাপা না পড়ে।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">মাল্টিমিডিয়া যাচাই</h3>
      <p style="margin-bottom: 30px; line-height: 1.8;">
        খোঁজ শুধু লেখা নয়, ছবির সত্যতাও যাচাই করতে পারে। এআই-জেনারেটেড কনটেন্ট শনাক্ত করা থেকে শুরু করে রিভার্স ইমেজ সার্চের মাধ্যমে ছবির আসল উৎস খুঁজে বের করা—সবই এর আওতাভুক্ত। টেক্সটের ক্ষেত্রে খোঁজ এআই-ডিটেকশন ও প্লেজিয়ারিজম চেক ব্যবহার করে, যাতে ডিপফেক বা বিকৃত কনটেন্ট সহজেই ধরা পড়ে। অত্যাধুনিক এপিআই ইন্টিগ্রেশনের কারণে খোঁজ এখন মাল্টিমিডিয়া যুগের জন্য একেবারে প্রস্তুত।
      </p>
      
      <h3 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">ম্যানুয়াল ফ্যাক্টচেকিং: এআই-এর সাথে মানুষের অভেদ্য সমন্বয়</h3>
      <p style="margin-bottom: 30px; line-height: 1.8;">
        এআই-ভিত্তিক ফিচারের পাশাপাশি খোঁজ টিম নিয়মিতভাবে অনলাইনে ছড়িয়ে থাকা নানা গুজব ম্যানুয়ালভাবে ফ্যাক্টচেক করে। উদ্দেশ্য একটাই, যাতে কোনো বিভ্রান্তিকর বা ভুয়া সংবাদ সহজে ছড়িয়ে পড়তে না পারে। এভাবে কৃত্রিম বুদ্ধিমত্তার গতি আর মানুষের বিশ্লেষণী ক্ষমতা একত্রিত হয়ে খোঁজকে সত্য যাচাইয়ের একটি নির্ভরযোগ্য মানদণ্ডে পরিণত করেছে।
      </p>
      
      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">সীমাবদ্ধতা</h2>
      <p style="margin-bottom: 30px; line-height: 1.8;">
        কোনো সিস্টেমই একেবারে নিখুঁত নয়। উৎসের তালিকা যত বড়ই হোক, তার বাইরে থাকা খবর বাদ পড়ে যেতে পারে। এটাই সোর্স বায়াসের চ্যালেঞ্জ। আবার রিয়েল-টাইম আপডেট না থাকলে সামান্য দেরি দেখা দিতে পারে। এআই-ভিত্তিক সারাংশ কখনো কখনো সূক্ষ্ম ভুলও করতে পারে, তাই সবসময় মূল সোর্স লিঙ্ক যাচাই করা জরুরি।
      </p>
      
      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">উপসংহার</h2>
      <p style="margin-bottom: 20px; line-height: 1.8;">
        খোঁজ শুধু একটি প্ল্যাটফর্ম নয়—এটি বাংলা ভাষায় ডিজিটাল সাক্ষরতা বাড়ানো এবং অসত্য তথ্য শনাক্ত করার একটি নতুন উদ্যোগ। এর হাইব্রিড পাইপলাইন—এআই-চালিত অনুসন্ধান, উৎস নির্বাচন এবং সারাংশ—দেখাতে চায়, সত্যতা আরও সহজে যাচাইযোগ্য হতে পারে। আমরা আশা করি, খোঁজ ব্যবহারকারীদের সহায়তা করবে এবং ধীরে ধীরে আরও প্রভাব ফেলবে। সত্যের সন্ধানে থাকা প্রতিটি মুহূর্তে খোঁজ থাকবে আপনার পাশে।
      </p>
      
      <p style="margin-bottom: 30px; line-height: 1.8;">
        সত্যান্বেষের এ যাত্রায় যোগ দিতে পারেন খোঁজের সাথেঃ <a href="https://www.khoj-bd.com/" style="color: #1976d2; text-decoration: none;">https://www.khoj-bd.com/</a>
      </p>
      
      <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">তথ্যসূত্র</h2>
      <p style="margin-bottom: 30px; line-height: 1.8; text-align: center;">
        [১] দেখুন এখানে: <a href="http://khoj-bd.com/fact-checking-verification" style="color: #1976d2; text-decoration: none;">khoj-bd.com/fact-checking-verification</a>
      </p>
    `,
    tags: ["খোঁজ", "এআই", "ফ্যাক্টচেকিং", "ডিজিটাল সাক্ষরতা"],
    publishDate: "১৫ সেপ্টেম্বর, ২০২৫",
    readTime: "১২ মিনিট",
    slug: "khoj-ai-factchecker-journey",
  },
];

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params?.slug as string;
    const foundPost = blogPosts.find((p) => p.slug === slug);
    setPost(foundPost || null);
    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-tiro-bangla">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            ব্লগ পোস্ট পাওয়া যায়নি
          </h1>
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium font-tiro-bangla"
          >
            ← ব্লগে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 font-tiro-bangla">
            <Link href="/" className="hover:text-primary-600">
              হোম
            </Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-primary-600">
              ব্লগ
            </Link>
            <span>›</span>
            <span className="text-gray-900">{post.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Thumbnail */}
          <div className="relative h-64 w-full">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium font-tiro-bangla"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 font-tiro-bangla">
              {post.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <p className="text-lg font-medium text-gray-900 font-tiro-bangla">
                  {post.author}
                </p>
                <p className="text-sm text-gray-500 font-tiro-bangla">
                  {post.publishDate} • {post.readTime}
                </p>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none font-tiro-bangla"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <ShareButtons
                title={post.title}
                url={`${typeof window !== "undefined" ? window.location.href : ""}`}
                description={post.excerpt}
              />
            </div>
          </div>
        </article>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium font-tiro-bangla"
          >
            ← ব্লগে ফিরে যান
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
