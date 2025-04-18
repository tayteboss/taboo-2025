import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { useMediaQuery } from "react-responsive";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";

const ClientLogosSectionWrapper = styled.section`
  mix-blend-mode: difference;
  margin-bottom: ${pxToRem(200)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(100)};
  }
`;

const Embla = styled.div`
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Container = styled.div``;

const Slide = styled.div`
  margin-right: ${pxToRem(100)};
  flex: 0 0 ${pxToRem(160)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    flex: 0 0 ${pxToRem(80)};
    margin-right: ${pxToRem(20)};
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: ${pxToRem(80)};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    height: ${pxToRem(40)};
  }
`;

type Props = {
  data: InformationPageType["featuredClientLogosSection"];
};

const ClientLogosSection = (props: Props) => {
  const { data } = props;

  const hasData = data?.logos && data.logos?.length > 0;

  // const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, skipSnaps: true, dragFreeze: true } as EmblaOptionsType,
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <ClientLogosSectionWrapper>
      <Embla className="embla" ref={emblaRef}>
        <Container className="embla__container">
          {hasData &&
            [...data.logos, ...data.logos].map((item, i) => (
              <Slide className={`embla__slide`} key={i}>
                {item?.link ? (
                  <Link href={item?.link} target="_blank">
                    <ImageWrapper>
                      <Image
                        src={item?.image?.asset?.url}
                        alt={item?.title || ""}
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                        sizes={"10vw"}
                      />
                    </ImageWrapper>
                  </Link>
                ) : (
                  <ImageWrapper>
                    <Image
                      src={item?.image?.asset?.url}
                      alt={item?.title || ""}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                      sizes={"10vw"}
                    />
                  </ImageWrapper>
                )}
              </Slide>
            ))}
        </Container>
      </Embla>
    </ClientLogosSectionWrapper>
  );
};

export default ClientLogosSection;
