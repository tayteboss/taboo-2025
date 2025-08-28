import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import pxToRem from "../../../utils/pxToRem";
import FooterContactCard from "../../elements/FooterContactCard";
import FooterWidget from "../../elements/FooterWidget";
import { SiteSettingsType } from "../../../shared/types/types";
import SocialCard from "../../elements/SocialCard";
import LayoutGrid from "../../layout/LayoutGrid";
import MediaCursor from "../../blocks/MediaCursor";
import CreditCard from "../../elements/CreditCard";

const FooterWrapper = styled.footer<{ $isActive: boolean }>`
  margin-bottom: ${pxToRem(20)};
  overflow: hidden;
  display: ${(props) => (props.$isActive ? "block" : "none")};

  transition: all var(--transition-speed-default) var(--transition-ease);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(55)};
  }
`;

const DesktopInner = styled.div`
  background: var(--colour-foreground);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: ${pxToRem(20)};
  border-radius: 10px;
  position: relative;
  z-index: 2;
  overflow: hidden;

  transition: all var(--transition-speed-default) var(--transition-ease);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const MobileInner = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    background: var(--colour-foreground);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: ${pxToRem(16)};
    border-radius: 10px;
    position: relative;
    z-index: 2;

    transition: all var(--transition-speed-default) var(--transition-ease);
  }
`;

const TopBar = styled.div`
  position: relative;
  z-index: 2;
  mix-blend-mode: difference;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: 100%;
  }
`;

const Title = styled.p`
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  line-height: normal;
  text-transform: uppercase;
  color: var(--colour-white);
`;

const MiddleBar = styled.div`
  padding: ${pxToRem(240)} 0;
  width: 100%;
  position: relative;
  z-index: 2;
  mix-blend-mode: difference;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(64)} 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${pxToRem(64)};
  }
`;

const BottomBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 2;
  mix-blend-mode: difference;

  .social-card {
    background: transparent;
    color: var(--colour-white);

    &:hover {
      background: var(--colour-background) !important;
      color: var(--colour-foreground) !important;
    }
  }
`;

const BackToTop = styled.button`
  flex: 1;
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  text-transform: uppercase;
  padding: ${pxToRem(4)} ${pxToRem(6)} ${pxToRem(3)};
  background: transparent;
  color: var(--colour-white);
  border-radius: ${pxToRem(6)};

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    background: var(--colour-background);
    color: var(--colour-foreground);
  }
`;

const SocialDetails = styled.div`
  display: flex;
  gap: ${pxToRem(10)};
  padding-top: ${pxToRem(50)};
  flex: 1;
`;

const CreditDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(6)};
  padding-top: ${pxToRem(50)};
  flex: 1;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    justify-content: center;
  }
`;

const CreditDetailsInner = styled.div`
  display: flex;
  gap: ${pxToRem(4)};
`;

type Props = {
  isActive: boolean;
  siteSettings: SiteSettingsType;
};

const Footer = (props: Props) => {
  const {
    isActive,
    siteSettings: {
      socialLinks,
      contactEmail,
      contactPhone,
      address,
      addressUrl,
      footerMedia,
      backToTopButtonTitle,
    },
  } = props;

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const creditList = [
    {
      title: "Bien Studio",
      link: "https://www.bienstudio.com.au/",
    },
    {
      title: "Tayte.co",
      link: "https://tayte.co/",
    },
  ];

  return (
    <FooterWrapper $isActive={isActive}>
      <LayoutWrapper>
        <DesktopInner>
          <MediaCursor data={footerMedia} />
          <TopBar>
            <Title className="color-switch">Get in touch</Title>
          </TopBar>
          <MiddleBar>
            <LayoutGrid>
              <FooterContactCard
                title="Pop in"
                address={address}
                addressUrl={addressUrl}
              />
              <FooterContactCard
                title="Say hey"
                email={contactEmail}
                phone={contactPhone}
              />
              <FooterContactCard title="Follow" socialLinks={socialLinks} />
            </LayoutGrid>
          </MiddleBar>
          <BottomBar>
            {creditList && creditList?.length > 0 && (
              <CreditDetails>
                <Title>Site by:</Title>
                <CreditDetailsInner>
                  {creditList.map((credit, i) => (
                    <CreditCard data={credit} key={i} />
                  ))}
                </CreditDetailsInner>
              </CreditDetails>
            )}
            <BackToTop
              onClick={() => handleScrollToTop()}
              role="button"
              aria-label="Back to top"
            >
              {backToTopButtonTitle ? backToTopButtonTitle : "Back to top"} (↑)
            </BackToTop>
            <FooterWidget />
          </BottomBar>
        </DesktopInner>
        <MobileInner>
          <TopBar>
            <FooterWidget />
          </TopBar>
          <MiddleBar>
            <FooterContactCard
              title="Pop in"
              address={address}
              addressUrl={addressUrl}
            />
            <FooterContactCard
              title="Say hey"
              email={contactEmail}
              phone={contactPhone}
            />
            <FooterContactCard title="Follow" socialLinks={socialLinks} />
          </MiddleBar>
          <BottomBar>
            {creditList && creditList?.length > 0 && (
              <CreditDetails>
                <Title>Site by:</Title>
                <CreditDetailsInner>
                  {creditList.map((credit, i) => (
                    <CreditCard data={credit} key={i} />
                  ))}
                </CreditDetailsInner>
              </CreditDetails>
            )}
          </BottomBar>
        </MobileInner>
      </LayoutWrapper>
    </FooterWrapper>
  );
};

export default Footer;
