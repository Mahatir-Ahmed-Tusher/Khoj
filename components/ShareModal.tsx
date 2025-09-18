import React, { useState } from "react";
import {
  Copy,
  Check,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle,
  XIcon,
  XCircleIcon,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  shareUrl: string;
  color: string;
  hoverColor: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url = window.location.href,
}) => {
  const [copied, setCopied] = useState(false);

  const socialPlatforms: SocialPlatform[] = [
    {
      name: "ফেসবুক",
      icon: <Facebook className="w-5 h-5" />,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      name: "X",
      icon: <XIcon className="w-5 h-5" />,
      shareUrl: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}`,
      color: "bg-blue-800",
      hoverColor: "hover:bg-blue-900",
    },
    {
      name: "হোয়াটসঅ্যাপ",
      icon: <MessageCircle className="w-5 h-5" />,
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`${url}`)}`,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      name: "লিঙ্কডইন",
      icon: <Linkedin className="w-5 h-5" />,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = (shareUrl: string, platformName: string) => {
    if (platformName === "Instagram") {
      // Instagram doesn't have a direct web share URL, so we'll copy the link instead
      handleCopyLink();
      return;
    }
    window.open(shareUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl transform transition-all animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 font-tiro-bangla">
            এই পোস্ট শেয়ার করুন
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <XCircleIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Social Platforms - Horizontal Layout */}
          <div className="flex flex-wrap gap-3 mb-6">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform.shareUrl, platform.name)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-white transition-all duration-200 transform hover:scale-105 active:scale-95 ${platform.color} ${platform.hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {platform.icon}
                <span className="text-sm font-medium font-tiro-bangla">
                  {platform.name}
                </span>
              </button>
            ))}
            
            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border-2 ${
                copied
                  ? "bg-green-500 text-white hover:bg-green-600 border-green-500"
                  : "bg-gray-800 text-white hover:bg-gray-900 border-red-500"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-tiro-bangla">কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-tiro-bangla">লিঙ্ক কপি</span>
                </>
              )}
            </button>
          </div>

          {/* Content Preview */}
          {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1 text-sm">{title}</h4>
            <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
