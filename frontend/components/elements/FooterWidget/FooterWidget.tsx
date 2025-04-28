import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import pxToRem from "../../../utils/pxToRem";
import DarkModeToggle from "../DarkModeToggle";

const FooterWidgetWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    justify-content: space-between;
  }
`;

const LeftSide = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const BlinkingCircle = styled.span<{ $isVisible: boolean; $colour: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: ${(props) => props.$colour};
  border-radius: 50%;
  margin-right: ${pxToRem(4)};
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.1s ease-in-out;
`;

const TimeText = styled.span`
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  text-transform: uppercase;
  padding: ${pxToRem(4)} ${pxToRem(6)} ${pxToRem(3)};
  color: var(--colour-white);
  margin-right: ${pxToRem(16)};

  span {
    font-family: var(--font-pressura-mono);
    font-size: ${pxToRem(11)};
    text-transform: uppercase;
  }
`;

const FooterWidget = () => {
  const [colour, setColour] = useState("#6be07e");

  const [currentTime, setCurrentTime] = useState(
    moment().tz("Australia/Melbourne")
  );
  const [isBlinkVisible, setIsBlinkVisible] = useState(true);

  useEffect(() => {
    // Set up the interval to update time every second
    const intervalId = setInterval(() => {
      const now = moment().tz("Australia/Melbourne");
      setCurrentTime(now);
      // Determine blink visibility based on whether the second is even or odd
      setIsBlinkVisible(now.seconds() % 2 === 0);

      // Check if current time is on the weekend or outside of 9am to 5pm
      const isWeekend = now.day() === 0 || now.day() === 6;
      const isOutsideBusinessHours = now.hour() < 9 || now.hour() > 17;

      if (isWeekend || isOutsideBusinessHours) {
        setColour("#ff0000");
      } else {
        setColour("#6be07e");
      }
    }, 1000); // Update every 1000 milliseconds (1 second)

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Format the time string parts
  const formattedPrefix = "MELB";
  const formattedDate = currentTime.format("ddd D MMM YYYY").toUpperCase(); // e.g., TUES 1 APR 2025
  const formattedHour = currentTime.format("h"); // e.g., 11
  const formattedMinute = currentTime.format("mm"); // e.g., 49
  const formattedAmPm = currentTime.format("A"); // e.g., AM

  return (
    <FooterWidgetWrapper>
      <LeftSide>
        <BlinkingCircle $isVisible={isBlinkVisible} $colour={colour} />

        <TimeText className="color-switch">
          {`${formattedPrefix} ${formattedDate} ${formattedHour}`}
          <span>:</span>
          {`${formattedMinute} ${formattedAmPm}`}
        </TimeText>
      </LeftSide>

      <DarkModeToggle />
    </FooterWidgetWrapper>
  );
};

export default FooterWidget;
