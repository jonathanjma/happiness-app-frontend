import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import ToastMessage from "../../components/ToastMessage";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Group } from "../../data/models/Group";

import { useNavigate } from "react-router-dom";
import LeftArrowIcon from "../../assets/arrow_left.svg";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import ClosableModal from "../../components/modals/ClosableModal";
import { useUser } from "../../contexts/UserProvider";
import { GroupMembers, InviteFriends } from "./EditMembers";

export default function GroupSettings({
  group,
  setShowGroupSettings,
}: {
  group: Group;
  setShowGroupSettings: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useUser();
  const navigate = useNavigate();

  // group settings:
  const [groupNameText, setGroupNameText] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [changeGroupNameError, setChangeGroupNameError] = useState("");
  const { api } = useApi();
  const queryClient = useQueryClient();

  // modals
  const confirmLeaveId = "confirm-leave";
  const deleteId = "delete-group";

  const changeGroupName = useMutation<Group>({
    mutationFn: () =>
      api
        .put<Group>(`/group/${group.id}`, { name: groupNameText })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.FETCH_GROUP_INFO]);
      toast.custom(<ToastMessage message="✅ Group Name Changed" />);
    },
    onError: () => {
      setChangeGroupNameError(
        "Error changing group name, check your internet connection.",
      );
    },
  });

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (!isFirstRender && groupNameText.trim() === "") {
      setChangeGroupNameError("Group name cannot be empty.");
    } else {
      setIsFirstRender(false);
      setChangeGroupNameError("");
    }
  }, [groupNameText]);

  const leaveGroup = useMutation({
    mutationFn: () =>
      api.put<Group>(`/group/${group.id}`, { remove_users: [user!.username] }),
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.FETCH_GROUP_INFO]);
      toast.custom(<ToastMessage message="🚪 Left The Group" />);
      navigate("/groups");
    },
    onError: () => {
      setLeaveError("Error leaving group, check your internet connection.");
    },
  });

  const deleteGroup = useMutation({
    mutationFn: () => api.delete<Group>(`/group/${group.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.FETCH_GROUP_INFO]);
      toast.custom(<ToastMessage message="🗑️ Group Deleted" />);
      navigate("/groups");
    },
    onError: () => {
      setLeaveError("Error leaving group, check your internet connection.");
    },
  });

  const handleChangeGroupName = () => {
    if (groupNameText.trim() === "") {
      setChangeGroupNameError("Group name cannot be empty.");
    } else {
      changeGroupName.mutate();
    }
  };
  return (
    <>
      <Column className="mx-8 gap-6 pt-16">
        <Row
          className="items-center hover:cursor-pointer"
          onClick={() => {
            setShowGroupSettings(false);
          }}
        >
          <img src={LeftArrowIcon} className="max-w-[24px]" />
          <label className="font-normal text-gray-600">Back</label>
        </Row>
        <h2>Group Settings</h2>
        <TextField
          label="Change Group Name:"
          hint={group.name}
          value={groupNameText}
          onChangeValue={setGroupNameText}
          onEnterPressed={handleChangeGroupName}
          className="w-[250px]"
          hasError={changeGroupNameError.length > 0}
          errorText={changeGroupNameError}
        />
        <Button
          label="Save Group Name"
          onClick={handleChangeGroupName}
          icon={
            changeGroupName.isLoading ? <Spinner variaton="SMALL" /> : undefined
          }
          variation="GRAY"
        />
        <h4 className="text-gray-600">Manage Members</h4>
        <Button
          label="View and Invite Members"
          variation="GRAY"
          associatedModalId="edit-members"
        />
        <h4 className="text-gray-600">Leave Group</h4>
        <Button
          label="Leave Group"
          variation="GRAY"
          associatedModalId={confirmLeaveId}
        />
        <h4 className="text-gray-600">Delete Group</h4>
        <Button
          label="Delete Group"
          variation="DANGEROUS"
          associatedModalId={deleteId}
        />
      </Column>
      <ClosableModal leftContent={<h4>Leave Group</h4>} id={confirmLeaveId}>
        <Column className="gap-6 sm:w-[200px] md:w-[400px] lg:w-[600px]">
          <div className="mt-4 h-[1px] w-full bg-gray-100" />
          <p>
            Are you sure you would like to <b>leave the group?</b>
          </p>
          {leaveError && <p className="text-error">{leaveError}</p>}
          <Row className="gap-4">
            <Button
              icon={
                leaveGroup.isLoading ? <Spinner variaton="SMALL" /> : undefined
              }
              label="Leave group"
              variation="DANGEROUS"
              onClick={leaveGroup.mutate}
            />
            <Button
              label="Cancel"
              variation="TEXT"
              associatedModalId={confirmLeaveId}
            />
          </Row>
        </Column>
      </ClosableModal>
      <ClosableModal leftContent={<h4>Delete Group</h4>} id={deleteId}>
        <Column className="gap-6 sm:w-[200px] md:w-[400px] lg:w-[600px]">
          <div className="mt-4 h-[1px] w-full bg-gray-100" />
          <p>
            Are you sure you would like to <b>delete the group?</b> This will
            remove everyone from the group but will not delete any happiness
            entries.
          </p>
          {leaveError && <p className="text-error">{leaveError}</p>}
          <Row className="gap-4">
            <Button
              icon={
                deleteGroup.isLoading ? <Spinner variaton="SMALL" /> : undefined
              }
              label="Delete group"
              variation="SUPER_DANGEROUS"
              onClick={deleteGroup.mutate}
            />
            <Button
              label="Cancel"
              variation="TEXT"
              associatedModalId={deleteId}
            />
          </Row>
        </Column>
      </ClosableModal>
      <GroupMembers group={group} />
      <InviteFriends />
    </>
  );
}
