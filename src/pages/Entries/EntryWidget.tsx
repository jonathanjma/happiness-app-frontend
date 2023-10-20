import { Happiness } from "../../data/models/Happiness";

export default function EntryWidget({ entryData }: { entryData: Happiness }) {
  return (
    <div
      className={
        "flex flex-col w-full items-stretch bg-white rounded-2xl mt-8 mb-4 mx-8 shadow-heavy"
      }
    >
      <p>{entryData.value}</p>
      <p>{entryData.comment}</p>
    </div>
  );
}
