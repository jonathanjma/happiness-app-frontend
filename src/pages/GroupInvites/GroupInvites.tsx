import { useMutation, useQuery, useQueryClient } from "react-query";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import Column from "../../components/layout/Column";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { AllGroups } from "../../data/models/Group";
import GroupCard from "../UserGroups/GroupCard";

export default function GroupInvites() {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const { data: allInvites } = useQuery({
    queryKey: [QueryKeys.FETCH_USER_GROUPS],
    queryFn: () => api.get<AllGroups>("/group/user").then((res) => res.data),
  });
  const { mutate: acceptInvite, isLoading: acceptIsLoading } = useMutation({
    mutationFn: (groupId: number) =>
      api.post(`/group/accept_invite/${groupId}`, {}),
    onSuccess: () => {
      console.log(`succcess`);
      queryClient.invalidateQueries([QueryKeys.FETCH_USER_GROUPS]);
    },
    onError: () => {
      console.log(`first`);
    },
  });
  const { mutate: rejectInvite, isLoading: rejectInviteIsLoading } =
    useMutation({
      mutationFn: (groupId: number) =>
        api.post(`/group/reject_invite/${groupId}`, {}),
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.FETCH_USER_GROUPS]);
      },
    });
  return (
    <Column className="my-16 me-6 ms-10 gap-8">
      <BackButton relativeUrl="/groups" text="Back" />
      <h2>Group Invites</h2>
      <div className="grid w-full grid-cols-2 gap-6">
        {allInvites?.group_invites.map((group) => (
          <GroupCard
            groupData={group}
            key={group.id}
            onAccept={() => {
              acceptInvite(group.id);
            }}
            acceptButtonIcon={
              acceptIsLoading ? <Spinner variaton="SMALL" /> : undefined
            }
            onDecline={() => {
              rejectInvite(group.id);
            }}
            declineButtonIcon={
              rejectInviteIsLoading ? <Spinner variaton="SMALL" /> : undefined
            }
          />
        ))}
      </div>
    </Column>
  );
}
