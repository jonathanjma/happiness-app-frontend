import { useApi } from "../../contexts/ApiProvider";
import { useQuery } from "react-query";
import { UserGroups } from "../../data/models/User";
import Spinner from "../../components/Spinner";
import GroupCard from "./GroupCard";
import Button from "../../components/Button";
import Row from "../../components/layout/Row";

export default function UserGroups() {
  const { api } = useApi();
  const { isLoading, data, isError } = useQuery<UserGroups>("user_groups", () =>
    api.get<UserGroups>("/user/groups").then((res) => res.data),
  );

  return (
    <div className="my-16 me-6 ms-10">
      {/* Header */}
      <Row className="mb-8 w-full justify-between">
        <h2 className="self-center font-semibold">Your Groups</h2>
        <Button label="New Group" variation="FILLED" />
      </Row>
      {/* Group cards */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isError ? (
            <p className="m-3">Error: Could not load groups.</p>
          ) : (
            <>
              {data!.groups.length === 0 ? (
                <p className="m-3">You are not a member of any groups.</p>
              ) : (
                <div className="grid w-full grid-cols-2 gap-6">
                  {data!.groups.map((group) => (
                    <GroupCard key={group.id} groupData={group} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
