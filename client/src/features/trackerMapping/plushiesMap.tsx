export const convertAnniversaryToOrdinal = (anniversary: string): string => {
  const wordsToNumbers: { [key: string]: string } = {
    first: "1st",
    second: "2nd",
    third: "3rd",
    fourth: "4th",
    fifth: "5th",
    sixth: "6th",
    seventh: "7th",
    eighth: "8th",
    ninth: "9th",
    tenth: "10th",
  };
  const lowerCaseAnniversary = anniversary.toLowerCase();
  if (wordsToNumbers[lowerCaseAnniversary]) {
    return wordsToNumbers[lowerCaseAnniversary];
  }
  return anniversary;
};
