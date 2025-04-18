import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import pxToRem from "../../../utils/pxToRem";
import FooterContactCard from "../../elements/FooterContactCard";
import FooterWidget from "../../elements/FooterWidget";
import { SiteSettingsType } from "../../../shared/types/types";
import SocialCard from "../../elements/SocialCard";
import LayoutGrid from "../../layout/LayoutGrid";
import MediaCursor from "../../blocks/MediaCursor";

const FooterWrapper = styled.footer`
  margin-bottom: ${pxToRem(20)};
  overflow: hidden;

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

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: 100%;
  }
`;

const Title = styled.p`
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  line-height: normal;
  text-transform: uppercase;
  color: var(--colour-background);
`;

const MiddleBar = styled.div`
  padding: ${pxToRem(240)} 0;
  width: 100%;
  position: relative;
  z-index: 2;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(100)} 0;
  }
`;

const BottomBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 2;
`;

const BackToTop = styled.button`
  flex: 1;
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  text-transform: uppercase;
  padding: ${pxToRem(4)} ${pxToRem(6)} ${pxToRem(3)};
  background: transparent;
  color: var(--colour-background);
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

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding-top: ${pxToRem(32)};
    justify-content: center;
  }
`;

type Props = {
  siteSettings: SiteSettingsType;
};

const Footer = (props: Props) => {
  const {
    siteSettings: {
      socialLinks,
      contactEmail,
      contactPhone,
      address,
      addressUrl,
      footerMedia,
    },
  } = props;

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <FooterWrapper>
      <LayoutWrapper>
        <DesktopInner>
          <MediaCursor data={footerMedia} />
          <TopBar>
            <Title className="color-switch">Get in touch</Title>
          </TopBar>
          <MiddleBar>
            <LayoutGrid>
              <FooterContactCard
                title="Visit"
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
            {socialLinks && socialLinks?.length > 0 && (
              <SocialDetails>
                {socialLinks.map((social, i) => (
                  <SocialCard data={social} key={i} />
                ))}
              </SocialDetails>
            )}
            <BackToTop onClick={() => handleScrollToTop()}>
              Back to top (↑)
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
              title="Say hey"
              email={contactEmail}
              phone={contactPhone}
            />
          </MiddleBar>
          <BottomBar>
            {socialLinks && socialLinks?.length > 0 && (
              <SocialDetails>
                {socialLinks.map((social, i) => (
                  <SocialCard data={social} key={i} />
                ))}
              </SocialDetails>
            )}
          </BottomBar>
        </MobileInner>
      </LayoutWrapper>
    </FooterWrapper>
  );
};

export default Footer;
