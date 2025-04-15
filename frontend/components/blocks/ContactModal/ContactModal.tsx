import styled from "styled-components";

const ContactModalWrapper = styled.div``;

type Props = {
  data: any;
};

const ContactModal = (props: Props) => {
  const { data } = props;
  return <ContactModalWrapper>ContactModal</ContactModalWrapper>;
};

export default ContactModal;
