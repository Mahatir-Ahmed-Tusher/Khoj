# মোবাইল সাইট ট্যুর সিস্টেম

এই সিস্টেমটি KALOPATHOR ওয়েবসাইটে **শুধুমাত্র মোবাইল ডিভাইসের** জন্য ইন্টারেক্টিভ সাইট ট্যুর প্রদান করে।

## 🎯 মূল বৈশিষ্ট্য

### 📱 মোবাইল-অনলি
- শুধুমাত্র মোবাইল ডিভাইসে (768px এর নিচে) কাজ করে
- ডেস্কটপে ট্যুর দেখানো হয় না
- মোবাইল UI এর জন্য বিশেষভাবে অপ্টিমাইজ করা

### 🎨 ছোট এবং সংক্ষিপ্ত টুলটিপ
- **সাইজ:** সর্বোচ্চ 280px প্রস্থ, 120px উচ্চতা
- **টেক্সট:** সংক্ষিপ্ত এবং একিউরেট
- **প্যাডিং:** ছোট (16px)
- **ফন্ট সাইজ:** ছোট (text-sm, text-xs)

### 🎮 টাচ-ফ্রেন্ডলি নেভিগেশন
- ছোট বাটন (px-3 py-1.5)
- সহজ ট্যাপ টার্গেট
- মোবাইলের জন্য অপটিমাইজড স্পেসিং

## 📋 ট্যুর স্টেপসমূহ

### 1. স্বাগত বার্তা
- **টার্গেট:** `body`
- **বিবরণ:** "খোঁজে স্বাগতম! 📱" + "মোবাইলে খোঁজের ফিচারগুলো দেখুন"

### 2. মোবাইল মেনু
- **টার্গেট:** `.md\\:hidden button[aria-label="Toggle mobile menu"]`
- **বিবরণ:** "মোবাইল মেনু" + "এখানে সব পেজের লিংক পাবেন"

### 3. ফ্লোটিং অ্যাকশন বাটন
- **টার্গেট:** `.floating-action-button, [data-tour="floating-action"]`
- **বিবরণ:** "বিশেষ ফিচার" + "মুক্তিযুদ্ধ কর্নার, মিথবাস্টিং, ই-গ্রন্থসম্ভার"

### 4. ছবি যাচাই
- **টার্গেট:** `[href="/image-check"], [data-tour="image-check"]`
- **বিবরণ:** "ছবি যাচাই" + "ছবির সত্যতা যাচাই করুন"

### 5. লেখা যাচাই
- **টার্গেট:** `[href="/text-check"], [data-tour="text-check"]`
- **বিবরণ:** "লেখা যাচাই" + "লেখার সত্যতা যাচাই করুন"

### 6. উৎস সন্ধান
- **টার্গেট:** `[href="/source-search"], [data-tour="source-search"]`
- **বিবরণ:** "উৎস সন্ধান" + "তথ্যের উৎস খুঁজুন"

### 7. মিথবাস্টিং
- **টার্গেট:** `[href="/mythbusting"], [data-tour="mythbusting"]`
- **বিবরণ:** "মিথবাস্টিং" + "ভুয়া তথ্য খন্ডন করুন"

### 8. সার্চ বার
- **টার্গেট:** `.search-bar, [data-tour="search-bar"]`
- **বিবরণ:** "সার্চ বার" + "যেকোনো দাবি লিখে যাচাই করুন"

### 9. ট্যুর শেষ
- **টার্গেট:** `body`
- **বিবরণ:** "ট্যুর শেষ! ✅" + "এখন সব ফিচার জানেন"

## 🎨 ভিজুয়াল অপ্টিমাইজেশন

### টুলটিপ সাইজ
```css
/* মোবাইলের জন্য ছোট সাইজ */
width: 280px (max)
height: 120px
padding: 16px
font-size: 14px (title), 12px (content)
```

### হাইলাইট ইফেক্ট
```css
/* মোবাইলের জন্য ছোট হাইলাইট */
box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.7)
border-radius: 4px
```

### নেভিগেশন বাটন
```css
/* ছোট বাটন মোবাইলের জন্য */
padding: 12px 12px
font-size: 12px
border-radius: 6px
```

## 🚀 ব্যবহার

### স্বয়ংক্রিয় ট্যুর (প্রথম আসা)
```tsx
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }
  
  checkMobile()
  
  // শুধুমাত্র মোবাইলে এবং প্রথম আসার সময়
  if (isFirstVisit() && isMobile) {
    setTimeout(() => {
      setShowTour(true)
    }, 1000)
  }
}, [isMobile])
```

