import Row from "../../components/layout/Row";
import { Link, useNavigate } from "react-router-dom";
import LeftArrowIcon from "../../assets/arrow_left.svg";
import RemoveIcon from "../../assets/close.svg";
import React, { useState } from "react";
import TextField from "../../components/TextField";
import Column from "../../components/layout/Column";
import Button from "../../components/Button";
import { SimpleUser, User } from "../../data/models/User";
import { useApi } from "../../contexts/ApiProvider";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { Group } from "../../data/models/Group";

export default function CreateGroup() {
  const { api } = useApi();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [curUserAdd, setCurUserAdd] = useState("");
  const [groupUsers, setGroupUsers] = useState<SimpleUser[]>([]);

  const [nameError, setNameError] = useState("");
  const [userAddError, setUserAddError] = useState("");

  // Create group, invite users, and navigate to group
  const createGroup = async () => {
    const newGroup = await api.post<Group>("/group/", {
      name: groupName,
    });
    await api.put<Group>("/group/" + newGroup.data.id, {
      invite_users: groupUsers.map((u) => u.username),
    });
    navigate("/groups/" + newGroup.data.id);
  };

  // If group name provided, open creation confirmation dialog
  const validateName = () => {
    if (!groupName) setNameError("Name cannot be empty.");
    else {
      // @ts-ignore
      window.HSOverlay.open(document.querySelector("#create-confirm")!);
    }
  };

  // Adds user to invite list if input is non-empty, user is not already in group, and user is valid
  const addUser = () => {
    if (!curUserAdd) {
      setUserAddError("Username cannot be empty.");
    } else if (
      groupUsers.find(
        (u) => u.username.toLowerCase() === curUserAdd.toLowerCase(),
      ) !== undefined
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
        <Row>
          <Link to="/groups">
            <Row>
              <img src={LeftArrowIcon} className="max-w-[24px]" />
              <label className="font-normal text-gray-600">Back</label>
            </Row>
          </Link>
        </Row>
        <h2 className="font-semibold">Create a Group</h2>
        {/* Input Fields */}
        <TextField
          value={groupName}
          onChangeValue={setGroupName}
          label="Group Name:"
          supportingText={nameError}
          hasError={nameError !== ""}
        />
        <TextField
          value={curUserAdd}
          onChangeValue={setCurUserAdd}
          label="Invite Users:"
          supportingText={userAddError}
          hasError={userAddError !== ""}
          onEnterPressed={addUser}
          innerElements={
            groupUsers.length !== 0 ? (
              <>
                {/* User Chips */}
                {groupUsers.map((user) => (
                  <Row
                    key={user.id}
                    className="mb-1 mr-2 items-center gap-x-0.5 rounded-2xl bg-yellow px-[5px] py-[3px]"
                  >
                    <img
                      src={user.profile_picture}
                      className="max-h-[22px] rounded-full"
                    />
                    <p className="pb-0.5 font-normal text-secondary">
                      {user.username}
                    </p>
                    <img
                      src={RemoveIcon}
                      className="max-h-[12px] hover:cursor-pointer"
                      onClick={() => removeUser(user.username)}
                    />
                  </Row>
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
