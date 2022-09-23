import { useAtom } from "jotai";

import { isSelected, selectedFacebookIdsAtom } from "../store";
import { FacebookPageItem } from "../utils/api";

export const FbPages = ({ pages }: { pages: Array<FacebookPageItem> }) => {
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);

  if (pages.length === 0) {
    return <progress className="progress w-56"></progress>;
  }

  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-center items-center mb-20">
      {/* Show all pages */}
      {pages.map((page) => (
        <div
          key={page.id}
          className="mx-auto card card-side w-full h-44 bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <a
              className="link link-accent"
              href={"https://facebook.com/" + page.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h2 className="card-title">{page.page_token}</h2>
            </a>
            <div className="card-actions justify-end">
              <button
                onClick={() =>
                  setIds(
                    isSelected(ids, { id: page.id, name: page.page_token })
                      ? ids.filter(
                          (id) => id !== `${page.id}|${page.page_token}`
                        )
                      : [...ids, `${page.id}|${page.page_token}`]
                  )
                }
                className="btn btn-primary"
              >
                {isSelected(ids, { id: page.id, name: page.page_token })
                  ? "Remove"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
