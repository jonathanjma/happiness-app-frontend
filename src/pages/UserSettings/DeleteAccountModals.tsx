import { useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";

export default function DeleteAccountModals({ id }: { id: string }) {
  const { deleteUser } = useUser();
  const { api } = useApi();
  // DANGEROUS delete account mutation
  const { isLoading, mutate } = useMutation({
    mutationFn: () => api.delete("/user/"),
    onSuccess: () => {
      deleteUser();
      window.HSOverlay.open(document.querySelector("#sadness-app"));
    },
  });
  const [password, setPassword] = useState("");

  return (
    <>
      <ClosableModal id={id} leftContent={<h4>Delete Account</h4>}>
        <div className="mb-6 mt-4 h-[1px] w-[500px] bg-gray-100 " />
        <Column className="w-[500px]">
          <p>
            <b>This action is permanent and cannot be undone.</b> All your
            account information, including entries, will be lost.
          </p>
          <TextField
            label="Enter Password"
            type="password"
            value={password}
            onChangeValue={setPassword}
            className="my-6"
          />
          <Row className="gap-4">
            <Button
              variation="DANGEROUS"
              label="Delete Account"
              associatedModalId="last-check"
            />
            <Button variation="TEXT" label="Cancel" associatedModalId={id} />
          </Row>
        </Column>
      </ClosableModal>
      <ClosableModal id="last-check" leftContent={<h4>One Last Check</h4>}>
        <div className="mb-6 mt-4 h-[1px] w-[500px] bg-gray-100 " />
        <p>
          Are you sure you would like to <b>delete your account?</b>
        </p>
        <Row className="mt-6 gap-4">
          <Button
            variation="SUPER_DANGEROUS"
            label="Delete Account"
            onClick={() => {
              mutate();
            }}
            icon={isLoading ? <Spinner variaton="SMALL" /> : undefined}
          />
          <Button
            variation="TEXT"
            label="Cancel"
            associatedModalId="last-check"
          />
        </Row>
      </ClosableModal>
      <ClosableModal id="sadness-app" leftContent={<h4>Account Deleted</h4>}>
        <div className="mb-6 mt-4 h-[1px] w-[500px] bg-gray-100 " />
        <p>
          <b>Your account has been deleted.</b> <br /> <br />
          We are sad to see you go! Thank you for being part of our journey.
        </p>
        <div className="h-6" />
        <Button
          label="Done"
          onClick={() => {
            window.location.href = "https://happinessapp.me";
          }}
        />
      </ClosableModal>
    </>
  );
}
