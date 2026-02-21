'use client';

import { useEffect, useRef, useState } from 'react';
import { Language } from '@/types/wedding';
import { WeddingConfig } from '@/types/wedding';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';

interface VideoPlayerProps {
  config: WeddingConfig;
  language: Language;
  onVideoEnd: () => void;
  skipToEnd?: boolean;
}

export default function VideoPlayer({ config, language, onVideoEnd, skipToEnd = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(!skipToEnd);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoPath = config.couple.videos[language];
    if (video.src !== videoPath) {
      video.src = videoPath;
      video.load();
    }

    // Se skipToEnd è true, vai direttamente al frame finale senza riprodurre
    if (skipToEnd) {
      const handleLoadedMetadata = () => {
        const offset = (dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv()) ? 3 : 1;
        if (video.duration) {
          video.currentTime = video.duration - offset;
          video.pause();
          setIsFullscreen(false);
          onVideoEnd();
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }

    // Comportamento normale: riproduci il video
    if (isTestEnv()) {
      video.playbackRate = 4.0;
    }

    video.play().catch(console.error);

    const handleTimeUpdate = () => {
      if (!video.duration) return;

      const offset = (dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv()) ? 3 : 1;
      
      if (video.currentTime >= video.duration - offset) {
        video.pause();
        video.currentTime = video.duration - offset;
        setIsFullscreen(false);
        onVideoEnd();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [config, language, onVideoEnd, skipToEnd]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('lock-scroll');
    } else {
      document.body.classList.remove('lock-scroll');
    }
  }, [isFullscreen]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className={`video-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      <video
        ref={videoRef}
        autoPlay={!skipToEnd}
        muted
        playsInline
        onClick={handleVideoClick}
      >
        <source src={config.couple.videos[language]} type="video/mp4" />
      </video>
    </div>
  );
}
