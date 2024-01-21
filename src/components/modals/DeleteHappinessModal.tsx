import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness } from "../../data/models/Happiness";
import { deleteOneFinite, deleteOneInfinite } from "../../utils";
import Button from "../Button";
import Spinner from "../Spinner";
import Column from "../layout/Column";
import Row from "../layout/Row";
import Modal from "./Modal";
export default function DeleteHappinessModal({
  happinessId,
  modalId,
}: {
  happinessId: number;
  modalId: string;
}) {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const deleteHappinessMutation = useMutation({
    mutationFn: () => api.delete(`/happiness/?id=${happinessId}`),
    onSuccess: () => {
      // Close the modal
      window.HSOverlay.close(document.querySelector(`#${modalId}`));

      // Update finite queries
      queryClient.setQueriesData(
        [QueryKeys.FETCH_HAPPINESS],
        (happinesses?: Happiness[]) =>
          deleteOneFinite(happinessId, happinesses),
      );

      // Update infinite queries
      queryClient.setQueriesData(
        [QueryKeys.FETCH_INFINITE_HAPPINESS],
        (infiniteHappiness?: InfinitePagintion<Happiness>) =>
          deleteOneInfinite(happinessId, infiniteHappiness),
      );
    },
    onError: () => {
      setErrorMessage("Failed to delete happiness");
    },
  });
  return (
    <Modal id={modalId}>
      <Column className="gap-6">
        <h3>Delete entry?</h3>
        <p> This action cannot be undone. </p>
        {errorMessage && <p className="text-error">{errorMessage}</p>}
        <Row>
          <Button associatedModalId={modalId} label={"Continue Editing"} />
          <div className="w-4" />
          <Button
            variation="TEXT"
            label={"Delete Entry"}
            onClick={() => {
              deleteHappinessMutation.mutate();
            }}
            icon={
              deleteHappinessMutation.isLoading ? (
                <Spinner variaton="SMALL" />
              ) : undefined
            }
          />
        </Row>
      </Column>
    </Modal>
  );
}
