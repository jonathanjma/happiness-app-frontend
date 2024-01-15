import Column from "../layout/Column";
import Row from "../layout/Row";

export default function CommentCardSkeleton() {
  return (
    <Row className="w-full px-6 py-4">
      {/* img icon */}
      <div
        className="h-10 w-10 animate-pulse rounded-full bg-gray-300"
        style={{ boxSizing: "border-box" }}
      />
      <div className="w-4" />
      <Column className="flex-1 gap-2">
        <span className="h-4 w-16 animate-pulse bg-gray-300" />
        <ul className="w-full space-y-3">
          <li className="h-5 w-full animate-pulse bg-gray-300" />
          <li className="h-5 w-3/4 animate-pulse bg-gray-300" />
        </ul>
        <span className="h-4 w-1/6 animate-pulse bg-gray-300" />
      </Column>
    </Row>
  );
}
