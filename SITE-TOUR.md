# সাইট ট্যুর সিস্টেম

এই সিস্টেমটি KALOPATHOR ওয়েবসাইটে ইউজারদের জন্য ইন্টারেক্টিভ সাইট ট্যুর প্রদান করে।

## বৈশিষ্ট্য

### 🎯 স্বয়ংক্রিয় ট্যুর
- প্রথম আসার সময় স্বয়ংক্রিয়ভাবে ট্যুর শুরু হয়
- `isFirstVisit()` ফাংশন ব্যবহার করে প্রথম আসা ডিটেক্ট করা হয়

### 🧭 ইন্টারেক্টিভ নেভিগেশন
- **পরবর্তী** বাটন: পরবর্তী স্টেপে যান
- **পূর্ববর্তী** বাটন: আগের স্টেপে ফিরে যান
- **✕** বাটন: যেকোনো সময় ট্যুর বন্ধ করুন
- **সম্পূর্ণ** বাটন: ট্যুর শেষ করুন

### 🎨 ভিজুয়াল হাইলাইটিং
- সংশ্লিষ্ট এলিমেন্ট হাইলাইট করা হয়
- নীল রঙের বর্ডার এবং ব্যাকগ্রাউন্ড ইফেক্ট
- স্মুথ ট্রানজিশন এবং অ্যানিমেশন

### 📱 মোবাইল UI গাইড
- সাইডবার টগল বাটন সম্পর্কে তথ্য
- ফ্লোটিং অ্যাকশন বাটন সম্পর্কে গাইড
- বিভিন্ন ফিচার বাটন সম্পর্কে ব্যাখ্যা

## ট্যুর স্টেপসমূহ

### 1. স্বাগত বার্তা
- **টার্গেট:** `body`
- **বিবরণ:** খোঁজে স্বাগতম এবং ট্যুর পরিচিতি

### 2. সাইডবার টগল
- **টার্গেট:** `.sidebar-toggle, [data-tour="sidebar-toggle"]`
- **বিবরণ:** ফ্যাক্টচেক হিস্ট্রি দেখার জন্য টগল বাটন

### 3. ফ্লোটিং অ্যাকশন বাটন
- **টার্গেট:** `.floating-action-button, [data-tour="floating-action"]`
- **বিবরণ:** বিশেষ ফিচারসমূহে যাওয়ার জন্য

### 4. ছবি যাচাই বাটন
- **টার্গেট:** `[href="/image-check"], [data-tour="image-check"]`
- **বিবরণ:** ছবির সত্যতা যাচাই করার জন্য

### 5. লেখা যাচাই বাটন
- **টার্গেট:** `[href="/text-check"], [data-tour="text-check"]`
- **বিবরণ:** লেখার সত্যতা যাচাই করার জন্য

### 6. উৎস সন্ধান বাটন
- **টার্গেট:** `[href="/source-search"], [data-tour="source-search"]`
- **বিবরণ:** তথ্যের উৎস খুঁজে বের করার জন্য

### 7. মিথবাস্টিং বাটন
- **টার্গেট:** `[href="/mythbusting"], [data-tour="mythbusting"]`
- **বিবরণ:** ভুয়া তথ্য খন্ডন করার জন্য

### 8. সার্চ বার
- **টার্গেট:** `.search-bar, [data-tour="search-bar"]`
- **বিবরণ:** মূল সার্চ ফিচার

### 9. ট্যুর সম্পূর্ণ
- **টার্গেট:** `body`
- **বিবরণ:** ট্যুর সম্পূর্ণ বার্তা

## ব্যবহার

### বেসিক ব্যবহার

```tsx
import SiteTour from '@/components/SiteTour'

function MyComponent() {
  const [showTour, setShowTour] = useState(false)

  return (
    <>
      <SiteTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => setShowTour(false)}
      />
      
      <button onClick={() => setShowTour(true)}>
        ট্যুর শুরু করুন
      </button>
    </>
  )
}
```

### প্রথম আসার সময় স্বয়ংক্রিয় ট্যুর

```tsx
import { isFirstVisit } from '@/lib/visit-tracker'
import SiteTour from '@/components/SiteTour'

function HomePage() {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    if (isFirstVisit()) {
      setTimeout(() => {
        setShowTour(true)
      }, 1000)
    }
  }, [])

  return (
    <SiteTour 
      isOpen={showTour}
      onClose={() => setShowTour(false)}
      onComplete={() => setShowTour(false)}
    />
  )
}
```

### TourTrigger কম্পোনেন্ট ব্যবহার

```tsx
import TourTrigger from '@/components/TourTrigger'

function MyComponent() {
  return (
    <TourTrigger className="bg-blue-600 hover:bg-blue-700">
      সাইট ট্যুর দেখুন
    </TourTrigger>
  )
}
```

## data-tour Attributes

ট্যুর সিস্টেম কাজ করার জন্য HTML এলিমেন্টে `data-tour` attribute যোগ করতে হবে:

```html
<!-- সার্চ বার -->
<SearchBar data-tour="search-bar" />

<!-- ফিচার বাটন -->
<Link href="/image-check" data-tour="image-check">
  ছবি যাচাই
</Link>

<!-- সাইডবার টগল -->
<button data-tour="sidebar-toggle">
  টগল
</button>

<!-- ফ্লোটিং অ্যাকশন বাটন -->
<button data-tour="floating-action">
  ফিচারসমূহ
</button>
```

## কাস্টমাইজেশন

### ট্যুর স্টেপ যোগ করা

```tsx
const customTourSteps = [
  {
    id: 'custom-step',
    target: '.my-element',
    title: 'কাস্টম স্টেপ',
    content: 'এটি একটি কাস্টম ট্যুর স্টেপ',
    position: 'top',
    showArrow: true,
    highlight: true
  }
]
```

### টুলটিপ পজিশন

- `top`: উপরে টুলটিপ
- `bottom`: নিচে টুলটিপ  
- `left`: বামে টুলটিপ
- `right`: ডানে টুলটিপ
- `center`: পেজের মাঝখানে টুলটিপ

## স্টাইলিং

ট্যুর সিস্টেম নিম্নলিখিত CSS ক্লাস ব্যবহার করে:

```css
.tour-highlight {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
  border-radius: 8px !important;
  transition: box-shadow 0.3s ease !important;
}

.tour-highlight::before {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
}
```

## ডেমো

- **হোমপেজ:** প্রথম আসার সময় স্বয়ংক্রিয় ট্যুর
- **সাইট ট্যুর ডেমো:** `/site-tour-demo` - সম্পূর্ণ ডেমো
- **ভিজিট ট্র্যাকিং ডেমো:** `/visit-tracking-demo` - ভিজিট ট্র্যাকিং

## ব্রাউজার সাপোর্ট

- Chrome/Edge: ✅ সম্পূর্ণ সাপোর্ট
- Firefox: ✅ সম্পূর্ণ সাপোর্ট  
- Safari: ✅ সম্পূর্ণ সাপোর্ট
- Mobile Browsers: ✅ সম্পূর্ণ সাপোর্ট

## গুরুত্বপূর্ণ নোট

1. **প্রথম আসা:** localStorage ব্যবহার করে প্রথম আসা ডিটেক্ট করা হয়
2. **ট্যুর বন্ধ:** যেকোনো সময় ট্যুর বন্ধ করা যায়
3. **রিসপন্সিভ:** সব ডিভাইসে কাজ করে
4. **অ্যাক্সেসিবিলিটি:** স্ক্রিন রিডার সাপোর্ট
5. **পারফরমেন্স:** হালকা এবং দ্রুত
