import ClosableModal from "../../components/modals/ClosableModal";
import { Group } from "../../data/models/Group";
import UserChip from "../../components/UserChip";
import TextField from "../../components/TextField";
import { useState } from "react";
import { useApi } from "../../contexts/ApiProvider";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import * as EmailValidator from "email-validator";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import ToastMessage from "../../components/ToastMessage";
import { useUser } from "../../contexts/UserProvider";
import { QueryKeys } from "../../constants";

export function GroupMembers({ group }: { group: Group }) {
  const { api } = useApi();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [groupData, setGroupData] = useState(group);
  const [removingInvite, setRemovingInvite] = useState(false);
  const [curUserAdd, setCurUserAdd] = useState("");
  const [userAddError, setUserAddError] = useState("");

  const usernameCheck = useMutation({
    mutationFn: () => api.get("/user/username/" + curUserAdd),
  });

  const inviteUser = useMutation({
    mutationFn: (username: string) =>
      api.put<Group>("/group/" + groupData.id, {
        invite_users: [username],
      }),
    onSuccess: (res) => {
      updateGroupState(res.data);
    },
  });

  const removeUser = useMutation({
    mutationFn: (username: string) =>
      api.put<Group>("/group/" + groupData.id, {
        remove_users: [username],
      }),
    onSuccess: (res) => {
      updateGroupState(res.data);
    },
  });

  // update internal state of the modal to show updated group
  const updateGroupState = (data: Group) => {
    data.users.sort((a, b) => a.id - b.id);
    data.invited_users.sort((a, b) => a.id - b.id);
    setGroupData(data);
    queryClient.invalidateQueries([QueryKeys.FETCH_GROUP_INFO, group.id]);
  };

  const handleInviteUser = () => {
    // if username is not empty, the user is not already in the group/been invited, and username exists
    if (curUserAdd.trim() === "") {
      setUserAddError("Username cannot be empty.");
    } else if (
      [...groupData.users, ...groupData.invited_users].findIndex(
        (u) => u.username.toLowerCase() === curUserAdd.toLowerCase(),
      ) !== -1 ||
      curUserAdd.toLowerCase() === user!.username.toLowerCase()
    ) {
      setUserAddError("User is already a member or has already been invited.");
    } else {
      usernameCheck
        .mutateAsync()
        .then(() => {
          setUserAddError("");
          setCurUserAdd("");
          // invite user if username is valid
          inviteUser.mutate(curUserAdd);
        })
        .catch(() => setUserAddError("User does not exist."));
    }
  };

  return (
    <ClosableModal leftContent={<h4>Group Members</h4>} id="edit-members">
      <Column className="gap-y-3 md:w-[400px] lg:w-[600px]">
        <div className="mt-4 h-[1px] w-full bg-gray-100" />
        {/* List current members */}
        <p className="text-gray-600">Current Members:</p>
        <Row className="flex-wrap gap-y-1">
          {groupData.users.map((member) =>
            user!.id !== member.id ? (
              <UserChip
                key={member.id}
                user={member}
                onRemove={() => {
                  setRemovingInvite(false);
                  removeUser.mutate(member.username);
                }}
              />
            ) : undefined,
          )}
          {!removingInvite && removeUser.isLoading ? <Spinner /> : undefined}
        </Row>
        {/* List invited members */}
        {groupData.invited_users.length > 0 && (
          <>
            <p className="text-gray-600">Invited Members:</p>
            <Row className="flex-wrap gap-y-1">
              {groupData.invited_users.map((user) => (
                <UserChip
                  key={user.id}
                  user={user}
                  onRemove={() => {
                    setRemovingInvite(true);
                    removeUser.mutate(user.username);
                  }}
                />
              ))}
              {removingInvite && removeUser.isLoading ? <Spinner /> : undefined}
            </Row>
          </>
        )}
        <TextField
          value={curUserAdd}
          onChangeValue={setCurUserAdd}
          hint="Invite users"
          errorText={userAddError}
          hasError={userAddError !== ""}
          className="w-[250px]"
          onEnterPressed={handleInviteUser}
          tooltip="(press enter to invite user)"
          innerIcon={
            usernameCheck.isLoading || inviteUser.isLoading ? (
              <Spinner />
            ) : undefined
          }
        />
        <Row className="gap-4">
          <Button
            label="Close"
            variation="GRAY"
            associatedModalId="edit-members"
          />
          <Button
            label="Invite Your Friends"
            variation="TEXT"
            associatedModalId="invite-friends"
          />
        </Row>
      </Column>
    </ClosableModal>
  );
}

export function InviteFriends() {
  const { api } = useApi();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // TODO: add URL
  const inviteUsers = useMutation({
    mutationFn: (email: string) => api.post("", {}),
    onSuccess: () => {
      toast.custom(<ToastMessage message="✉️ Invite Sent" />);
      setEmail("");
      setEmailError("");
    },
  });

  const handleInvite = () => {
    if (email === "") {
      setEmailError("Email is empty.");
    } else if (!EmailValidator.validate(email)) {
      setEmailError("Invalid email.");
    } else {
      inviteUsers.mutate(emailError);
    }
  };

  return (
    <ClosableModal leftContent={<h4>Invite Friends</h4>} id="invite-friends">
      <Column className="gap-y-3 sm:w-[200px] md:w-[450px]">
        <div className="mt-4 h-[1px] w-full bg-gray-100" />
        <p>
          We will send an email to your friend(s) inviting them to Happiness
          App!
        </p>
        <TextField
          value={email}
          onChangeValue={setEmail}
          hint="Enter email"
          errorText={emailError}
          hasError={emailError !== ""}
          className="w-[250px]"
        />
        <Row className="gap-4">
          <Button
            icon={
              inviteUsers.isLoading ? <Spinner variaton="SMALL" /> : undefined
            }
            label="Send invite"
            variation="GRAY"
            onClick={handleInvite}
          />
          <Button
            label="Close"
            variation="TEXT"
            associatedModalId="invite-friends"
          />
        </Row>
      </Column>
    </ClosableModal>
  );
}
