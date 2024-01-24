import Row from "../../components/layout/Row";
import HappinessAppText from "../../assets/happiness_app.svg";
import WelcomeImg from "../../assets/welcome_placeholder.png";
import WelcomeJournal from "../../assets/welcome_journal.svg";
import WelcomeTrack from "../../assets/welcome_track.svg";
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

  return (
    <div>
      <Row
        className="justify-between bg-light_yellow pb-5 pl-28 pr-12 pt-8"
        id="bar"
      >
        <img src={HappinessAppText} />
        <SignIn signUp={false} />
      </Row>
      <div id="wrapped">
        <div className="panels" id="fixed">
          <Row className="items-center justify-between bg-light_yellow py-32 pl-28 pr-12">
            <Column className="pr-14">
              <p className="mb-12 text-5xl font-extrabold text-secondary">
                Begin Your <br /> Happiness Journey.
              </p>
              <SignIn signUp={true} />
            </Column>
            <img src={WelcomeImg} className="min-h-[450px] rounded-3xl" />
          </Row>
        </div>

        <div className="panels" id="overlay">
          <Row className="justify-between rounded-t-[60px] bg-white py-32 pl-28 pr-12">
            {/*relative -top-12 */}
            <Column className="basis-1/2 pr-14">
              <p className="mb-4 text-5xl font-extrabold text-secondary">
                Our Key Features
              </p>
              <h2 className="font-normal text-gray-600">
                <span className="font-bold text-secondary">
                  Elevating mindfulness and community
                </span>{" "}
                are the key of our app.
              </h2>
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
          <Row className="items-center justify-between bg-white pb-32 pl-28 pr-12">
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
          </Row>
        </div>
      </div>
    </div>
  );
}
