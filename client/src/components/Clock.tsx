import { useState, useEffect } from "react";
import { getCurrentPhase } from "../utils/clockPhases";

const Clock = ({ setBgColor }: { setBgColor: (text: string) => void }) => {
  const [virtualTime, setVirtualTime] = useState(0);
  const [curPhase, setcurPhase] = useState("");
  useEffect(() => {
    setBgColor(curPhase);
  }, [curPhase]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startOfHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours()
      );
      const millisecondsPassed = now.getTime() - startOfHour.getTime();
      const virtualHours = ((millisecondsPassed - 1000) / 3600000) * 24;
      setVirtualTime(virtualHours);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const phase = getCurrentPhase(virtualTime);
  if (phase.text !== curPhase) {
    setcurPhase(phase.text);
  }
  const virtualMinutes = Math.floor((virtualTime % 1) * 60);

  return (
    <div className="">
      <div className="fs-4">
        {phase.bIcon ? (
          <i className={`mx-1 bi ${phase.bIcon}`}></i>
        ) : (
          phase.icon
        )}
        {Math.floor(virtualTime).toString().padStart(2, "0")}:
        {virtualMinutes.toString().padStart(2, "0")}
      </div>
      <div className="fs-6 text-center">{phase.text}</div>
    </div>
  );
};

export default Clock;
