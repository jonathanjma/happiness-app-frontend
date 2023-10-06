import { HappinessRepository } from "../data/repositories/HappinessRepository";

export default function Entries({
  happinessRepository,
}: {
  happinessRepository: HappinessRepository;
}) {
  const { data } = happinessRepository.getHappiness();
  return (
    <div>
      <p className="text-black">Hello world!</p>
    </div>
  );
}
