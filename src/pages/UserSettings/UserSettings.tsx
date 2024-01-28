import * as EmailValidator from "email-validator";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import NewPasswordInput from "../../components/NewPasswordInput";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import Toggle from "../../components/Toggle";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { SettingShort } from "../../data/models/Setting";
import { getTimeZone } from "../../utils";
import RecoveryPhraseModal from "./RecoveryPhraseModal";

export default function UserSettings() {
  const { user, deleteUser } = useUser();
  const { api } = useApi();
  const [hasEmailAlerts, setHasEmailAlerts] = useState(
    user!.settings.find((s) => s.key === "notify" && s.enabled === true) !==
      undefined,
  );
  // we only care about the time of this date
  const [emailTime, setEmailTime] = useState(
    user!.settings.find((s) => s.key === "notify")?.value.split(" ")[0] ??
      "09:00",
  );
  const [email, setEmail] = useState("");
  const [changeEmailState, setChangeEmailState] = useState("");

  const [username, setUsername] = useState("");
  const [changeUsernameState, setChangeUsernameState] = useState("");

  const [changePasswordState, setChangePasswordState] = useState("");

  // for changing password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);

  const handlePasswordSubmit = () => {
    setTriedSubmit(true);
    if (!hasPasswordError) {
      changePassword();
    }
  };

  // for recovery phrase modal
  const [triedSubmit, setTriedSubmit] = useState(false);

  const [emailTimeNetworkingState, setEmailTimeNetworkingState] = useState(
    Constants.FINISHED_MUTATION_TEXT,
  );
  // For email updating based on timeout
  const updateEmailTimeout = useRef<number | undefined>();
  const updateEmailHandler = () => {
    updateEmailAlerts.mutate(hasEmailAlerts);
  };

  // update time when time is updated
  const [isFirstRender, setIsFirstRender] = useState(false);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      clearTimeout(updateEmailTimeout.current);
      updateEmailTimeout.current = setTimeout(updateEmailHandler, 500);
    }
  }, [emailTime]);

  // DANGEROUS delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => api.delete("/user/"),
    onSuccess: () => {
      deleteUser();
    },
  });

  // Updating email alerts setting
  const updateEmailAlerts = useMutation({
    // Only way to have optional parameters for mutationFn
    // https://github.com/TanStack/query/issues/4264#issuecomment-1268054812
    mutationFn: (enabled: boolean) =>
      api
        .post<SettingShort>("/user/settings/", {
          key: "notify",
          value: `${emailTime} ${getTimeZone()}`,
          enabled: enabled,
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      setHasEmailAlerts(data.enabled);
      setEmailTime(data.value.split(" ")[0]);
      setEmailTimeNetworkingState(Constants.FINISHED_MUTATION_TEXT);
    },
  });

  // Changing username mutation
  const {
    isLoading: usernameChangeLoading,
    mutate: changeUsername,
    isError: usernameIsError,
  } = useMutation({
    mutationFn: (username: string) =>
      api.put("/user/info/", {
        data_type: "username",
        data: username,
      }),
    onError: () => {
      setChangeUsernameState("Username already taken.");
    },
    onSuccess: () => {
      setChangeUsernameState("Username updated. Refresh to see changes.");
    },
  });

  // Changing email mutation
  const {
    isLoading: emailChangeLoading,
    mutate: changeEmail,
    isError: emailError,
  } = useMutation({
    mutationFn: (email: string) => {
      return api.put("/user/info/", {
        data_type: "email",
        data: email,
      });
    },
    onSuccess: () => {
      setChangeEmailState("Email successfully updated");
    },
    onError: () => {
      setChangeEmailState("Email may already be taken.");
    },
  });

  // Change password mutation
  const {
    isLoading: changePasswordLoading,
    mutate: changePassword,
    isError: changePasswordError,
  } = useMutation({
    mutationFn: () =>
      api.put("/user/info/", {
        data_type: "password",
        data: oldPassword,
        data2: newPassword,
      }),
    onError: () => {
      setChangePasswordState("Your old password may be incorrect.");
    },
    onSuccess: () => {
      setChangePasswordState("Password changed.");
    },
  });

  return (
    <>
      <Column className="mx-8 my-16 w-full gap-6">
        <h2>Settings</h2>

        <h4 className="text-gray-600">Notification Settings</h4>
        <Row className=" h-6 w-1/2 items-center">
          <p className="text-gray-400">Email Alerts</p>
          <div className="flex flex-1" />
          <Toggle
            toggled={hasEmailAlerts}
            onToggle={() => {
              updateEmailAlerts.mutate(!hasEmailAlerts);
            }}
          />
        </Row>
        {hasEmailAlerts && (
          <>
            <TextField
              value={emailTime}
              onChangeValue={(emailTime) => {
                setEmailTimeNetworkingState(Constants.LOADING_MUTATION_TEXT);
                setEmailTime(emailTime);
              }}
              label="Pick a time to receive notifications:"
              type="time"
            />
            <label className="font-normal text-gray-600">
              {emailTimeNetworkingState}
            </label>
          </>
        )}

        <h4 className="text-gray-600">Account Settings</h4>
        <TextField
          value={email}
          hint={user!.email}
          onChangeValue={setEmail}
          label="Change email:"
          type="email"
        />
        {changeEmailState && (
          <label
            className={`font-normal ${
              emailError || changeEmailState === "Email not valid"
                ? "text-error"
                : "text-gray-400"
            }`}
          >
            {changeEmailState}
          </label>
        )}
        <Button
          label="Change Email"
          icon={emailChangeLoading ? <Spinner variaton="SMALL" /> : undefined}
          onClick={() => {
            if (EmailValidator.validate(email)) {
              changeEmail(email);
            } else {
              setChangeEmailState("Email not valid");
            }
          }}
        />
        <TextField
          value={username}
          hint={user!.username}
          onChangeValue={setUsername}
          label="Change username:"
          type="username"
        />
        {changeUsernameState && (
          <label
            className={`font-normal ${
              usernameIsError ? "text-error" : "text-gray-400"
            }`}
          >
            {changeUsernameState}
          </label>
        )}
        <Button
          label="Change Username"
          icon={
            usernameChangeLoading ? <Spinner variaton="SMALL" /> : undefined
          }
          onClick={() => {
            if (username) {
              changeUsername(username);
            } else {
              setChangeUsernameState("Username must not be empty");
            }
          }}
        />
        <p className="font-normal text-gray-400">Change password:</p>
        <TextField
          label="Old password"
          type="password"
          value={oldPassword}
          onChangeValue={setOldPassword}
        />
        <NewPasswordInput
          hasPasswordError={hasPasswordError}
          setPasswordError={setHasPasswordError}
          password={newPassword}
          setPassword={setNewPassword}
          triedSubmit={triedSubmit}
          label="New password"
        />
        {changePasswordState && (
          <label
            className={`font-normal ${
              changePasswordError ? "text-error" : "text-gray-400"
            }`}
          >
            {changePasswordState}
          </label>
        )}
        <Button
          label="Change Password"
          onClick={handlePasswordSubmit}
          icon={
            changePasswordLoading ? <Spinner variaton="SMALL" /> : undefined
          }
        />

        <h4 className="text-gray-600">Private Journals</h4>
        <Button
          label="Set Up Recovery Key"
          onClick={() => {
            window.HSOverlay.open(document.querySelector("#recovery"));
          }}
        />

        <h4 className="text-gray-600">Delete Account</h4>
        <Button
          label="Delete account"
          associatedModalId="confirm-delete"
          variation="DANGEROUS"
        />
      </Column>
      <ConfirmationModal
        title="Delete your account"
        body="Are you sure you want to delete your account? All your data will be lost and this action cannot be undone."
        id="confirm-delete"
        denyText={"Cancel"}
        confirmText={"Delete Account"}
        onConfirm={() => {
          deleteAccountMutation.mutate();
        }}
        confirmButtonProps={{
          icon: deleteAccountMutation.isLoading ? (
            <Spinner variaton="SMALL" />
          ) : undefined,
          associatedModalId: "",
        }}
      />
      <RecoveryPhraseModal id="recovery" />
    </>
  );
}
