import Column from "../layout/Column";
import Row from "../layout/Row";

export default function CommentCardSkeleton() {
  return (
    <Row className="px-6 py-4 w-full">
      {/* img icon */}
      <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" style={{ boxSizing: "border-box" }} />
      <div className="w-4" />
      <Column className="gap-2 flex-1">
        <span className="h-4 w-16 animate-pulse bg-gray-300" />
        <ul className="space-y-3 w-full">
          <li className="h-5 w-full bg-gray-300 animate-pulse" />
          <li className="h-5 w-3/4 bg-gray-300 animate-pulse" />
        </ul>
        <span className="w-1/6 h-4 bg-gray-300 animate-pulse" />
      </Column>
    </Row>
  );
}