### ম্যানুয়াল ট্যুর ট্রিগার
```tsx
import MobileTourTrigger from '@/components/MobileTourTrigger'

// শুধুমাত্র মোবাইলে দেখাবে
<MobileTourTrigger />
```

### ফ্লোটিং ট্রিগার বাটন
- ডানদিকের নিচে ফ্লোটিং বাটন
- শুধুমাত্র মোবাইলে দৃশ্যমান
- নীল রঙের বৃত্তাকার বাটন

## 📱 মোবাইল ডিটেকশন

```tsx
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  return () => window.removeEventListener('resize', checkMobile)
}, [])
```

## 🎯 টার্গেট সিলেক্টর

### মোবাইল-স্পেসিফিক সিলেক্টর
```css
/* মোবাইল মেনু বাটন */
.md\\:hidden button[aria-label="Toggle mobile menu"]

/* ফ্লোটিং অ্যাকশন বাটন */
.floating-action-button, [data-tour="floating-action"]

/* ফিচার বাটনসমূহ */
[href="/image-check"], [data-tour="image-check"]
[href="/text-check"], [data-tour="text-check"]
[href="/source-search"], [data-tour="source-search"]
[href="/mythbusting"], [data-tour="mythbusting"]

/* সার্চ বার */
.search-bar, [data-tour="search-bar"]
```

## 📊 পারফরমেন্স

### অপ্টিমাইজেশন
- ছোট টুলটিপ সাইজ
- কম DOM ম্যানিপুলেশন
- মোবাইল-স্পেসিফিক CSS
- টাচ ইভেন্ট অপ্টিমাইজেশন

### মেমরি ব্যবহার
- কম রিফারেন্স
- ইফিশিয়েন্ট ইভেন্ট লিসনার
- অটো ক্লিনআপ

## 🧪 টেস্টিং

### ডেমো পেজসমূহ
- **হোমপেজ:** প্রথম আসার সময় স্বয়ংক্রিয় ট্যুর
- **মোবাইল ট্যুর ডেমো:** `/mobile-tour-demo` - সম্পূর্ণ ডেমো
- **ভিজিট ট্র্যাকিং ডেমো:** `/visit-tracking-demo` - ভিজিট ট্র্যাকিং

### টেস্ট করার উপায়
1. **মোবাইল ডিভাইসে:** সরাসরি ট্যুর দেখুন
2. **ডেস্কটপে:** ব্রাউজার ডেভেলপার টুলে মোবাইল ভিউ সেট করুন
3. **রিসাইজ:** উইন্ডো সাইজ পরিবর্তন করে টেস্ট করুন

## 🔧 কাস্টমাইজেশন

### ট্যুর স্টেপ যোগ করা
```tsx
const mobileTourSteps = [
  {
    id: 'custom-mobile-step',
    target: '.mobile-specific-element',
    title: 'কাস্টম স্টেপ',
    content: 'সংক্ষিপ্ত বিবরণ',
    position: 'top',
    showArrow: true,
    highlight: true
  }
]
```

### টুলটিপ সাইজ পরিবর্তন
```tsx
const tooltipWidth = Math.min(280, window.innerWidth - 40)
const tooltipHeight = 120
const offset = 15
```

## 📱 ব্রাউজার সাপোর্ট

- **Android Chrome:** ✅ সম্পূর্ণ সাপোর্ট
- **iOS Safari:** ✅ সম্পূর্ণ সাপোর্ট
- **Mobile Firefox:** ✅ সম্পূর্ণ সাপোর্ট
- **Samsung Internet:** ✅ সম্পূর্ণ সাপোর্ট
- **Opera Mobile:** ✅ সম্পূর্ণ সাপোর্ট

## ⚠️ গুরুত্বপূর্ণ নোট

1. **মোবাইল-অনলি:** শুধুমাত্র 768px এর নিচে কাজ করে
2. **প্রথম আসা:** localStorage ব্যবহার করে প্রথম আসা ডিটেক্ট করা হয়
3. **সংক্ষিপ্ত টেক্সট:** সব টেক্সট ছোট এবং একিউরেট
4. **টাচ অপ্টিমাইজড:** মোবাইল টাচের জন্য বিশেষভাবে ডিজাইন করা
5. **পারফরমেন্স:** মোবাইলের জন্য হালকা এবং দ্রুত
6. **রিসপন্সিভ:** সব মোবাইল স্ক্রিন সাইজে কাজ করে
