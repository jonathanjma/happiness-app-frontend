import * as React from "react";
import { Journal } from "../../data/models/Journal";


/* 
// TODO add authorization parameters  
    const res = await api.get<Journal[]>("/journal/", {},
      { headers: { "Password-Key": sessionStorage.getItem(Constants.PASSWORD_KEY) } });
*/
// Infinite scrollable calendar for viewing journal entries 
export default function ScrollableJournalCalendar({
  selectedEntry,
  setSelectedEntry,
}: {
  selectedEntry: Journal | undefined;
  setSelectedEntry: React.Dispatch<React.SetStateAction<Journal | undefined>>;
}) {
  return <></>;
}
