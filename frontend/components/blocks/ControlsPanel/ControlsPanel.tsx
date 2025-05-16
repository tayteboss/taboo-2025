import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import PlayTrigger from "../../elements/PlayTrigger";
import MuteTrigger from "../../elements/MuteTrigger";
import SeekBar from "../../elements/SeekBar";
import TimeDisplay from "../../elements/TimeDisplay";

const ControlsPanelWrapper = styled.div`
  max-width: 50%;
  height: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${pxToRem(10)};
`;

const LHS = styled.div``;

const RHS = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(16)};
`;

type Props = {
  isMuted: boolean;
  isPlaying: boolean;
  currentTime: number;
  videoLength: number | undefined;
  isMobile: boolean;
  setIsMuted: (isMuted: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  handleSeek: (time: number) => void;
  setIsActive: (isActive: boolean) => void;
};

const ControlsPanel = (props: Props) => {
  const {
    isMuted,
    isPlaying,
    currentTime,
    videoLength,
    isMobile,
    setIsMuted,
    setIsPlaying,
    handleSeek,
  } = props;

  return (
    <ControlsPanelWrapper>
      <SeekBar
        videoLength={videoLength}
        currentTime={currentTime}
        handleSeek={handleSeek}
      />
      <BottomBar>
        <LHS>
          <TimeDisplay currentTime={currentTime} />
        </LHS>
        <RHS>
          <MuteTrigger setIsMuted={setIsMuted} isMuted={isMuted} />
          <PlayTrigger
            setIsPlaying={setIsPlaying}
            isPlaying={isPlaying}
            isMobile={isMobile}
          />
        </RHS>
      </BottomBar>
    </ControlsPanelWrapper>
  );
};

export default ControlsPanel;
