import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import ToastMessage from "../../components/ToastMessage";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { useApi } from "../../contexts/ApiProvider";

export default function RecoveryPhraseModal({ id }: { id: string }) {
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [recoveryPhraseState, setRecoveryPhraseState] = useState("");
  const [password, setPassword] = useState("");

  const { api } = useApi();

  const { mutate: mutateRecoveryPhrase, isLoading: recoveryPhraseLoading } =
    useMutation({
      mutationFn: () => {
        return api.put("/user/info/", {
          data_type: "key_recovery_phrase",
          data: password,
          data2: recoveryPhrase,
        });
      },
      onSuccess: () => {
        toast.custom(<ToastMessage message="✅ Recovery Phrase Set" />);
        window.HSOverlay.close(document.querySelector(`#${id}`));
      },
      onError: () => {
        setRecoveryPhraseState(
          "Error setting recovery phrase. Make sure you entered your password correctly.",
        );
      },
    });

  return (
    <ClosableModal
      id={id}
      leftContent={<h4>Change or Create Your Recovery Key</h4>}
    >
      <div className="h-4" />
      <div className="h-[1px] w-full bg-gray-100" />
      <Column className="gap-6">
        <p className="mt-6 max-w-[600px] text-gray-400">
          Enter a new recovery phrase to use as a backup for private journals.
          If you forget your password, you will be prompted for your recovery
          phrase to restore journal entries. Store this in a safe place so you
          can still access journals if you forget your password! You'll need to
          enter your password to change or create your recovery phrase.
        </p>

        <TextField
          label="Account password"
          value={password}
          onChangeValue={setPassword}
          type="password"
          className="w-[250px]"
        />
        <TextField
          label="Recovery phrase"
          hint="I will remember this"
          value={recoveryPhrase}
          onChangeValue={setRecoveryPhrase}
          className="w-[250px]"
        />
        {recoveryPhraseState && (
          <label className="text-error">{recoveryPhraseState}</label>
        )}
        <Row className="gap-4">
          <Button
            label="Submit Recovery Phrase"
            icon={
              recoveryPhraseLoading ? <Spinner variaton="SMALL" /> : undefined
            }
            onClick={mutateRecoveryPhrase}
          />
          <Button label="Cancel" variation="TEXT" />
        </Row>
      </Column>
    </ClosableModal>
  );
}
