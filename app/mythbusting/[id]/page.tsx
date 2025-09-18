// "use client";

// import { useState, useRef, useEffect, Suspense } from "react";
// import Footer from "@/components/Footer";
// import {
//   Copy,
//   Download,
//   Share2,
// } from "lucide-react";
// import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";
// import { Source } from "@/lib/types";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import ShareModal from "@/components/ShareModal";

// interface FactCheckContent {
//   id: string;
//   query: string;
//   result: string;
//   timestamp: Date;
//   sources?: Source[];
//   verdict?: string;
//   summary?: string;
//   conclusion?: string;
//   keyTakeaways?: string[];
//   ourSiteArticles?: Array<{
//     title: string;
//     url: string;
//     snippet: string;
//   }>;
// }

// function MythbustingContent() {
//   const [isClient, setIsClient] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [currentContent, setCurrentContent] = useState<FactCheckContent | null>(null);
  
//   // Get the ID from the URL path
//   const pathname = typeof window !== "undefined" ? window.location.pathname : "";
//   const idFromPath = pathname.split('/').pop();
  
//   // Query to retrieve fact check by ID
//   const factCheckById = useQuery(api.factChecks.getByID, {
//     id: idFromPath || "",
//   });

//   // Load content when fact check data is available
//   useEffect(() => {
//     if (factCheckById) {
//       const content: FactCheckContent = {
//         id: factCheckById._id,
//         query: factCheckById.query,
//         result: factCheckById.result,
//         timestamp: new Date(factCheckById.timestamp),
//         sources: factCheckById.sources?.map((source: any, index: number) => ({
//           id: index + 1,
//           title: source.title,
//           book_title: source.title,
//           page: 1,
//           category: "mythbusting",
//           language: source.language || "English",
//           content_preview: source.snippet,
//           snippet: source.snippet,
//           url: source.url,
//         })),
//         verdict: factCheckById.verdict,
//       };
//       setCurrentContent(content);
//     }
//   }, [factCheckById]);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const copyContent = async (contentText: string) => {
//     try {
//       await navigator.clipboard.writeText(contentText);
//       alert("কন্টেন্ট কপি করা হয়েছে!");
//     } catch (error) {
//       console.error("Copy failed:", error);
//       alert("কপি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
//     }
//   };

//   const downloadContent = (contentText: string) => {
//     const textContent = `
// মিথবাস্টিং - পূর্বে তৈরি করা কন্টেন্ট
// ====================================

// ${contentText}

// কন্টেন্ট তৈরি: ${currentContent?.timestamp.toLocaleString("bn-BD") || new Date().toLocaleString("bn-BD")}
// ডাউনলোড: ${new Date().toLocaleString("bn-BD")}
//     `.trim();

//     const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `mythbusting-content-${new Date().toISOString().split("T")[0]}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };


//   const getVerdictText = (verdict?: string) => {
//     switch (verdict) {
//       case "true":
//         return "সত্য";
//       case "false":
//         return "মিথ্যা";
//       case "misleading":
//         return "ভ্রান্তিমূলক";
//       case "partially_true":
//         return "আংশিক সত্য";
//       default:
//         return "অযাচাইকৃত";
//     }
//   };

//   const getVerdictColor = (verdict?: string) => {
//     switch (verdict) {
//       case "true":
//         return "bg-green-100 text-green-800";
//       case "false":
//         return "bg-red-100 text-red-800";
//       case "misleading":
//         return "bg-yellow-100 text-yellow-800";
//       case "partially_true":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center space-x-3 mb-4">
//             <img
//               src="/mythbusting.png"
//               alt="মিথবাস্টিং"
//               className="h-8 w-8 object-contain"
//             />
//             <h1 className="text-2xl font-bold text-gray-900 font-tiro-bangla">
//               মিথবাস্টিং - পূর্বে তৈরি করা কন্টেন্ট
//             </h1>
//           </div>
//           <p className="text-gray-600 font-tiro-bangla">
//             এই কন্টেন্ট পূর্বে তৈরি করা হয়েছে এবং এখন প্রদর্শিত হচ্ছে
//           </p>
//         </div>

