import Image from "next/image";
import styled from "styled-components";
import { MediaType } from "../../../shared/types/types"; // Adjust path as needed
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const ImageComponentWrapper = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--colour-cream);

  mux-player,
  img {
    display: block;
    object-fit: cover;
  }
`;

const MotionDivBase = styled(motion.div)`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
`;

const InnerBlurWrapper = styled(MotionDivBase)`
  z-index: 2; // Placeholder on top
`;

const InnerMainImageWrapper = styled(MotionDivBase)`
  z-index: 1; // Main image underneath placeholder
`;

// Variants for the placeholder (LQIP)
const placeholderVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    filter: "blur(2px)", // Apply blur style
    scale: 1.05, // Apply scale style
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    filter: "blur(0px)", // Unblur as it exits
    scale: 1, // Unzoom as it exits
    transition: { duration: 0.5, ease: "easeIn", delay: 0 }, // No delay needed once main is loaded
  },
};

// Variants for the main image
const mainImageVariants = {
  initial: {
    // Starts hidden, can also be blurred/scaled if desired to match placeholder exit
    opacity: 0,
    // filter: "blur(2px)", // Optional: if you want main image to also de-blur
    // scale: 1.05,         // Optional: if you want main image to also de-scale
  },
  animate: {
    // Animates to fully visible and sharp
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

type Props = {
  data: MediaType;
  isPriority?: boolean;
  inView: boolean;
  noAnimation?: boolean;
  sizes: string;
  alt?: string;
  lazyLoad?: boolean;
};

const ImageComponent = (props: Props) => {
  const {
    data,
    isPriority = false,
    inView,
    noAnimation = false,
    sizes,
    alt,
    lazyLoad,
  } = props;

  const imageUrl = data?.media?.image?.asset?.url;
  const blurDataURL = data?.media?.image?.asset?.metadata?.lqip;
  const imageAltText = alt || data?.media?.image?.alt || "Visual media content";
  const loadingStrategy = isPriority
    ? "eager"
    : lazyLoad === false
      ? "eager"
      : "lazy";

  // State to track if the main image has loaded
  // If noAnimation is true, we consider it "loaded" immediately for layout purposes.
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(noAnimation);

  const handleMainImageLoad = () => {
    if (!noAnimation) {
      // Only update state if animations are enabled
      setIsMainImageLoaded(true);
    }
  };

  // Reset loaded state if the image URL changes (e.g. in a dynamic context)
  // or if inView becomes false after being true (image might need to reload or re-animate)
  useEffect(() => {
    if (!inView && !isPriority) {
      // If not in view and not a priority image that should stay loaded
      setIsMainImageLoaded(noAnimation); // Reset to initial state based on noAnimation
    }
  }, [imageUrl, inView, isPriority, noAnimation]);

  // If noAnimation is true, render a simpler structure without Framer Motion.
  if (noAnimation) {
    return (
      <ImageComponentWrapper className="media-wrapper">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAltText}
            priority={isPriority}
            fill
            style={{ objectFit: "cover" }}
            sizes={sizes}
            loading={loadingStrategy}
          />
        )}
        {/* Show LQIP as a static background if no main image and noAnimation */}
        {!imageUrl && blurDataURL && (
          <Image
            src={blurDataURL}
            alt={imageAltText}
            priority={isPriority}
            fill
            style={{
              objectFit: "cover",
              filter: "blur(2px)",
              transform: "scale(1.05)",
            }}
            sizes={sizes}
            loading="eager"
          />
        )}
      </ImageComponentWrapper>
    );
  }

  // Determine if conditions are met to show/animate elements
  const shouldAnimate = inView || isPriority;

  return (
    <ImageComponentWrapper className="media-wrapper">
      <AnimatePresence>
        {shouldAnimate && blurDataURL && !isMainImageLoaded && (
          <InnerBlurWrapper
            key="placeholder"
            variants={placeholderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Image
              src={blurDataURL}
              alt={imageAltText} // Placeholder alt
              priority={isPriority} // Load LQIP eagerly if main image is priority
              fill
              style={{ objectFit: "cover" }}
              sizes={sizes} // Consistent sizes
              loading="eager" // Placeholders should generally load eagerly
            />
          </InnerBlurWrapper>
        )}
      </AnimatePresence>

      {imageUrl && (
        <InnerMainImageWrapper
          key="main-image-wrapper"
          variants={mainImageVariants}
          initial="initial"
          animate={shouldAnimate && isMainImageLoaded ? "animate" : "initial"}
        >
          <Image
            src={imageUrl}
            alt={imageAltText}
            priority={isPriority}
            fill
            style={{ objectFit: "cover" }}
            sizes={sizes}
            loading={loadingStrategy}
            onLoadingComplete={handleMainImageLoad} // Key callback
            onError={() => {
              // Optional: Handle image load errors
              if (!noAnimation) setIsMainImageLoaded(true); // Hide placeholder even on error
            }}
          />
        </InnerMainImageWrapper>
      )}
    </ImageComponentWrapper>
  );
};

export default ImageComponent;
