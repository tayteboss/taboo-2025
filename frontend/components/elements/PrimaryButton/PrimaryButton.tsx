import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import HoverTyper from "../HoverTyper";
import { useInView } from "react-intersection-observer";

const PrimaryButtonWrapper = styled.div`
  background: var(--colour-background);
  border-radius: ${pxToRem(12)};
  padding: ${pxToRem(15)} ${pxToRem(20)};
  color: var(--colour-foreground);

  transition:
    background var(--transition-speed-default) var(--transition-ease),
    color var(--transition-speed-default) var(--transition-ease);

  &:hover {
    background: var(--colour-foreground);
    color: var(--colour-background);

    * {
      cursor: pointer;
    }
  }
`;

type Props = {
  children: React.ReactNode;
};

const PrimaryButton = (props: Props) => {
  const { children } = props;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <PrimaryButtonWrapper
      className="color-switch type-mono-small primary-button"
      ref={ref}
    >
      <HoverTyper data={children} inView={inView} />
    </PrimaryButtonWrapper>
  );
};

export default PrimaryButton;
