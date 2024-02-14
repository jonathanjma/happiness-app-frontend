import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { UserGroups } from "../../data/models/User";
import GroupCard from "./GroupCard";

export default function UserGroups() {
  const navigate = useNavigate();
  const { api } = useApi();

  const { isLoading, data, isError } = useQuery<UserGroups>(
    [QueryKeys.FETCH_USER_GROUPS],
    () => api.get<UserGroups>("/group/user").then((res) => res.data),
  );
  return (
    <div className="my-16 me-6 ms-10">
      {/* Header */}
      <Row className="mb-8 w-full justify-between">
        <h2 className="self-center font-semibold">Your Groups</h2>
        <Row className="gap-4">
          <Button
            label="New Group"
            variation="FILLED"
            onClick={() => navigate("/groups/create")}
          />
          <Button
            label="Invites (0)"
            onClick={() => {
              navigate("/groups/invites");
            }}
          />
        </Row>
      </Row>
      {/* Group cards */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isError ? (
            <p className="text-gray-400">Error: Could not load groups.</p>
          ) : (
            <>
              {data!.groups.length === 0 ? (
                <p className="text-gray-400">
                  You are not a member of any groups.
                </p>
              ) : (
                <div className="grid w-full grid-cols-2 gap-6">
                  {data!.groups
                    .sort((a, b) => a.id - b.id)
                    .map((group) => (
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
