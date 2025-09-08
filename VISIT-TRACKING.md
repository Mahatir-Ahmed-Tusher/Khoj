# ভিজিট ট্র্যাকিং সিস্টেম

এই সিস্টেমটি KALOPATHOR ওয়েবসাইটে ইউজার ভিজিট ট্র্যাক করার জন্য তৈরি করা হয়েছে।

## বৈশিষ্ট্য

### 1. প্রথম আসা ট্র্যাকিং
- `localStorage` ব্যবহার করে ব্রাউজারে প্রথম আসা রেকর্ড করা হয়
- ব্রাউজার বন্ধ করার পরেও তথ্য সংরক্ষিত থাকে
- প্রতিবার রিফ্রেশ দিলে প্রথম আসা বলা হয় না

### 2. সেশন ট্র্যাকিং
- `sessionStorage` ব্যবহার করে নতুন সেশন গণনা করা হয়
- ব্রাউজার ট্যাব বন্ধ করলে সেশন শেষ হয়
- নতুন ট্যাব খুললে নতুন সেশন শুরু হয়

### 3. পেজ ভিজিট কাউন্ট
- প্রতিটি পেজের জন্য আলাদা ভিজিট কাউন্ট
- পেজ রিফ্রেশ করলে কাউন্ট বাড়ে
- localStorage এ সংরক্ষিত হয়

## ব্যবহার

### বেসিক ব্যবহার

```typescript
import { isFirstVisit, isNewSession, trackVisit } from '@/lib/visit-tracker'

// প্রথম আসা চেক
if (isFirstVisit()) {
  console.log('ইউজার প্রথম এসেছে!')
}

// নতুন সেশন চেক
if (isNewSession()) {
  console.log('নতুন সেশন শুরু হয়েছে!')
}

// পেজ ভিজিট ট্র্যাক
trackVisit('home')
```

### বিস্তারিত তথ্য

```typescript
import { getVisitInfo } from '@/lib/visit-tracker'

const visitInfo = getVisitInfo()
console.log(visitInfo)
// {
//   isFirstVisit: boolean,
//   visitCount: number,
//   firstVisitDate: string | null,
//   lastVisitDate: string | null,
//   sessionCount: number
// }
```

### কম্পোনেন্টে ব্যবহার

```tsx
import VisitStats from '@/components/VisitStats'

// সরল দেখুন
<VisitStats pageName="home" />

// বিস্তারিত দেখুন
<VisitStats pageName="home" showDetails={true} />
```

## API রেফারেন্স

### `isFirstVisit()`
- **রিটার্ন:** `boolean`
- **বিবরণ:** ইউজার প্রথম এসেছে কিনা চেক করে

### `isNewSession()`
- **রিটার্ন:** `boolean`
- **বিবরণ:** নতুন সেশন শুরু হয়েছে কিনা চেক করে

### `trackVisit(pageName: string)`
- **প্যারামিটার:** `pageName` - পেজের নাম
- **বিবরণ:** নির্দিষ্ট পেজের ভিজিট কাউন্ট বাড়ায়

### `getVisitInfo()`
- **রিটার্ন:** `VisitInfo` অবজেক্ট
- **বিবরণ:** সব ভিজিট সম্পর্কিত তথ্য দেয়

### `getPageVisitCount(pageName: string)`
- **প্যারামিটার:** `pageName` - পেজের নাম
- **রিটার্ন:** `number`
- **বিবরণ:** নির্দিষ্ট পেজের ভিজিট সংখ্যা দেয়

### `resetVisitTracking()`
- **বিবরণ:** সব ভিজিট ট্র্যাকিং তথ্য মুছে দেয় (ডিবাগিং এর জন্য)

## স্টোরেজ কৌশল

### localStorage
- `kalopathor_visit_info` - মূল ভিজিট তথ্য
- `kalopathor_page_visits_[pageName]` - পেজ ভিজিট কাউন্ট

### sessionStorage
- `kalopathor_session_active` - সেশন স্ট্যাটাস

## উদাহরণ

### হোমপেজে প্রথম আসার স্বাগত বার্তা

```tsx
useEffect(() => {
  trackVisit('home')
  
  if (isFirstVisit()) {
    setShowWelcomeMessage(true)
    setTimeout(() => {
      setShowWelcomeMessage(false)
    }, 5000)
  }
}, [])
```

### পেজ ভিজিট কাউন্টার

```tsx
const [visitCount, setVisitCount] = useState(0)

useEffect(() => {
  trackVisit('mythbusting')
  setVisitCount(getPageVisitCount('mythbusting'))
}, [])
```

## ডেমো

`/visit-tracking-demo` পেজে সম্পূর্ণ ডেমো দেখতে পারবেন।

## গুরুত্বপূর্ণ নোট

1. **প্রতিবার রিফ্রেশ ≠ প্রথম আসা** - localStorage ব্যবহারের কারণে
2. **নতুন ট্যাব = নতুন সেশন** - sessionStorage ব্যবহারের কারণে
3. **পেজ রিফ্রেশ = ভিজিট কাউন্ট বাড়ে** - প্রতিবার ট্র্যাক করা হয়
4. **ব্রাউজার বন্ধ/খোলা = নতুন সেশন** - sessionStorage রিসেট হয়

## ব্রাউজার সাপোর্ট

- Chrome/Edge: ✅ সম্পূর্ণ সাপোর্ট
- Firefox: ✅ সম্পূর্ণ সাপোর্ট
- Safari: ✅ সম্পূর্ণ সাপোর্ট
- IE: ❌ সাপোর্ট নেই (localStorage/sessionStorage প্রয়োজন)
