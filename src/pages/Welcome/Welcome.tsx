import Row from "../../components/layout/Row";
import HappinessAppText from "../../assets/happiness_app.svg";
import JournalImg from "../../assets/journals_image.png";
// import GroupImg from "../../assets/groups_image.png";
import WelcomeImg from "../../assets/welcome_image.png";
import WelcomeJournal from "../../assets/welcome_journal.svg";
import WelcomeTrack from "../../assets/welcome_track.svg";
import WelcomeShare from "../../assets/welcome_share.svg";
import Column from "../../components/layout/Column";
import Button from "../../components/Button";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Row className="gap-x-8">
      <div className="max-h-[82px] rounded-2xl bg-medium_yellow p-5 shadow-md1">
        <img src={icon} className="max-w-[42px]" />
      </div>
      <Column>
        <h2 className="mb-3 font-bold text-secondary">{title}</h2>
        <h5 className="font-normal text-gray-600">{description}</h5>
      </Column>
    </Row>
  );
}

export default function Welcome() {
  const features = [
    {
      title: "Journal",
      description: "Keep secure journal entries",
      icon: WelcomeJournal,
    },
    {
      title: "Track",
      description: "View interesting trends and data",
      icon: WelcomeTrack,
    },
    {
      title: "Share",
      description: "Learn about yourself and your friends happiness",
      icon: WelcomeShare,
    },
  ];

  const openLogin = () => {
    window.HSOverlay.open(document.querySelector("#login-modal"));
  };

  const openSignUp = () => {
    window.HSOverlay.open(document.querySelector("#sign-up-modal"));
  };

  const openForgotPassword = () => {
    window.HSOverlay.open(document.querySelector("#forgot-pass-modal"));
  };

  return (
    <div>
      {/* Navbar */}
      <Row className="sticky top-0 z-10 justify-between rounded-b-2xl bg-light_yellow pb-5 pl-12 pr-12 pt-8 md:pl-28">
        <img src={HappinessAppText} className="pr-4" />
        <Button
          label="Log In"
          associatedModalId="login-modal"
          onClick={openLogin}
          variation="OUTLINED"
          classNameText="font-bold"
        />
      </Row>

      {/* Fixed Div */}
      <div className="radial fixed top-0 h-full w-full bg-light_yellow">
        <Row className="items-center justify-between py-32 pl-12 pr-28 md:pl-28">
          <Column className="basis-1/2 pr-14">
            <p className="mb-12 text-5xl font-extrabold text-secondary">
              Begin Your <br /> Happiness Journey.
            </p>
            <Button
              label="Get Started"
              associatedModalId="sign-in-modal"
              onClick={openSignUp}
              variation="FILLED"
              classNameBtn="h-auto bg-yellow px-7 py-5"
              classNameText="text-[22px]"
            />
          </Column>
          <img
            src={WelcomeImg}
            className="hidden max-h-[400px] max-w-[400px] basis-1/2 sm:block"
          />
        </Row>
      </div>

      {/* Div which scrolls on top of fixed div */}
      <div className="relative z-[5] mt-[60vh] md:mt-[70vh]">
        <Row className="flex-wrap justify-between rounded-t-[60px] bg-white py-32 pl-12 pr-12 shadow-[0_-4px_48px_0px_rgba(0,0,0,0.05)] md:pl-28">
          <Column className="basis-1/2 pb-10 pr-14">
            <p className="mb-4 text-5xl font-extrabold text-secondary">
              Our Key Features
            </p>
            <h2 className="mb-8 font-normal text-gray-600">
              <span className="font-bold text-secondary">
                Elevating mindfulness and community
              </span>{" "}
              are the key of our app.
            </h2>
            {/*<img*/}
            {/*  src={GroupImg}*/}
            {/*  className="hidden max-w-[300px] basis-1/2 sm:block"*/}
            {/*/>*/}
          </Column>
          <Column className="basis-1/2 gap-y-16">
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </Column>
        </Row>
        <Row className="items-center justify-between bg-white pb-32 pl-12 pr-28 md:pl-28">
          <Column className="basis-1/2 pr-14">
            <h2 className="mb-4 font-normal text-secondary">
              Introducing
              <p className="text-5xl font-extrabold">Private Journals</p>
            </h2>
            <h4 className="font-normal text-gray-600">
              Keep your most sensitive logs private using <br />
              <span className="font-bold text-secondary">
                encryption technology.
              </span>{" "}
              Enjoy the best privacy with Happiness App.
            </h4>
          </Column>
          <img
            src={JournalImg}
            className="hidden max-h-[300px] max-w-[300px] basis-1/2 sm:block"
          />
        </Row>
      </div>
      <ForgotPasswordModal id="forgot-pass-modal" onLoginClick={openLogin} />
      <SignUpModal id="sign-up-modal" onLoginClick={openLogin} />
      <LoginModal
        id="login-modal"
        onCreateAccountClick={openSignUp}
        onForgotPassword={openForgotPassword}
      />
    </div>
  );
}
