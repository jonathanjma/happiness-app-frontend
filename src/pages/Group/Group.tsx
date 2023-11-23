import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Group } from "../../data/models/Group";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import SettingsIcon from "../../assets/settings.svg";
import PostIcon from "../../assets/post.svg";
import GraphIcon from "../../assets/graph.svg";
import TableIcon from "../../assets/table.svg";

export default function Group() {
  const { groupID } = useParams();
  const { api } = useApi();
  const {
    isLoading: isLoadingGI,
    data: dataGI,
    isError: isErrorGI,
  } = useQuery<Group>("get group " + groupID, () =>
    api.get<Group>("/group/" + groupID).then((res) => res.data),
  );

  const tabButtonClasses =
    "hs-tab-active:border-gray-800 hs-tab-active:text-gray-800 inline-flex items-center gap-x-2 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-dark_gray hs-tab-active:font-bold";

  return (
    <div className="mb-8 me-8 ms-10 mt-16">
      {isLoadingGI ? (
        <Spinner />
      ) : (
        <>
          {isErrorGI ? (
            <p className="m-3 text-xl font-medium">
              Error: Could not load groups.
            </p>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 flex w-full justify-between">
                <p className="m-0 self-center text-3xl font-semibold">
                  {dataGI!.name}
                </p>
                <button className="shadow-md1 bg-light_yellow2 rounded-xl px-3 py-2">
                  <img src={SettingsIcon} className="max-w-[24px]" />
                </button>
              </div>
              {/* Tabs */}
              <div>
                <nav aria-label="Tabs" role="tablist">
                  <button
                    type="button"
                    className={tabButtonClasses + " active"}
                    id="tab-1"
                    data-hs-tab="#tab-panel-1"
                    aria-controls="tab-panel-1"
                    role="tab"
                  >
                    <img src={PostIcon} className="m-1 max-w-[18px]" />
                    FEED
                  </button>
                  <button
                    type="button"
                    className={tabButtonClasses}
                    id="tab-2"
                    data-hs-tab="#tab-panel-2"
                    aria-controls="tab-panel-2"
                    role="tab"
                  >
                    <img src={GraphIcon} className="m-1 max-w-[18px]" />
                    GRAPH
                  </button>
                  <button
                    type="button"
                    className={tabButtonClasses}
                    id="tab-3"
                    data-hs-tab="#tab-panel-3"
                    aria-controls="tab-panel-3"
                    role="tab"
                  >
                    <img src={TableIcon} className="m-1 max-w-[18px]" />
                    TABLE
                  </button>
                </nav>
              </div>

              <div className="mt-3">
                <div id="tab-panel-1" role="tabpanel" aria-labelledby="tab-1">
                  <p className="text-gray-500">
                    This is the{" "}
                    <em className="text-gray-800 font-semibold">first</em>{" "}
                    item's tab body.
                  </p>
                </div>
                <div
                  id="tab-panel-2"
                  className="hidden"
                  role="tabpanel"
                  aria-labelledby="tab-2"
                >
                  <p className="text-gray-500">
                    This is the{" "}
                    <em className="text-gray-800 font-semibold">second</em>{" "}
                    item's tab body.
                  </p>
                </div>
                <div
                  id="tab-panel-3"
                  className="hidden"
                  role="tabpanel"
                  aria-labelledby="tab-3"
                >
                  <p className="text-gray-500">
                    This is the{" "}
                    <em className="text-gray-800 font-semibold">third</em>{" "}
                    item's tab body.
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
