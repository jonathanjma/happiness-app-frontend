import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import ToastMessage from "../../components/ToastMessage";
import Column from "../../components/layout/Column";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { MutationKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Group } from "../../data/models/Group";
import { SimpleUser, User } from "../../data/models/User";
import UserChip from "../../components/UserChip";

export default function CreateGroup() {
  const { api } = useApi();
  const { user } = useUser();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [curUserAdd, setCurUserAdd] = useState("");
  const [groupUsers, setGroupUsers] = useState<SimpleUser[]>([]);

  const [nameError, setNameError] = useState("");
  const [userAddError, setUserAddError] = useState("");

  const newGroupMutation = useMutation({
    mutationFn: () =>
      api
        .post<Group>("/group/", {
          name: groupName,
        })
        .then((res) => res.data),
    mutationKey: MutationKeys.MUTATE_GROUP,
  });

  const inviteUsersMutation = useMutation({
    mutationFn: (groupId: number) =>
      api.put<Group>("/group/" + groupId, {
        invite_users: groupUsers.map((u) => u.username),
      }),
    mutationKey: MutationKeys.MUTATE_GROUP,
  });

  // Create group, invite users, navigate to group, and show toast
  const createGroup = async () => {
    const newGroup = await newGroupMutation.mutateAsync();
    await inviteUsersMutation.mutateAsync(newGroup.id);
    // won't be executed if any of the requests above fail with an error
    navigate("/groups/" + newGroup.id);
    toast.custom(
      <ToastMessage message="Successfully Created Group and Invited Users" />,
    );
  };

  // If group name provided, open creation confirmation dialog
  const validateName = () => {
    if (groupName.trim().length === 0) setNameError("Name cannot be empty.");
    else {
      window.HSOverlay.open(document.querySelector("#create-confirm")!);
    }
  };

  // Adds user to invite list if input is non-empty, user is not already in group, and user is valid
  const addUser = () => {
    if (curUserAdd.trim() === "") {
      setUserAddError("Username cannot be empty.");
    } else if (
      groupUsers.findIndex(
        (u) => u.username.toLowerCase() === curUserAdd.toLowerCase(),
      ) !== -1 ||
      curUserAdd.toLowerCase() === user!.username.toLowerCase()
    ) {
      setUserAddError("User is already a member.");
    } else {
      api
        .get<User>("/user/username/" + curUserAdd)
        .then((res) => {
          setGroupUsers([...groupUsers, res.data]);
          setUserAddError("");
          setCurUserAdd("");
        })
        .catch(() => setUserAddError("User does not exist."));
    }
  };

  // Removes user from invite list
  const removeUser = (username: string) => {
    setGroupUsers(groupUsers.filter((user) => user.username !== username));
  };

  return (
    <>
      <Column className="mx-8 mb-4 mt-16 gap-y-6">
        {/* Header */}
        <BackButton relativeUrl="/groups" text="Back" />
        <h2 className="font-semibold">Create a Group</h2>
        {/* Input Fields */}
        <TextField
          value={groupName}
          onChangeValue={setGroupName}
          label="Group Name:"
          errorText={nameError}
          hasError={nameError !== ""}
          className="w-[250px]"
        />
        <TextField
          value={curUserAdd}
          onChangeValue={setCurUserAdd}
          label="Invite Users:"
          errorText={userAddError}
          hasError={userAddError !== ""}
          onEnterPressed={addUser}
          tooltip="(press enter to add user to list)"
          className="w-[250px]"
          innerElements={
            groupUsers.length !== 0 ? (
              <>
                {/* User Chips */}
                {groupUsers.map((user) => (
                  <UserChip
                    key={user.id}
                    user={user}
                    onRemove={() => removeUser(user.username)}
                  />
                ))}
              </>
            ) : undefined
          }
        />
        <Button
          label="Create Group"
          variation="FILLED"
          onClick={validateName}
        />
      </Column>
      <ConfirmationModal
        title="Create Group"
        body="Are you sure you want to create this group?"
        denyText="Cancel"
        confirmText="Confirm"
        onConfirm={createGroup}
        id="create-confirm"
      />
    </>
  );
}
