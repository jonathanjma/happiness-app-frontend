import { useApi } from "../../contexts/ApiProvider";
import { Happiness } from "../../data/models/Happiness";
import Comments from "../Comments";
import Column from "../layout/Column";
import Row from "../layout/Row";
import CommentCardSkeleton from "../skeletons/CommentCardSkeleton";
import Modal from "./Modal";

export default function HappinessViewerModal({ happiness, id }: { happiness: Happiness, id: string; }) {
  const { api } = useApi();
  console.log(`JSON: ${JSON.stringify(happiness.author)}`);



  return (
    <Modal id={id}>
      <Column className="gap-6 w-[600px]">

        {/* Top row for closing */}
        <Row>
          <div className="flex flex-1" />
          <button data-hs-overlay={`#${id}`}>
            {/* TODO make this into a component, fix color */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0008 13.4L7.10078 18.3C6.91745 18.4834 6.68411 18.575 6.40078 18.575C6.11745 18.575 5.88411 18.4834 5.70078 18.3C5.51745 18.1167 5.42578 17.8834 5.42578 17.6C5.42578 17.3167 5.51745 17.0834 5.70078 16.9L10.6008 12L5.70078 7.10005C5.51745 6.91672 5.42578 6.68338 5.42578 6.40005C5.42578 6.11672 5.51745 5.88338 5.70078 5.70005C5.88411 5.51672 6.11745 5.42505 6.40078 5.42505C6.68411 5.42505 6.91745 5.51672 7.10078 5.70005L12.0008 10.6L16.9008 5.70005C17.0841 5.51672 17.3174 5.42505 17.6008 5.42505C17.8841 5.42505 18.1174 5.51672 18.3008 5.70005C18.4841 5.88338 18.5758 6.11672 18.5758 6.40005C18.5758 6.68338 18.4841 6.91672 18.3008 7.10005L13.4008 12L18.3008 16.9C18.4841 17.0834 18.5758 17.3167 18.5758 17.6C18.5758 17.8834 18.4841 18.1167 18.3008 18.3C18.1174 18.4834 17.8841 18.575 17.6008 18.575C17.3174 18.575 17.0841 18.4834 16.9008 18.3L12.0008 13.4Z" fill="black" />
            </svg>
          </button>
        </Row>

        {/* Profile and score row */}
        <Row className="items-center">
          {/* Profile picture */}
          <img className="w-[42px] h-[42px] rounded-full" src={happiness.author.profile_picture} />
          <div className="w-2" />
          {/* Name and time */}
          <Column>
            <p className="leading-6 text-gray-600 font-medium" >{happiness.author.username}</p>
            <label className="leading-4 text-gray-400 ">{new Date(happiness.timestamp).toLocaleDateString("en-us", { year: "2-digit", month: "2-digit", day: "2-digit" })}</label>
          </Column>
          <div className="flex flex-1" />
          {/* Score */}
          <h3 className="text-gray-600">{happiness.value.toFixed(1)}</h3>
        </Row>

        {/* Entry text */}
        <p className="text-gray-600">{happiness.comment}</p>

        {/* Comments */}
        <div>
          <Comments modalVariant associatedHappinessId={happiness.id} canAddComment={true} />
        </div>
      </Column>
    </Modal>
  );
}
