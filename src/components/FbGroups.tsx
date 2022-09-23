import { useAtom } from "jotai";

import {
  favoriteFacebookIdsAtom,
  isSelected,
  selectedFacebookIdsAtom,
} from "../store";
import { FacebookGroupItem } from "../utils/api";
import AssignTag from "./AssignTag";

// only scan fb group or page once
export const FbGroups = ({ groups }: { groups: Array<FacebookGroupItem> }) => {
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
  const [favoriteIds, setFavoriteIds] = useAtom(favoriteFacebookIdsAtom);

  if (groups.length === 0) {
    return <progress className="progress w-56"></progress>;
  }

  return (
    <div className="mb-20 grid w-full items-center justify-center gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Show all pages */}
      {groups.map((group) => (
        <div
          key={group.id}
          className={
            favoriteIds.includes(group.id)
              ? "card mx-auto w-full bg-yellow-200 shadow-xl"
              : "card mx-auto w-full bg-base-100 shadow-xl"
          }
        >
          <div>
            <button
              onClick={() =>
                setFavoriteIds(
                  favoriteIds.includes(group.id)
                    ? favoriteIds.filter((id) => id !== group.id)
                    : [...favoriteIds, group.id]
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>
          {group.picture?.data?.url && (
            <figure>
              <img src={group.picture?.data?.url} alt={group.name} />
            </figure>
          )}
          <div className="card-body items-center text-center">
            <a
              className="link link-accent"
              href={"https://facebook.com/" + group.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h2 className="card-title">{group.name}</h2>
            </a>

            <div className="card-actions justify-end">
              <div className="flex flex-1 justify-end px-2">
                <div className="mx-auto flex flex-col items-stretch justify-center">
                  <a
                    onClick={() =>
                      setIds(
                        isSelected(ids, group)
                          ? ids.filter(
                              (id) => id !== `${group.id}|${group.name}`
                            )
                          : [...ids, `${group.id}|${group.name}`]
                      )
                    }
                    className="btn btn-primary"
                  >
                    {isSelected(ids, group) ? "Remove" : "Add"}
                  </a>
                  <AssignTag />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
