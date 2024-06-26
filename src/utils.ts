import dayjs from "dayjs";
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
    query.start = formatDate(dateFromStr(start));
  }
  if (!isNaN(new Date(end).getTime())) {
    query.end = formatDate(dateFromStr(end));
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
  switch (float) {
    case -1:
      return `rgba(234, 235, 234,1)`;
    case 0:
      return `rgba(239, 69, 56,1)`;
    case 0.5:
      return `rgba(241, 95, 84,1)`;
    case 1:
      return `rgba(246, 118, 108,1)`;
    case 1.5:
      return `rgba(245, 136, 128,1)`;
    case 2:
      return `rgba(247, 154, 148,1)`;
    case 2.5:
      return `rgba(249, 169, 163,1)`;
    case 3:
      return `rgba(249, 202, 198,1)`;
    case 3.5:
      return `rgba(250, 209, 206,1)`;
    case 4:
      return `rgba(252, 231, 229,1)`;
    case 4.5:
      return `rgba(251, 238, 237,1)`;
    case 5:
      return `rgba(255,255,255,1)`;
    case 5.5:
      return `rgba(240, 248, 240,1)`;
    case 6:
      return `rgba(222, 239, 223,1)`;
    case 6.5:
      return `rgba(203, 231, 204,1)`;
    case 7:
      return `rgba(181, 221, 183,1)`;
    case 7.5:
      return `rgba(160, 211, 162,1)`;
    case 8:
      return `rgba(138, 201, 141,1)`;
    case 8.5:
      return `rgba(112, 190, 115,1)`;
    case 9:
      return `rgba(94, 181, 97,1)`;
    case 9.5:
      return `rgba(76, 173, 80,1)`;
    case 10:
      return `rgba(64, 148, 68,1)`;
    default:
      return "rgba(234, 235, 234,1)";
  }
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

export function get24HourTimeAsUTC(time: string): string {
  // attempt to convert to UTC
  const date = new Date();
  const [hours, minutes] = time.split(":");
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  // Get the UTC hours and minutes
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  return `${utcHours.toString().padStart(2, "0")}:${utcMinutes
    .toString()
    .padStart(2, "0")}`;
}

/**
 * @param timeStr A UTC time in the form of HH:mm
 * @returns The time as a local time in the HH:mm form
 */
export function convertToLocalTime(timeStr: string): string {
  const date = new Date();
  const [hours, minutes] = timeStr.split(":").map(Number);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setMinutes(date.getMinutes() + dayjs().utcOffset());

  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
