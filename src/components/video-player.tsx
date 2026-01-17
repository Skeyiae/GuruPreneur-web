"use client";

import { isYouTubeUrl, convertToYouTubeEmbed } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export default function VideoPlayer({ 
  videoUrl, 
  title,
  className = "" 
}: VideoPlayerProps) {
  if (!videoUrl) return null;

  // Check if it's a YouTube URL
  if (isYouTubeUrl(videoUrl)) {
    // Convert to embed URL using utility function
    const embedUrl = convertToYouTubeEmbed(videoUrl);
    
    if (embedUrl) {
      return (
        <div className={`w-full ${className}`}>
          {title && (
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
          )}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={embedUrl}
              title={title || "Video Player"}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
  }

  // For Cloudinary or other direct video URLs
  // Cloudinary video URLs might need .mp4 extension for proper playback
  let videoSrc = videoUrl;
  if (videoUrl.includes("cloudinary.com") && !videoUrl.includes(".mp4") && !videoUrl.includes("format")) {
    // Add format parameter for Cloudinary videos if not present
    videoSrc = videoUrl.includes("?") 
      ? `${videoUrl}&f_mp4` 
      : `${videoUrl}?f_mp4`;
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
      )}
      <video
        src={videoSrc}
        controls
        className="w-full rounded-lg"
        style={{ maxHeight: "600px" }}
        preload="metadata"
      >
        Browser Anda tidak mendukung tag video.
        <a href={videoUrl} target="_blank" rel="noopener noreferrer">
          Klik di sini untuk membuka video
        </a>
      </video>
    </div>
  );
}
