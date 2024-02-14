import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import Column from "../../components/layout/Column";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { AllGroups } from "../../data/models/Group";
import GroupCard from "../UserGroups/GroupCard";

export default function GroupInvites() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  const [focusedGroup, setFocusedGroup] = useState(0);
  const { data: allInvites } = useQuery({
    queryKey: [QueryKeys.FETCH_USER_GROUPS],
    queryFn: () => api.get<AllGroups>("/group/user").then((res) => res.data),
  });
  const { mutate: acceptInvite, isLoading: acceptIsLoading } = useMutation({
    mutationFn: (groupId: number) =>
      api.post(`/group/accept_invite/${groupId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.FETCH_USER_GROUPS]);
    },
    onError: () => {
      toast.custom(<ToastMessage message="❌ Error joining group" />);
    },
  });
  const { mutate: rejectInvite, isLoading: rejectInviteIsLoading } =
    useMutation({
      mutationFn: (groupId: number) =>
        api.post(`/group/reject_invite/${groupId}`, {}),
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.FETCH_USER_GROUPS]);
      },
      onError: () => {
        toast.custom(<ToastMessage message="❌ Error declining group" />);
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
              setFocusedGroup(group.id);
              acceptInvite(group.id);
            }}
            acceptButtonIcon={
              group.id === focusedGroup && acceptIsLoading ? (
                <Spinner variaton="SMALL" />
              ) : undefined
            }
            onDecline={() => {
              setFocusedGroup(group.id);
              rejectInvite(group.id);
            }}
            declineButtonIcon={
              group.id === focusedGroup && rejectInviteIsLoading ? (
                <Spinner variaton="SMALL" />
              ) : undefined
            }
          />
        ))}
        {allInvites?.group_invites.length === 0 && (
          <p className="text-gray-400">You have no group invites</p>
        )}
      </div>
    </Column>
  );
}
