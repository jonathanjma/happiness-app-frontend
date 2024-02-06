import * as EmailValidator from "email-validator";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import NewPasswordInput from "../../components/NewPasswordInput";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { Constants, MutationKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Token } from "../../data/models/Token";
import { User } from "../../data/models/User";
import { useOnline } from "../../utils";

export default function SignUpModal({
  id,
  onLoginClick,
}: {
  id: string;
  onLoginClick: () => void;
}) {
  // check if user is online to display proper error messages
  const isOnline = useOnline();

  // text fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSnapshot, setPasswordSnapshot] = useState("");

  // error tracking:

  // email requirements
  const [validEmail, setValidEmail] = useState(true);
  // password requirements
  const [matchesConfirmPassword, setMatchesConfirmPassword] = useState(true);
  // networking errors:
  const [netorkingError, setNetworkingError] = useState("");
  // username error:
  const [usernameError, setUsernameError] = useState("");
  // email error:
  const [emailError, setEmailError] = useState("");
  // if the user tried submit we need to show errors:
  const [triedSubmit, setTriedSubmit] = useState(false);

  // check in general if password is good
  const [hasPasswordError, setHasPasswordError] = useState(true);

  // make it so error doesn't persist when user begins to edit
  useEffect(() => {
    setValidEmail(true);
    setEmailError("");
  }, [email]);
  useEffect(() => {
    setUsernameError("");
  }, [username]);
  useEffect(() => {
    if (confirmPassword === password) {
      setMatchesConfirmPassword(true);
    }
  }, [confirmPassword]);

  const { api } = useApi();
  const { getUserFromToken } = useUser();

  // set up mutations
  /*
  yes there's repeated code, but we looked into abstracting mutation at the 
  beginning of Happiness App V2.0 and could not find a good solution.
  Using React query in this manner is the best way to get consistent and high
  quality interaction for the user, although it is a bit verbose.
  */
  const loginMutation = useMutation({
    mutationKey: [MutationKeys.LOG_IN, username, passwordSnapshot],
    mutationFn: () =>
      api
        .post<Token>(
          "/token/",
          {},
          {
            headers: {
              Authorization: `Basic ${btoa(`${username}:${passwordSnapshot}`)}`,
            },
          },
        )
        .then((res) => res.data),
    onError: () => {
      setNetworkingError("Unknown error occurred. Please refresh the page.");
    },
    onSuccess: (token: Token) => {
      localStorage.setItem(Constants.TOKEN, token.session_token);
      getUserFromToken();
    },
  });

  const createAccountMutation = useMutation({
    mutationKey: [MutationKeys.CREATE_ACCOUNT, username, password, email],
    mutationFn: async () => {
      setPasswordSnapshot(password);
      return api
        .post<User>("/user/", {
          username: username,
          password: password,
          email: email,
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      loginMutation.mutate();
    },
    onError: (error: any) => {
      console.log(`error JSON: ${JSON.stringify(error)}`);
      if (error.response) {
        const parser = new DOMParser();
        const resDoc = parser.parseFromString(error.response.data, "text/html");
        const errorMessage = resDoc.querySelector("p")?.textContent;
        console.log(`errorMessage: ${errorMessage}`);
        if (errorMessage?.includes("username")) {
          setUsernameError(errorMessage);
        } else if (errorMessage?.includes("email")) {
          setEmailError(errorMessage);
        } else {
          setNetworkingError(
            errorMessage ??
              "Unknown error occurred, please check your internet connection.",
          );
        }
      }
    },
  });

  // what happens when user tries to create account
  const handleCreateAccount = () => {
    setTriedSubmit(true);
    // validation phase

    // even tho using variables looks clunky, I was having some issues with what
    // I believe was concurrency when trying to prevent network requests for invalid accounts
    const hasValidEmail = EmailValidator.validate(email);
    setValidEmail(hasValidEmail);
    setMatchesConfirmPassword(password === confirmPassword);

    if (username.trim().length === 0) {
      setUsernameError("Username cannot be empty.");
    }

    // have to check much of this manually since the use state variables are
    // unreliable right after being set
    if (
      hasValidEmail &&
      !hasPasswordError &&
      usernameError === "" &&
      username.trim().length !== 0 &&
      password === confirmPassword
    ) {
      // Attempt to create the account
      createAccountMutation.mutate();
    }
  };

  return (
    <ClosableModal id={id} leftContent={<h4>Sign Up</h4>}>
      <Row className="my-4 w-[436px] gap-1">
        <p>Already have an account?</p>
        <p
          className="font-semibold text-secondary underline hover:cursor-pointer"
          onClick={onLoginClick}
        >
          Log In
        </p>
      </Row>
      <div className="h-[1px] w-full bg-gray-100" />
      <Column className="my-6 gap-4">
        <TextField
          label="Username"
          value={username}
          onChangeValue={setUsername}
          errorText={usernameError}
          hasError={usernameError !== ""}
        />
        <TextField
          label="Email Address"
          value={email}
          onChangeValue={setEmail}
          hasError={!validEmail || emailError.length > 0}
          errorText={emailError ?? "Email address is invalid."}
        />
        <NewPasswordInput
          password={password}
          setPassword={setPassword}
          hasPasswordError={hasPasswordError}
          setPasswordError={setHasPasswordError}
          triedSubmit={triedSubmit}
        />
        <TextField
          label="Confirm Password"
          value={confirmPassword}
          onChangeValue={setConfirmPassword}
          onEnterPressed={handleCreateAccount}
          type="password"
          hasError={!matchesConfirmPassword}
          errorText="Passwords are not matching."
        />
      </Column>
      <Button
        size="LARGE"
        label="Create Account"
        onClick={handleCreateAccount}
        icon={
          loginMutation.isLoading || createAccountMutation.isLoading ? (
            <Spinner variaton="SMALL" />
          ) : undefined
        }
      />
      {netorkingError && <p className="my-6 text-error">{netorkingError}</p>}
    </ClosableModal>
  );
}
