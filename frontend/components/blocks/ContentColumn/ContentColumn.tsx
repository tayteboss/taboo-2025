import { motion } from "framer-motion";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import useEmblaCarousel from "embla-carousel-react";
import { ColumnType } from "../../../shared/types/types";
import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";

const ContentColumnWrapper = styled.div`
  background: var(--colour-grey);
  width: 100%;
  position: relative;
  border-radius: 15px;
  overflow: hidden;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    border-radius: 10px;
  }
`;

const Inner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Embla = styled.div`
  flex-grow: 1;
  overflow: hidden;

  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Container = styled(motion.div)`
  height: 100%;
  display: flex;
`;

const Slide = styled(motion.div)`
  flex: 0 0 100%;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const SlideInner = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(15)};
  margin: 0 auto;
  max-width: 80%;
  overflow-y: auto;
  padding: ${pxToRem(20)} 0;
`;

const Title = styled.h4`
  text-align: center;
  color: var(--colour-black);
`;

const Description = styled.p`
  text-align: center;
  color: var(--colour-black);
`;

const PaginationContainer = styled.div`
  position: absolute;
  bottom: ${pxToRem(40)};
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${pxToRem(8)};
  z-index: 1;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    bottom: ${pxToRem(20)};
  }
`;

const PaginationDotButton = styled.button<{ $isActive: boolean }>`
  background: var(--colour-black);
  opacity: ${(props) => (props.$isActive ? 1 : 0.1)};
  width: ${pxToRem(8)};
  height: ${pxToRem(8)};
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out;

  &:hover {
    opacity: ${(props) => (props.$isActive ? 1 : 0.3)};
  }
`;

type Props = {
  data: ColumnType["contentBlock"];
};

const ContentColumn = (props: Props) => {
  const { data } = props;

  const hasData = data && data?.length > 0;
  const hasMultipleSlides = hasData && data.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  // State for pagination
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Update selected index state when Embla settles on a slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Function to scroll Embla to a specific slide index
  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Effect to initialize and attach/detach listeners
  useEffect(() => {
    if (!emblaApi) return;

    // Get initial scroll snaps (indices) and set initial selected index
    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());

    // Listen for 'select' event (when slide changes)
    emblaApi.on("select", onSelect);
    // Listen for 'reInit' event (e.g., on resize) to reset state if needed
    emblaApi.on("reInit", onSelect);

    // Cleanup listeners on component unmount
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]); // Rerun effect if emblaApi or onSelect changes

  const handleDescriptionClass = (text?: string) => {
    if (!text) return "type-h2";
    const charCount = text.length;
    return charCount < 55 ? "type-h2" : "type-h3";
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <ContentColumnWrapper
      ref={ref}
      className={`column-ratio-wrapper view-element-fade-in ${
        inView ? "view-element-fade-in--in-view" : ""
      }`}
    >
      <Inner>
        {!hasMultipleSlides && (
          <SlideInner data-lenis-prevent>
            {data && data[0]?.title && (
              <Title className="type-mono-small">{data[0].title}</Title>
            )}
            {data && data[0]?.text && (
              <Description className={handleDescriptionClass(data[0].text)}>
                {data[0].text}
              </Description>
            )}
          </SlideInner>
        )}

        {/* --- Pagination Rendering --- */}
        {hasMultipleSlides && (
          <>
            <Embla className="embla" ref={emblaRef}>
              <Container className="embla__container">
                {hasData &&
                  data?.map((item, i) => (
                    <Slide className="embla__slide" key={i}>
                      <SlideInner data-lenis-prevent>
                        {item?.title && (
                          <Title className="type-mono-small">
                            {item.title}
                          </Title>
                        )}
                        {item?.text && (
                          <Description
                            className={handleDescriptionClass(item.text)}
                          >
                            {item.text}
                          </Description>
                        )}
                      </SlideInner>
                    </Slide>
                  ))}
              </Container>
            </Embla>
            <PaginationContainer>
              {scrollSnaps.map((_, index) => (
                <PaginationDotButton
                  key={index}
                  $isActive={index === selectedIndex}
                  onClick={() => scrollTo(index)}
                  role="button"
                  aria-label={`Go to slide ${index + 1}`} // Accessibility
                />
              ))}
            </PaginationContainer>
          </>
        )}
        {/* --- End Pagination Rendering --- */}
      </Inner>
    </ContentColumnWrapper>
  );
};

export default ContentColumn;
