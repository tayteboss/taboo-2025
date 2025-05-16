import React, { useEffect, useState } from "react";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

const TimeDisplayWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: ${pxToRem(4)};
  /* min-width: 70px; */

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    display: none;
  }

  span {
    font-family: var(--font-pressura-mono);
    font-size: ${pxToRem(11)};
    line-height: 1;
    font-weight: 400;
    text-transform: uppercase;
  }
`;

type Props = {
  currentTime: number;
};

const TimeDisplay = (props: Props) => {
  const { currentTime } = props;
  const [currentTimeFormatted, setCurrentTimeFormated] = useState("00:00");

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const formattedTime = formatTime(Math.floor(currentTime));
    setCurrentTimeFormated(formattedTime);
  }, [currentTime]);

  return (
    <TimeDisplayWrapper>
      <span className="type-small">{currentTimeFormatted}</span>
    </TimeDisplayWrapper>
  );
};

export default TimeDisplay;
