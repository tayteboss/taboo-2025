import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { SiteSettingsType } from "../../../shared/types/types";
import Link from "next/link";
import PeopleCard from "../../elements/PeopleCard";
import formatHTML from "../../../utils/formatHTML";
import SocialCard from "../../elements/SocialCard";
import CrossIcon from "../../svgs/CrossIcon";

const ContactModalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--colour-foreground-alpha);
  backdrop-filter: blur(5px);
`;

const Card = styled(motion.div)`
  width: ${pxToRem(478)};
  background: var(--colour-foreground);
  border-radius: 10px;
  padding: 20px;
  z-index: 2;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${pxToRem(100)};
`;

const Title = styled.p`
  font-size: ${pxToRem(18)};
  color: var(--colour-background);
`;

const CloseTrigger = styled.button`
  background: var(--colour-background);
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${pxToRem(24)};
  width: ${pxToRem(24)};
  border-radius: ${pxToRem(6)};

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }
`;

const ContactDetails = styled.div`
  padding-bottom: ${pxToRem(20)};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const ContactDetail = styled.div`
  font-size: ${pxToRem(40)};
  line-height: ${pxToRem(44)};
  letter-spacing: -1.2px;
  color: var(--colour-background);

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }
`;

const PeopleDetails = styled.div``;

const AddressDetails = styled.div`
  padding: ${pxToRem(20)} 0;
  margin-bottom: ${pxToRem(30)};
`;

const Address = styled.div`
  font-size: ${pxToRem(40)};
  line-height: ${pxToRem(44)};
  letter-spacing: -1.2px;
  color: var(--colour-background);

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }
`;

const SocialDetails = styled.div`
  display: flex;
  gap: ${pxToRem(10)};
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "beforeChildren",
    },
  },
};

const cardVariants = {
  hidden: {
    y: "100vh",
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 80,
      damping: 13,
    },
  },
  visible: {
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 80,
      damping: 13,
    },
  },
  exit: {
    y: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 80,
      damping: 13,
    },
  },
};

type Props = {
  isActive: boolean;
  siteSettings: SiteSettingsType;
  setIsActive: (isActive: boolean) => void;
};

const ContactModal = (props: Props) => {
  const { isActive, siteSettings, setIsActive } = props;

  const hasPersonalContacts = siteSettings?.personalContacts?.length > 0;
  const hasSocialLinks = siteSettings?.socialLinks?.length > 0;

  return (
    <AnimatePresence>
      {isActive && (
        <ContactModalWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            data-lenis-prevent
          >
            <TitleWrapper>
              <Title>Contact</Title>
              <CloseTrigger onClick={() => setIsActive(false)}>
                <CrossIcon />
              </CloseTrigger>
            </TitleWrapper>
            <ContactDetails>
              <Link href={`mailto:${siteSettings.contactEmail}`}>
                <ContactDetail>{siteSettings.contactEmail}</ContactDetail>
              </Link>
              <Link href={`tel:${siteSettings.contactPhone}`}>
                <ContactDetail>{siteSettings.contactPhone}</ContactDetail>
              </Link>
            </ContactDetails>
            {hasPersonalContacts && (
              <PeopleDetails>
                {siteSettings.personalContacts.map((contact, i) => (
                  <PeopleCard data={contact} key={i} />
                ))}
              </PeopleDetails>
            )}
            {siteSettings?.addressUrl && siteSettings?.address && (
              <AddressDetails>
                <Link href={siteSettings.addressUrl}>
                  <Address
                    dangerouslySetInnerHTML={{
                      __html: formatHTML(siteSettings.address),
                    }}
                  />
                </Link>
              </AddressDetails>
            )}
            {hasSocialLinks && (
              <SocialDetails>
                {siteSettings.socialLinks.map((social, i) => (
                  <SocialCard data={social} key={i} />
                ))}
              </SocialDetails>
            )}
          </Card>
        </ContactModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
