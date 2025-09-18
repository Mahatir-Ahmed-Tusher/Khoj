'use client'

import { useState } from 'react'
import { Play, ExternalLink, Calendar, Clock } from 'lucide-react'

export default function VideoCorner() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Video data
  const videoSections = [
    {
      title: "খোঁজ সম্পর্কে",
      description: "খোঁজ কী এবং কীভাবে কাজ করে তা জানুন",
      videos: [
        {
          id: "M89gdblo93w",
          title: "খোঁজ পরিচিতি",
          description: "খোঁজ প্ল্যাটফর্ম সম্পর্কে বিস্তারিত জানুন",
          duration: "5:30",
          date: "২০২৫",
          thumbnail: "https://img.youtube.com/vi/M89gdblo93w/maxresdefault.jpg"
        }
      ]
    },
    {
      title: "খোঁজের সঙ্গে ফ্যাক্টচেকিং",
      description: "খোঁজ ব্যবহার করে কীভাবে ফ্যাক্টচেক করবেন",
      videos: [
        {
          id: "RZUFT_pQjE4",
          title: "খোঁজ দিয়ে মিথবাস্টিং",
          description: "মোবাইলে খোঁজ ব্যবহার করে একটা গুজব খন্ডন করা যাক",
          duration: "0:45",
          date: "২০২৫",
          thumbnail: "https://img.youtube.com/vi/RZUFT_pQjE4/maxresdefault.jpg"
        },
        {
          id: "7HOS4EUZLg8",
          title: "খোঁজ দিয়ে ফ্যাক্টচেকিং",
          description: "চলুন মোবাইলে খোঁজ ব্যবহার করে ফ্যাক্টচেকিং করি",
          duration: "0:45",
          date: "২০২৫",
          thumbnail: "https://img.youtube.com/vi/7HOS4EUZLg8/maxresdefault.jpg"
        }
      ]
    },
    {
      title: "টিউটোরিয়াল ও গাইড",
      description: "খোঁজের বিভিন্ন ফিচার ব্যবহারের গাইড(ভিডিও আসছে শীঘ্রই)",
      videos: []
    },
    {
      title: "সফলতার গল্প",
      description: "খোঁজ ব্যবহারকারীদের সফলতার গল্প (ভিডিও আসছে শীঘ্রই)",
      videos: []
    }
  ]

  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  }

  const getWatchUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 font-tiro-bangla mb-4">
              ভিডিও কর্নার
            </h1>
            <p className="text-lg text-gray-600 font-tiro-bangla max-w-3xl mx-auto">
              খোঁজ সম্পর্কে জানুন, ফ্যাক্টচেকিং শিখুন এবং আমাদের টিউটোরিয়াল দেখুন
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold font-tiro-bangla">ভিডিও দেখুন</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(selectedVideo)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Video Sections */}
        <div className="space-y-12">
          {videoSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-tiro-bangla mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600 font-tiro-bangla">
                  {section.description}
                </p>
              </div>

              {section.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.videos.map((video, videoIndex) => (
                    <div key={videoIndex} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video bg-gray-200">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => setSelectedVideo(video.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
                          >
                            <Play className="w-6 h-6 ml-1" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 font-tiro-bangla mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-tiro-bangla mb-3 line-clamp-2">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-tiro-bangla">{video.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{video.duration}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => setSelectedVideo(video.id)}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-3 rounded-lg transition-colors font-tiro-bangla"
                          >
                            দেখুন
                          </button>
                          <a
                            href={getWatchUrl(video.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Play className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 font-tiro-bangla mb-2">
                    শীঘ্রই আসছে
                  </h3>
                  <p className="text-gray-600 font-tiro-bangla">
                    এই বিভাগে ভিডিও শীঘ্রই যোগ করা হবে
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-tiro-bangla mb-4">
            আরও ভিডিও দেখতে চান?
          </h2>
          <p className="text-gray-600 font-tiro-bangla mb-6">
            আমাদের YouTube চ্যানেলে সাবস্ক্রাইব করুন এবং নতুন ভিডিওর নোটিফিকেশন পান
          </p>
          <a
            href="https://www.youtube.com/@khoj-factchecker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors font-tiro-bangla"
          >
            <Play className="w-5 h-5" />
            <span>YouTube চ্যানেল দেখুন</span>
          </a>
        </div>
      </div>
    </div>
  )
}

