
export const CLOCK_PHASES = [
  { name: "Morning", startLabel: "3:00 AM", endLabel: "6:00 AM" },
  { name: "Day",     startLabel: "6:00 AM", endLabel: "6:00 PM" },
  { name: "Evening", startLabel: "6:00 PM", endLabel: "9:00 PM" },
  { name: "Night",   startLabel: "9:00 PM", endLabel: "3:00 AM" },
] as const;

export const clockColorMap: Record<string, { bg: string; text?: string }> = {
  Morning: { bg: "#d5b58f", text: "black" },
  Day: { bg: "#83b4e7", text: "black" },
  Evening: { bg: "#dda4aa", text: "black" },
  Night: { bg: "#535c84", text: "white" },
};

export const getCurrentPhase = (hours: number) => {
  if (hours >= 3 && hours < 6) {
    return { text: "Morning", icon: "☀️", bIcon: "bi-sunrise" };
  } else if (hours >= 6 && hours < 18) {
    return { text: "Day", icon: "🌞", bIcon: "bi-brightness-high-fill" };
  } else if (hours >= 18 && hours < 21) {
    return { text: "Evening", icon: "🌇", bIcon: "bi-sunset" };
  } else {
    return { text: "Night", icon: "🌙", bIcon: "bi-moon-stars-fill" };
  }
};

export const getNextPhase = (currentPhase: string) => {
  switch (currentPhase) {
    case "Morning":
      return "Day";
    case "Day":
      return "Evening";
    case "Evening":
      return "Night";
    case "Night":
      return "Morning";
    default:
      return "Day";
  }
};

export const getLaterPhases = (currentPhase: string, nextPhase: string) => {
  const allPhases = ["Morning", "Day", "Evening", "Night"];
  return allPhases.filter(
    (phase) => phase !== currentPhase && phase !== nextPhase
  );
};

export const getPhaseEndTime = (currentPhase: string) => {
  switch (currentPhase) {
    case "Morning":
      return 6;
    case "Day":
      return 18;
    case "Evening":
      return 21;
    case "Night":
      return 3;
    default:
      return 6;
  }
};

export const getCountdownToNextPhase = (
  currentHours: number,
  currentPhase: string
) => {
  const endHour = getPhaseEndTime(currentPhase);

  let hoursUntilEnd: number;
  if (currentPhase === "Night") {
    if (currentHours >= 21) {
      hoursUntilEnd = 24 - currentHours + endHour;
    } else {
      hoursUntilEnd = endHour - currentHours;
    }
  } else {
    hoursUntilEnd = endHour - currentHours;
  }

  const totalMinutes = hoursUntilEnd * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((hoursUntilEnd * 3600) % 60);

  return {
    hours,
    minutes,
    seconds,
    totalSeconds: Math.floor(hoursUntilEnd * 3600),
  };
};

export const parseTimePhases = (time: string): string[] => {
  if (time.trim() === "Any Time") return CLOCK_PHASES.map((p) => p.name);
  if (!time) return [];
  return CLOCK_PHASES.filter((p) => time.includes(p.name)).map((p) => p.name);
};

export const buildTimeString = (selected: string[]): string => {
  const ordered = CLOCK_PHASES.filter((p) => selected.includes(p.name));
  if (ordered.length === 0) return "";
  if (ordered.length === CLOCK_PHASES.length) return "Any Time";
  const runs: (typeof CLOCK_PHASES[number])[][] = [];
  let current = [ordered[0]];
  for (let i = 1; i < ordered.length; i++) {
    const prevIdx = CLOCK_PHASES.findIndex((p) => p.name === ordered[i - 1].name);
    const currIdx = CLOCK_PHASES.findIndex((p) => p.name === ordered[i].name);
    if (currIdx === prevIdx + 1) {
      current.push(ordered[i]);
    } else {
      runs.push(current);
      current = [ordered[i]];
    }
  }
  runs.push(current);
  return runs
    .map((run) => {
      const names = run.length <= 2
        ? run.map((p) => p.name).join(" and ")
        : run.slice(0, -1).map((p) => p.name).join(", ") + " and " + run[run.length - 1].name;
      return `${names} (${run[0].startLabel} - ${run[run.length - 1].endLabel})`;
    })
    .join(" and ");
};
