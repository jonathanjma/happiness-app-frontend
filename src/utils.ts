import { useEffect, useState } from "react";

// Formats a given date object in the format yyyy-mm-dd format
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
