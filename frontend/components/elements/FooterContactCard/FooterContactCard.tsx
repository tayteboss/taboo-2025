import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import formatHTML from "../../../utils/formatHTML";
import HoverTyper from "../HoverTyper";

const FooterContactCardWrapper = styled.div`
  grid-column: span 4;
  text-align: center;

  a {
    transition: all var(--transition-speed-default) var(--transition-ease);

    &:hover {
      opacity: 0.75;
    }
  }
`;

const Title = styled.p`
  color: var(--colour-background);
  margin-bottom: ${pxToRem(20)};
  text-align: center;
`;

const Address = styled.div`
  text-align: center;

  * {
    text-align: center;
    color: var(--colour-background);

    transition: color var(--transition-speed-default) var(--transition-ease);
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  * {
    color: var(--colour-background);
    cursor: pointer;
  }
`;

type Props = {
  title: string;
  address?: string;
  addressUrl?: string;
  email?: string;
  phone?: string;
  socialLinks?: { title: string; link: string }[];
};

const FooterContactCard = (props: Props) => {
  const { title, address, addressUrl, email, phone, socialLinks } = props;
  return (
    <FooterContactCardWrapper>
      <Title className="type-mono-small color-switch">{title}</Title>
      {address && addressUrl && (
        <Link href={addressUrl} target="_blank">
          <Address
            className="type-h4 color-switch"
            dangerouslySetInnerHTML={{ __html: formatHTML(address) }}
          />
        </Link>
      )}
      {email && phone && (
        <LinksWrapper>
          <Link href={`mailto:${email}`} className="type-h4 color-switch">
            <HoverTyper data={email} inView={true} />
          </Link>
          <Link href={`tel:${phone}`} className="type-h4 color-switch">
            <HoverTyper data={phone} inView={true} />
          </Link>
        </LinksWrapper>
      )}
      {socialLinks && socialLinks?.length > 0 && (
        <LinksWrapper>
          {socialLinks.map((social, i) => (
            <Link
              key={i}
              href={social.link}
              target="_blank"
              className="type-h4 color-switch"
            >
              <HoverTyper data={social.title} inView={true} />
            </Link>
          ))}
        </LinksWrapper>
      )}
    </FooterContactCardWrapper>
  );
};

export default FooterContactCard;
