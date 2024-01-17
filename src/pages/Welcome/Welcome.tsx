import Row from "../../components/layout/Row";
import HappinessAppText from "../../assets/happiness_app.svg";
import WelcomeImg from "../../assets/welcome_placeholder.png";
import WelcomeJournal from "../../assets/welcome_journal.png";
import WelcomeTrack from "../../assets/welcome_track.png";
import WelcomeShare from "../../assets/welcome_share.svg";
import SignIn from "../SignIn/SignIn";
import Column from "../../components/layout/Column";

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
    ["Journal", "Keep secure journal entries", WelcomeJournal],
    ["Track", "View interesting trends and data", WelcomeTrack],
    ["Share", "Learn about yourself and your friends happiness", WelcomeShare],
  ];

  return (
    <div>
      <Row className="bg-light_yellow pb-5 pl-28 pr-12 pt-8">
        <img src={HappinessAppText} />
        <div className="flex-grow"></div>
        <SignIn signUp={false} />
      </Row>
      <Row className="items-center bg-light_yellow py-32 pl-28 pr-12">
        <Column className="pr-14">
          <p className="text-5xl mb-12 font-extrabold text-secondary">
            Begin Your <br /> Happiness Journey.
          </p>
          <SignIn signUp={true} />
        </Column>
        <div className="flex-grow"></div>
        <img src={WelcomeImg} className="min-h-[450px]" />
      </Row>
      <Row className="relative -top-12 rounded-t-[60px] bg-white py-32 pl-28 pr-12">
        <Column className="pr-14">
          <p className="text-5xl mb-4 font-extrabold text-secondary">
            Our Key Features
          </p>
          <h2 className="font-normal text-gray-600">
            <span className="font-bold text-secondary">
              Elevating mindfulness and <br /> community
            </span>{" "}
            are the key of our app.
          </h2>
        </Column>
        <div className="flex-grow"></div>
        <Column className="gap-y-16">
          {features.map((feature, i) => (
            <FeatureCard
              title={feature[0]}
              description={feature[1]}
              icon={feature[2]}
            />
          ))}
        </Column>
      </Row>
      <Row className="items-center py-32 pl-28 pr-12">
        <Column className="pr-14">
          <p className="text-5xl mb-12 font-extrabold text-secondary">
            Private Journals
          </p>
          <h2 className="font-normal text-gray-600">
            Keep your most sensitive logs private using <br />
            <span className="font-bold text-secondary">
              encryption technology.
            </span>{" "}
            Enjoy the best <br /> privacy with Happiness App.
          </h2>
        </Column>
        <div className="flex-grow"></div>
      </Row>
    </div>
  );
}
