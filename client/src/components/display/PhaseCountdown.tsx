import { useEffect, useState, memo } from "react";
import { getCountdownToNextPhase } from "../../utils/clockPhases";

type PhaseCountdownProps = {
  phaseText: string;
};

const computeVirtualHours = (): number => {
  const now = new Date();
  const startOfHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours()
  );
  const millisecondsPassed = now.getTime() - startOfHour.getTime();
  const virtualHours = (millisecondsPassed / 3600000) * 24;
  return virtualHours;
};

const PhaseCountdownBase = ({ phaseText }: PhaseCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const vh = computeVirtualHours();
      const countdown = getCountdownToNextPhase(vh, phaseText);
      setTimeLeft(countdown);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [phaseText]);

  return (
    <div className="badge bg-warning text-dark fs-6">
      {timeLeft.hours.toString().padStart(2, "0")}:
      {timeLeft.minutes.toString().padStart(2, "0")}
    </div>
  );
};

const PhaseCountdown = memo(PhaseCountdownBase);
export default PhaseCountdown;
