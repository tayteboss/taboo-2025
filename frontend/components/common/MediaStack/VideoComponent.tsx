import MuxPlayer from "@mux/mux-player-react/lazy";
import styled from "styled-components";
import { MediaType } from "../../../shared/types/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoadingIndicator from "../../elements/LoadingIndicator";
import VideoControls from "../../blocks/VideoControls";

const VideoComponentWrapper = styled.div`
  position: relative;
  overflow: hidden;

  mux-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  mux-player,
  img {
    transition: all var(--transition-speed-extra-slow) var(--transition-ease);
  }
`;

const InnerBlur = styled(motion.div)`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const Inner = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const wrapperVariants = {
  hidden: {
    opacity: 1,
    filter: "blur(10px)",
    scale: 1.05,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
      delay: 0.2,
    },
  },
};

type Props = {
  data: MediaType;
  inView: boolean;
  isPriority: boolean;
  noAnimation?: boolean;
  lazyLoad?: boolean;
  useLoader?: boolean;
  useVideoControls?: boolean;
};

const VideoComponent = (props: Props) => {
  const {
    data,
    inView,
    isPriority,
    noAnimation,
    useLoader,
    lazyLoad,
    useVideoControls,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoLength, setVideoLength] = useState(
    useVideoControls ? data?.media?.video?.asset?.data?.duration : undefined
  );

  const muxPlayerRef = useRef<any>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const handleSeek = (time: number) => {
    if (muxPlayerRef?.current) {
      muxPlayerRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    if (muxPlayerRef.current) {
      if (isPlaying) {
        muxPlayerRef.current.play();
      } else {
        muxPlayerRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (useVideoControls) {
      setVideoLength(data?.media?.video?.asset?.data?.duration);
    }
  }, [data, useVideoControls]);

  useEffect(() => {
    if (!muxPlayerRef.current) return;
    muxPlayerRef.current.play();
  }, [isLoading]);

  useEffect(() => {
    muxPlayerRef?.current?.play();
  }, []);

  const playbackId = data?.media?.video?.asset?.playbackId;
  const posterUrl = `https://image.mux.com/${data?.media?.video?.asset?.playbackId}/thumbnail.png?width=214&height=121&time=1`;

  return (
    <VideoComponentWrapper className="media-wrapper">
      {useVideoControls && (
        <VideoControls
          isMuted={isMuted}
          isPlaying={isPlaying}
          currentTime={currentTime}
          videoLength={videoLength}
          setIsMuted={setIsMuted}
          setIsPlaying={setIsPlaying}
          handleSeek={handleSeek}
        />
      )}
      {!noAnimation && posterUrl && (
        <AnimatePresence initial={false}>
          {inView && playbackId && (
            <InnerBlur
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Image
                src={`${posterUrl}`}
                alt={""}
                fill
                priority={isPriority}
                sizes="50vw"
              />
            </InnerBlur>
          )}
        </AnimatePresence>
      )}
      {playbackId && (
        <Inner>
          <MuxPlayer
            ref={muxPlayerRef}
            streamType="on-demand"
            playbackId={playbackId}
            autoPlay="muted"
            loop={true}
            thumbnailTime={1}
            loading={lazyLoad ? "viewport" : "page"}
            preload="auto"
            muted
            playsInline={true}
            poster={`${posterUrl}`}
            minResolution="2160p"
            onPlaying={() => setIsLoading(false)}
            onTimeUpdate={
              useVideoControls
                ? (e: any) => {
                    const newTime = e.target.currentTime;
                    // Only update if the time has changed significantly
                    if (Math.abs(newTime - lastTimeRef.current) > 0.01) {
                      setCurrentTime(newTime);
                      lastTimeRef.current = newTime;
                    }
                  }
                : undefined
            }
          />
        </Inner>
      )}
      <AnimatePresence>
        {isLoading && useLoader && <LoadingIndicator />}
      </AnimatePresence>
    </VideoComponentWrapper>
  );
};

export default VideoComponent;
