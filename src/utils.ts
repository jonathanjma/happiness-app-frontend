import { useEffect, useState } from "react";

/**
 * Formats a given date object in the format yyyy-mm-dd format
 * @param date
 * @returns A string of the formatted date
 */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses a date string in the YYYY-MM-dd format while avoiding weird timezone issues.
 * Please use this function whenever trying to parse a date in this format!
 * @param dateString the string to be parsed
 * @returns date object containing the proper time
 */
export function parseYYYYmmddFormat(dateString: string): Date {
  // using the most upvoted solution on stack overflow https://stackoverflow.com/a/31732581
  const values = dateString.split("-");
  return new Date(`${values[1]}-${values[2]}-${values[0]}`);
}

/**
 * Gets the shortened form of a weekday from number, according to design.
 * For example:
 * 0 -> Sun
 * 1 -> Mon
 * ...
 * 6 -> Sat
 * @param n the number to use
 * @returns a string representing the shortened weekday.
 */
export function getWeekdayFromNumber(n: number): string {
  const date = new Date();
  date.setDate(new Date().getDate() - new Date().getDay() + n);
  return date.toLocaleString("en-us", { weekday: "short" });
}

/**
 * Gets a proper JS date object given a date string in the YYYY-MM-DD HH:mm:ss.SSSSS
 * format (this string MUST be in UTC) and converts it to a date object in the
 * user's time zone.
 * @param dateUTC a date string with the YYYY-MM-DD HH:mm:ss.SSSSS format
 * representing a time in UTC
 * @returns A Date object that has the date converted to the user's time zone.
 */
export function getDateObjFromUTCString(dateUTC: string): Date {
  const utcDate = new Date(dateUTC);
  const offset = utcDate.getTimezoneOffset();
  const userOffset = offset * 60 * 1000; // Convert offset to milliseconds
  const userTime = utcDate.getTime() - userOffset;
  return new Date(userTime);
}

// Strips time from Date and shifts the day by the given amount
export function modifyDateDay(date: Date, dayDiff: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + dayDiff,
  );
}

// Convert YYYY-MM-DD date string to Date and strip time
export function dateFromStr(dateStr: string) {
  return new Date(dateStr + "T00:00:00");
}

export function validateHappiness(happiness: number | undefined) {
  return (
    happiness !== undefined &&
    happiness % 0.5 === 0 &&
    happiness >= 0 &&
    happiness <= 10
  );
}

export function formatHappinessNum(happiness: number) {
  return (Math.round(happiness * 2) / 2).toFixed(1);
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

/**
 * A custom hook to detect if the user is online.
 * @returns live boolean variable representing the user's connection state.
 */
export function useOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onlineHanlder = () => {
      setIsOnline(true);
    };
    const offlineHanlder = () => {
      setIsOnline(false);
    };
    window.addEventListener("online", onlineHanlder);
    window.addEventListener("offline", offlineHanlder);

    return () => {
      window.removeEventListener("online", onlineHanlder);
      window.removeEventListener("offline", offlineHanlder);
    };
  });

  return isOnline;
}

export function createSearchQuery(
  text: string,
  start: string,
  end: string,
  startValue: number,
  endValue: number,
): Record<string, string | number> {
  const query: Record<string, any> = {};
  if (text !== "") {
    query.text = text;
  }
  if (!isNaN(new Date(start).getTime())) {
    query.start = formatDate(parseYYYYmmddFormat(start));
  }
  if (!isNaN(new Date(end).getTime())) {
    query.end = formatDate(parseYYYYmmddFormat(end));
  }
  if (query.start && !query.end) {
    query.end = formatDate(new Date());
  }
  if (query.end && !query.start) {
    query.start = "2000-01-01";
  }
  if (startValue !== 0 || endValue !== 10) {
    query.low = startValue;
    query.high = endValue;
  }
  return query;
}

// helper function to get list of dates given a start and end date
export function getDaysArray(start: Date, end: Date) {
  for (
    var a = [], d = new Date(start);
    d <= new Date(end);
    d.setDate(d.getDate() + 1)
  ) {
    a.push(formatDate(new Date(d)));
  }
  return a;
}
/**
 * Maps floats from 0 to 10 to a color string.
 * 0 goes to yellow-50, 0.5 goes to yellow-100, etc. up to 10
 */
export function floatToColor(float: number): string {
  if (float === -1) return `rgba(255,255,255,1)`;
  const rgb: number[] = [246, 226, 174];
  let difference = float - 5;
  if (difference === 0) return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
  if (difference > 0) {
    difference += 10;
  } else {
    difference = 10 - difference * -1;
  }
  const modifiedColor = rgb.map((n) => (difference * n) / 10);

  return `rgba(${modifiedColor[0]},${modifiedColor[1]},${modifiedColor[2]},1)`;
}

/**
 * Gets the user's local timezone offset in the form of + or -, and then a 24-hour time
 * for example: -05:00
 * @returns the desired timezone string
 */
export function getTimeZone(): string {
  const offset = new Date().getTimezoneOffset();
  const o = Math.abs(offset);
  return (
    (offset < 0 ? "+" : "-") +
    ("00" + Math.floor(o / 60)).slice(-2) +
    ":" +
    ("00" + (o % 60)).slice(-2)
  );
}

/**
 * Get default date returns today if the user's local time is past 5am, and returns yesterday otherwise.
 * @returns date object for today or yesterday depending on user's time.
 */
export function getDefaultDate(): Date {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 5) {
    return date;
  } else {
    date.setDate(date.getDate() - 1);
    return date;
  }
}
