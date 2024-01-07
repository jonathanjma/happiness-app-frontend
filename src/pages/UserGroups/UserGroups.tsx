import { useApi } from "../../contexts/ApiProvider";
import { useQuery } from "react-query";
import { UserGroups } from "../../data/models/User";
import Spinner from "../../components/Spinner";
import GroupCard from "./GroupCard";
import Button from "../../components/Button";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useNavigate } from "react-router-dom";

export default function UserGroups() {
  const navigate = useNavigate();
  const { api } = useApi();
  const { isLoading, data, isError } = useQuery<UserGroups>(
    QueryKeys.FETCH_USER_GROUPS,
    () => api.get<UserGroups>("/group/user").then((res) => res.data),
  );

  return (
    <div className="my-16 me-6 ms-10">
      {/* Header */}
      <Row className="mb-8 w-full justify-between">
        <h2 className="self-center font-semibold">Your Groups</h2>
        <Button
          label="New Group"
          variation="FILLED"
          onClick={() => navigate("/groups/create")}
        />
      </Row>
      {/* Group cards */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isError ? (
            <h5 className="m-3">Error: Could not load groups.</h5>
          ) : (
            <>
              {data!.groups.length === 0 ? (
                <h5 className="m-3">You are not a member of any groups.</h5>
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
