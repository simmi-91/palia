import { useState, useEffect } from "react";

const getPhase = (hours: number) => {
  if (hours >= 3 && hours < 6) {
    return { text: "Dawn", icon: "☀️" };
  } else if (hours >= 6 && hours < 18) {
    return { text: "Day", icon: "🌞" };
  } else if (hours >= 18 && hours < 21) {
    return { text: "Dusk", icon: "🌇" };
  } else {
    return { text: "Night", icon: "🌙" };
  }
};

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

  const phase = getPhase(virtualTime);
  if (phase.text !== curPhase) {
    setcurPhase(phase.text);
  }
  const virtualMinutes = Math.floor((virtualTime % 1) * 60);

  return (
    <div className="">
      <div className="fs-4">
        {phase.icon} {Math.floor(virtualTime).toString().padStart(2, "0")}:
        {virtualMinutes.toString().padStart(2, "0")}
      </div>
      <div className="fs-6 text-center">{phase.text}</div>
    </div>
  );
};

export default Clock;