//         {/* Content Container */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] flex flex-col overflow-hidden">
//           {/* Content Area */}
//           <div className="flex-1 overflow-y-auto p-8">
//             {!isClient ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="flex items-center space-x-2">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
//                   <span className="text-gray-600 font-tiro-bangla">
//                     লোড হচ্ছে...
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {!currentContent ? (
//                   <div className="text-center text-gray-500 font-tiro-bangla">
//                     <div className="mb-4">
//                       <div className="h-16 w-16 mx-auto text-gray-300">📄</div>
//                     </div>
//                     <p className="text-lg">
//                       কন্টেন্ট লোড হচ্ছে...
//                     </p>
//                     <p className="text-sm mt-2">
//                       অনুগ্রহ করে অপেক্ষা করুন
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="mb-8">
//                     {/* Question Section */}
//                     <div className="mb-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
//                         মূল প্রশ্ন:
//                       </h3>
//                       <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
//                         <p className="text-gray-800 font-tiro-bangla">
//                           {currentContent.query}
//                         </p>
//                         <p
//                           className="text-xs text-gray-500 mt-2"
//                           suppressHydrationWarning
//                         >
//                           কন্টেন্ট তৈরি: {typeof window !== "undefined"
//                             ? currentContent.timestamp.toLocaleString("bn-BD")
//                             : currentContent.timestamp.toISOString()}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Content Display */}
//                     <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//                       {/* Content Header */}
//                       <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-lg">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <h2 className="text-xl font-bold text-gray-900 font-tiro-bangla">
//                               মিথবাস্টিং - পূর্বে তৈরি করা প্রতিবেদন
//                             </h2>
//                             {currentContent.verdict && (
//                               <div className="mt-2">
//                                 <span
//                                   className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(currentContent.verdict)}`}
//                                 >
//                                   {getVerdictText(currentContent.verdict)}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() =>
//                                 copyContent(currentContent.result)
//                               }
//                               className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded border border-gray-300 transition-colors duration-200 font-tiro-bangla text-sm"
//                             >
//                               <Copy className="h-4 w-4" />
//                               <span>কপি</span>
//                             </button>
//                             <button
//                               onClick={() =>
//                                 downloadContent(currentContent.result)
//                               }
//                               className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors duration-200 font-tiro-bangla text-sm"
//                             >
//                               <Download className="h-4 w-4" />
//                               <span>ডাউনলোড</span>
//                             </button>
//                             <button
//                               id="share-button"
//                               onClick={() => setShowShareModal(true)}
//                               className="flex items-center space-x-2 bg-gray-100 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
//                             >
//                               <Share2 />
//                               <span className="font-medium">
//                                 শেয়ার করুন
//                               </span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Content Body */}
//                       <div className="p-6">
//                         <div className="prose prose-lg max-w-none font-tiro-bangla">
//                           <div
//                             className="leading-relaxed text-gray-800"
//                             dangerouslySetInnerHTML={{
//                               __html: sanitizeHtml(
//                                 parseMarkdown(currentContent.result)
//                               ),
//                             }}
//                           />
//                         </div>

//                         {/* Content Metadata */}
//                         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                           <h4 className="text-sm font-semibold text-blue-900 mb-3 font-tiro-bangla flex items-center space-x-2">
//                             <span>📊</span>
//                             <span>কন্টেন্ট মেটাডাটা</span>
//                           </h4>
//                           <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div>
//                               <p className="text-blue-700 font-medium font-tiro-bangla">
//                                 প্রশ্ন:
//                               </p>
//                               <p className="text-blue-900 font-tiro-bangla">
//                                 {currentContent.query}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-blue-700 font-medium font-tiro-bangla">
//                                 ফলাফল:
//                               </p>
//                               <p className="text-blue-900 font-tiro-bangla">
//                                 {currentContent.verdict
//                                   ? getVerdictText(currentContent.verdict)
//                                   : "অযাচাইকৃত"}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-blue-700 font-medium font-tiro-bangla">
//                                 কন্টেন্ট তৈরি:
//                               </p>
//                               <p
//                                 className="text-blue-900 font-tiro-bangla"
//                                 suppressHydrationWarning
//                               >
//                                 {typeof window !== "undefined"
//                                   ? currentContent.timestamp.toLocaleString("bn-BD")
//                                   : currentContent.timestamp.toISOString()}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-blue-700 font-medium font-tiro-bangla">
//                                 উৎস সংখ্যা:
//                               </p>
//                               <p className="text-blue-900 font-tiro-bangla">
//                                 {currentContent.sources?.length || 0}টি
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Sources Section */}
//                         {currentContent.sources &&
//                           currentContent.sources.length > 0 && (
//                             <div className="mt-8 p-4 bg-gray-50 rounded-lg">
//                               <h4 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
//                                 রেফারেন্স:
//                               </h4>
//                               <div className="space-y-3">
//                                 {currentContent.sources.map(
//                                   (source, index) => (
//                                     <div
//                                       key={index}
//                                       className="bg-white p-3 rounded border border-gray-200"
//                                     >
//                                       <div className="flex justify-between items-start mb-2">
//                                         <h5 className="font-semibold text-gray-900 font-tiro-bangla">
//                                           <a
//                                             href={source.url}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="text-blue-600 hover:text-blue-800 underline"
//                                           >
//                                             {source.book_title || source.title}
//                                           </a>
//                                         </h5>
//                                       </div>
//                                       <p className="text-sm text-gray-600 font-tiro-bangla leading-relaxed">
//                                         {source.content_preview || source.snippet}
//                                       </p>
//                                     </div>
//                                   )
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                         {/* Content Footer */}
//                         <div className="mt-6 pt-4 border-t border-gray-200">
//                           <p
//                             className="text-xs text-gray-500 font-tiro-bangla"
//                             suppressHydrationWarning
//                           >
//                             কন্টেন্ট তৈরি:{" "}
//                             {typeof window !== "undefined"
//                               ? currentContent.timestamp.toLocaleString("bn-BD")
//                               : currentContent.timestamp.toISOString()}
//                             {" | "}
//                             প্রদর্শিত: {typeof window !== "undefined"
//                               ? new Date().toLocaleString("bn-BD")
//                               : new Date().toISOString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Info Section */}
//         <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3 font-tiro-bangla">
//             এই কন্টেন্ট সম্পর্কে
//           </h3>
//           <p className="text-gray-800 font-tiro-bangla leading-relaxed">
//             এই মিথবাস্টিং কন্টেন্ট পূর্বে তৈরি করা হয়েছে এবং এখন প্রদর্শিত হচ্ছে। 
//             এটি বৈজ্ঞানিক দাবি, কুসংস্কার, ভূতুড়ে ঘটনা এবং সিউডোসায়েন্স সম্পর্কে 
//             সঠিক তথ্য প্রদান করে। বৈজ্ঞানিক গবেষণা এবং প্রমাণের ভিত্তিতে তৈরি করা হয়েছে।
//           </p>
//           <div className="mt-4 flex flex-wrap gap-2">
//             <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300">
//               পূর্বে তৈরি করা কন্টেন্ট
//             </span>
//             <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
//               বৈজ্ঞানিক ভিত্তি
//             </span>
//             <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300">
//               যাচাইকৃত তথ্য
//             </span>
//             <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
//               সময়সীমা সহ
//             </span>
//           </div>
//         </div>
//       </div>

//       <Footer />

//       <ShareModal
//         isOpen={showShareModal}
//         onClose={() => setShowShareModal(false)}
//         url={typeof window !== "undefined" ? window.location.href : ""}
//       />
//     </div>
//   );
// }

// export default function MythbustingPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="relative w-16 h-16 mx-auto mb-4">
//               <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
//               <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//             </div>
//             <p className="text-gray-600 font-tiro-bangla">লোড হচ্ছে...</p>
//           </div>
//         </div>
//       }
//     >
//       <MythbustingContent />
//     </Suspense>
//   );
// }




"use client";

import { useState, useEffect, Suspense, use } from "react";
import Footer from "@/components/Footer";
import { Loader2, Copy, Download, Share2 } from "lucide-react";
import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ShareModal from "@/components/ShareModal";
import { Id } from "@/convex/_generated/dataModel";

// Helper functions for verdict display
const getVerdictText = (verdict?: string) => {
  switch (verdict) {
    case "true":
      return "সত্য";
    case "false":
      return "মিথ্যা";
    case "misleading":
      return "ভ্রান্তিমূলক";
    case "partially_true":
      return "আংশিক সত্য";
    default:
      return "অযাচাইকৃত";
  }
};

const getVerdictColor = (verdict?: string) => {
  switch (verdict) {
    case "true":
      return "bg-green-100 text-green-800";
    case "false":
      return "bg-red-100 text-red-800";
    case "misleading":
      return "bg-yellow-100 text-yellow-800";
    case "partially_true":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function MythbustingContent({ id }: { id: Id<"factChecks"> }) {
  console.log(`[MythbustingContent] Rendering with ID: ${id}`);
  
  const [isClient, setIsClient] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Retrieve the specific fact check data from Convex using the ID from the URL
  const factCheckData = useQuery(api.factChecks.getByID, { id });
  console.log(factCheckData, "jj")

  useEffect(() => {
    console.log("[MythbustingContent] Component has mounted on the client.");
    setIsClient(true);
  }, []);

  // Debugging useEffect to monitor data fetching status
  useEffect(() => {
    if (factCheckData === undefined) {
      console.log("[MythbustingContent] Data fetching in progress (factCheckData is undefined)...");
    } else if (factCheckData === null) {
      console.log("[MythbustingContent] Data fetching complete: Report not found (factCheckData is null).");
    } else {
      console.log("[MythbustingContent] Data fetching complete: Report data received.", factCheckData);
    }
  }, [factCheckData]);


  const copyBotResponse = async (messageText: string) => {
    console.log("[Function] copyBotResponse triggered.");
    try {
      await navigator.clipboard.writeText(messageText);
      alert("প্রতিবেদন কপি করা হয়েছে!");
      console.log("[Function] copyBotResponse successful.");
    } catch (error) {
      console.error("[Function] copyBotResponse failed:", error);
      alert("কপি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  const downloadBotResponse = (messageText: string, query: string) => {
    console.log("[Function] downloadBotResponse triggered.");
    const textContent = `
মিথবাস্টিং প্রতিবেদন
====================================

প্রশ্ন: ${query}
যাচাইকৃত: ${factCheckData ? new Date(factCheckData.timestamp).toLocaleString("bn-BD") : new Date().toLocaleString("bn-BD")}

${messageText}
    `.trim();

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mythbusting-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("[Function] downloadBotResponse completed.");
  };

  const openShareModal = () => {
    console.log("[Function] openShareModal triggered.");
    setShowShareModal(true);
  };

  // Display a loading spinner while waiting for client-side hydration or data fetching
  if (!isClient || factCheckData === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-tiro-bangla">
            প্রতিবেদন লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Display a "not found" message if the data comes back as null
  if (factCheckData === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center text-gray-500 font-tiro-bangla">
          <h2 className="text-2xl font-bold mb-4">প্রতিবেদন পাওয়া যায়নি</h2>
          <p>দুঃখিত, অনুরোধ করা প্রতিবেদনটি খুঁজে পাওয়া যায়নি।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img
              src="/mythbusting.png"
              alt="মিথবাস্টিং"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900 font-tiro-bangla">
              মিথবাস্টিং প্রতিবেদন
            </h1>
          </div>
          <p className="text-center text-gray-600 font-tiro-bangla">
            আপনার অনুসন্ধানের উপর ভিত্তি করে একটি বিস্তারিত প্রতিবেদন নিচে দেওয়া
            হলো।
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* User's Query */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
                অনুসন্ধানকৃত প্রশ্ন:
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
                <p className="text-gray-800 font-tiro-bangla">
                  {factCheckData.query}
                </p>
                <p
                  className="text-xs text-gray-500 mt-2"
                  suppressHydrationWarning
                >
                  {new Date(factCheckData.timestamp).toLocaleString("bn-BD")}
                </p>
              </div>
            </div>

            {/* AI-Generated Report */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-tiro-bangla">
                      বিস্তারিত বিশ্লেষণ
                    </h2>
                    {factCheckData.verdict && (
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(
                            factCheckData.verdict
                          )}`}
                        >
                          {getVerdictText(factCheckData.verdict)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyBotResponse(factCheckData.result)}
                      className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded border border-gray-300 transition-colors duration-200 font-tiro-bangla text-sm"
                      title="কপি করুন"
                    >
                      <Copy className="h-4 w-4" />
                      <span>কপি</span>
                    </button>
                    <button
                      onClick={() =>
                        downloadBotResponse(
                          factCheckData.result,
                          factCheckData.query
                        )
                      }
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors duration-200 font-tiro-bangla text-sm"
                      title="ডাউনলোড করুন"
                    >
                      <Download className="h-4 w-4" />
                      <span>ডাউনলোড</span>
                    </button>
                    <button
                      onClick={openShareModal}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-all duration-200"
                      title="শেয়ার করুন"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>শেয়ার</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6">
                <div className="prose prose-lg max-w-none font-tiro-bangla">
                  <div
                    className="leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(parseMarkdown(factCheckData.result)),
                    }}
                  />
                </div>

                {/* Sources Section */}
                {factCheckData.sources && factCheckData.sources.length > 0 && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                      তথ্যসূত্র:
                    </h4>
                    <div className="space-y-3">
                      {factCheckData.sources.map((source, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border border-gray-200"
                        >
                          <h5 className="font-semibold text-gray-900 font-tiro-bangla">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {source.title}
                            </a>
                          </h5>
                          <p className="text-sm text-gray-600 font-tiro-bangla leading-relaxed">
                            {source.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Report Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p
                    className="text-xs text-gray-500 font-tiro-bangla"
                    suppressHydrationWarning
                  >
                    প্রতিবেদন তৈরি:{" "}
                    {new Date(factCheckData.timestamp).toLocaleString("bn-BD")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}

export default function MythbustingPage({
  params,
}: {
  params: Promise<{ id: Id<"factChecks"> }>;
}) {
  console.log("[MythbustingPage] Page component is rendering (Server).");
  // The `use` hook unwraps the promise for the params object.
  // This is the recommended approach for accessing params in new versions of Next.js.
  const resolvedParams = use(params);
  console.log(`[MythbustingPage] Resolved params on server:`, resolvedParams);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 font-tiro-bangla">লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <MythbustingContent id={resolvedParams.id} />
    </Suspense>
  );
}