import Column from "../../components/layout/Column";
import SearchBar from "./SearchBar";

export default function Statistics() {
  return (
    <Column className="w-3/4 items-stretch gap-8 px-8 py-24">
      <h1>Statistics</h1>
      <SearchBar />
    </Column>
  );
}
