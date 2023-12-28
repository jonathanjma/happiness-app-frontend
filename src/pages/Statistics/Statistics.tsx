import Column from "../../components/layout/Column";
import SearchBar from "./SearchBar";

export default function Statistics() {
  return (
    <Column className="w-full h-full items-stretch px-8 py-24 gap-8">
      <h1>Statistics</h1>
      <SearchBar />
    </Column>
  );
}
