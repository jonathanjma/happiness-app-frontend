import * as EmailValidator from "email-validator";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import IconCheck from "../../assets/IconCheck";
import IconWarningOutline from "../../assets/IconWarningOutline";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextArea from "../../components/TextArea";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { Constants, MutationKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Token } from "../../data/models/Token";
import { User } from "../../data/models/User";
import { useOnline } from "../../utils";

export default function SignUpModal({ id, onLoginClick }: {
  id: string;
  onLoginClick: () => void;
}) {
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
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [matchesConfirmPassword, setMatchesConfirmPassword] = useState(true);
  // networking errors:
  const [netorkingError, setNetworkingError] = useState("");
  // username error:
  const [usernameError, setUsernameError] = useState("");
  // if the user tried submit we need to show errors:
  const [triedSubmit, setTriedSubmit] = useState(false);

  // check in general if password is good
  const hasPasswordError = () =>
    !isLongEnough || !hasNumber || !hasUppercase;

  // check for errors in user input
  const [isFirstRender, setIsFirstRender] = useState(false);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(true);
      return;
    }
    setIsLongEnough(password.length >= 8);

    const numberRegex = /[0-9]/;
    setHasNumber(numberRegex.test(password));

    const uppercaseRegex = /[A-Z]/;
    setHasUppercase(uppercaseRegex.test(password));
  }, [password]);
  // make it so error doesn't persist when user begins to edit
  useEffect(() => {
    setValidEmail(true);
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
      api.post<Token>(
        "/token/",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${passwordSnapshot}`)}`,
          },
        },
      ).then((res) => res.data),
    onError: () => {
      setNetworkingError("Unknown error occurred. Please refresh the page.");
    },
    onSuccess: (token: Token) => {
      localStorage.setItem(Constants.TOKEN, token.session_token);
      getUserFromToken();
    }
  });

  const createAccountMutation = useMutation({
    mutationKey: [MutationKeys.CREATE_ACCOUNT, username, password, email],
    mutationFn: async () => {
      setPasswordSnapshot(password);
      return (await api.post<User>("/user/", {
        username: username,
        password: password,
        email: email
      })).data;
    },
    onSuccess: () => {
      loginMutation.mutate();
    },
    onError: () => {
      if (!isOnline) {
        setNetworkingError("Check your internet connection.");
      } else {
        setUsernameError("The username is already taken.");
        setNetworkingError("");
      }
    }
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
    if (hasValidEmail &&
      !hasPasswordError() &&
      usernameError === "" &&
      username.trim().length !== 0 &&
      password === confirmPassword
    ) {
      // Attempt to create the account
      createAccountMutation.mutate();
    }
  };

  const Requirement = ({ met, message }: { met: boolean; message: string; }) =>
    <Row className="items-center gap-1">
      {met ? <IconCheck /> : <IconWarningOutline color="#EC7070" />}
      <p className={met ? "text-green" : "text-error"}>
        {message}
      </p>
    </Row>;


  return (
    <ClosableModal id={id} leftContent={<h4>Sign Up</h4>}>
      <Row className="w-[436px] gap-1 my-4">
        <p>Already have an account?</p>
        <p
          className="underline text-secondary hover:cursor-pointer font-semibold"
          onClick={onLoginClick}>
          Log In
        </p>
      </Row>
      <div className="bg-gray-100 w-full h-[1px]" />
      <Column className="gap-4 my-6">
        <TextArea
          title="Username"
          value={username}
          onChangeValue={setUsername}
          errorText={usernameError}
          hasError={usernameError !== ""}
        />
        <TextArea
          title="Email Address"
          value={email}
          onChangeValue={setEmail}
          hasError={!validEmail}
          errorText="Email address is invalid."
        />
        <Column>
          <TextArea
            title="Password:"
            value={password}
            onChangeValue={setPassword}
            type="password"
          />
          {password.length !== 0 || triedSubmit &&
            <>
              <p className={hasPasswordError() ? "text-error" : "text-green"} >
                {hasPasswordError() ? "Your password does not meet one of the following:" : "Your password meets all of the following:"}
              </p>
              <Column className="gap-1 mt-1">
                <Requirement
                  met={isLongEnough}
                  message="Password must be at least 8 characters long"
                />
                <Requirement
                  met={hasNumber}
                  message="Password must contain at least 1 uppercase letter"
                />
                <Requirement
                  met={hasUppercase}
                  message="Password must contain at least 1 number"
                />
              </Column>
            </>
          }
        </Column>
        <TextArea
          title="Confirm Password:"
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
        icon={loginMutation.isLoading || createAccountMutation.isLoading ? <Spinner variaton="SMALL" /> : undefined}
      />
      {netorkingError && <p className="text-error my-6">{netorkingError}</p>}
    </ClosableModal>
  );
}

