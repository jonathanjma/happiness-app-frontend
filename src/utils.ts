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

interface HasId {
  id: number;
}

/**
 * This function abstracts the updater for when you need to replace one object
 * in the cached data of an infinite query. You pass in the infinite pagination
 * (infinite) and the new object you want to have added to the data or replace
 * the data and then it will update it for you. Updating is done out-of-place.
 * @param {Type} newObj the object to be added to the infinite pagination data
 * @param {InfinitePagintion<Type> | undefined} infinite the infinite pagination data
 * @returns {InfinitePagintion<Type>} the updated infinite pagination, or an
 * empty infinite pagination if the original infinite pagination was undefined.
 */
export function updateOneInfinite<Type extends HasId>(
  newObj: Type,
  infinite?: InfinitePagintion<Type>,
): InfinitePagintion<Type> {
  const newPages = infinite?.pages.map((pagination): Pagination<Type> => {
    if (pagination) {
      const newData = pagination.data.map((item) =>
        item.id === newObj.id ? newObj : item,
      );
      if (
        !newData.find(
          (journalFromPagination) => journalFromPagination.id === newObj.id,
        )
      ) {
        const finalData = [...newData, newObj];
        return { data: finalData, page: pagination.page };
      }
      return { data: newData, page: pagination.page };
    }
    // This only happens when pagination is undefined which should never be the case
    return { data: [], page: -1 };
  });
  return { pages: newPages ?? [], pageParams: infinite?.pageParams ?? [] };
}

/**
 * A simple function that updates an data to include a new object, either by
 * replacing an object with an existing id or adding to the new data. Data is
 * updated out-of-place.
 * @param newObj the new object to add to the data
 * @param data the data to be updated
 * @returns the updated data
 */
export function updateOneFinite<Type extends HasId>(
  newObj: Type,
  data?: Type[],
): Type[] {
  const newData = data?.map((oldData) =>
    oldData.id === newObj.id ? newObj : oldData,
  );
  if (newData && !newData.find((value) => value.id === newObj.id)) {
    newData.push(newObj);
  }
  return newData ?? [];
}

/**
 * Serves the same purpose as updateOneInfinite, but removes an object from the
 * infinite pagination
 * @param deletionId id of the oject to be deleted
 * @param infinite infinite pagination to delete the object from.
 * @returns
 */
export function deleteOneInfinite<Type extends HasId>(
  deletionId: number,
  infinite?: InfinitePagintion<Type>,
): InfinitePagintion<Type> {
  const newPages = infinite?.pages.map((pagination): Pagination<Type> => {
    if (pagination) {
      const newData = pagination.data.filter((item) => item.id !== deletionId);
      return { data: newData, page: pagination.page };
    }
    // This only happens when pagination is undefined which should never be the case
    return { data: [], page: -1 };
  });
  return { pages: newPages ?? [], pageParams: infinite?.pageParams ?? [] };
}

/**
 * Serves the same purpose as update one finite, but for deletion.
 * @param deletionId id of the item to be deleted
 * @param finite an array of objects from which to delete the item.
 * @returns
 */
export function deleteOneFinite<Type extends HasId>(
  deletionId: number,
  finite?: Type[],
): Type[] {
  return finite?.filter((item) => item.id !== deletionId) ?? [];
}
