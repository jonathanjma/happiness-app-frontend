import ClosableModal from "../../components/modals/ClosableModal";
import { Group } from "../../data/models/Group";
import UserChip from "../../components/UserChip";
import TextField from "../../components/TextField";
import { useState } from "react";
import { useApi } from "../../contexts/ApiProvider";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import Button from "../../components/Button";

export function GroupMembers({ group }: { group: Group }) {
  const { api } = useApi();
  const [curUserAdd, setCurUserAdd] = useState("");
  const [userAddError, setUserAddError] = useState("");

  // const inviteUsersMutation = useMutation({
  //   mutationFn: (groupId: number) =>
  //     api.put<Group>("/group/" + groupId, {
  //       invite_users: groupUsers.map((u) => u.username),
  //     }),
  //   mutationKey: MutationKeys.MUTATE_GROUP,
  // });

  return (
    <ClosableModal leftContent={<h4>Group Members</h4>} id="edit-members">
      <Column className="gap-y-3">
        <p className="text-gray-600">Current Members:</p>
        <Row className="gap-y-1">
          {group.users.map((user) => (
            <UserChip key={user.id} user={user} onRemove={() => 7} />
          ))}
        </Row>
        {group.invited_users.length > 0 && (
          <>
            <p className="text-gray-600">Invited Members:</p>
            <Row className="gap-y-1">
              {group.invited_users.map((user) => (
                <UserChip key={user.id} user={user} onRemove={() => 7} />
              ))}
            </Row>
          </>
        )}
        <TextField
          value={curUserAdd}
          onChangeValue={setCurUserAdd}
          hint="Invite users"
          errorText={userAddError}
          hasError={userAddError !== ""}
          // onEnterPressed={addUser}
        />
        <Row className="gap-4">
          <Button
            // icon={
            //   deleteGroup.isLoading ? <Spinner variaton="SMALL" /> : undefined
            // }
            label="Save and Close"
            variation="GRAY"
            // onClick={deleteGroup.mutate}
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
  return (
    <ClosableModal leftContent={<h4>Invite Friends</h4>} id="invite-friends">
      <Column className="gap-y-3"></Column>
    </ClosableModal>
  );
}
