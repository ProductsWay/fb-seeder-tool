import { Button, LoadingOverlay } from "@mantine/core";
import { Provider } from "jotai";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";
import useLocalStorageState from "use-local-storage-state";

import { NoteViewer } from "./NoteViewer";
import { SettingForm } from "./SettingForm";
import { Welcome } from "./Welcome";
import {
  FacebookGroupItem,
  FacebookPageItem,
  getAllGroups,
  getAllPages,
  publishToPage,
} from "./utils/api";
import { selectedFBPages } from "./utils/emitter";
import logger from "./utils/logger";

function App() {
  const [route, setRoute] = useState<"main" | "form" | "editor">("main");
  const [pageAccessToken] = useLocalStorageState<Record<string, string>>(
    `pageAccessToken`,
    {
      defaultValue: {},
    }
  );

  const [, setPages] = useLocalStorageState<FacebookPageItem[]>("pages", {
    defaultValue: [],
  });
  const [, setGroups] = useLocalStorageState<FacebookGroupItem[]>("groups", {
    defaultValue: [],
  });
  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });

  const fetchAllFacebookPagesAndGroups = async (token: string) => {
    setVisible(true);
    setAccessToken(token);
    logger.info(token);
    try {
      const [pages, groups] = await Promise.all([
        getAllPages(token),
        getAllGroups(token),
      ]);
      setPages(pages);
      setGroups(groups);
    } catch (error) {
      logger.error(error);
    } finally {
      setVisible(false);
    }
  };

  const onPublishPage = async (msg: string) => {
    try {
      // TODO: use user token for publish to group
      selectedFBPages.value.forEach((pageId) => {
        logger.warn("page id", pageId);
        const pageToken = pageAccessToken[pageId];
        if (pageToken) {
          const toastId = toast.loading("Publishing to page:" + pageId);
          publishToPage(pageToken, {
            msg,
            pageId,
          })
            .then(() => {
              toast.success("Pubished to page " + pageId);
              toast.dismiss(toastId);
            })
            .catch(logger.error);
        }
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Provider>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <button className="btn" onClick={resetErrorBoundary}>
              Try again
            </button>
          </div>
        )}
      >
        <Toaster />
        <div className="min-h-screen w-full bg-base-200">
          <LoadingOverlay visible={visible} overlayBlur={2} />
          <div className="navbar bg-base-100 justify-center">
            <a className="btn btn-ghost text-xl normal-case">
              FB Seeder - Effortless Facebook Seeding Tool
            </a>
            <Button
              variant="white"
              onClick={() => {
                setRoute("editor");
                fetchAllFacebookPagesAndGroups(accessToken);
              }}
            >
              Reload
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </Button>
          </div>

          {route === "editor" && <NoteViewer onSubmit={onPublishPage} />}
          {route === "form" && (
            <SettingForm
              onSubmitHandler={(data) => {
                fetchAllFacebookPagesAndGroups(data.accessToken);
                setRoute("editor");
              }}
            />
          )}
          {route === "main" && <Welcome onClick={() => setRoute("form")} />}

          <div className="btm-nav">
            <button
              onClick={() => setRoute("main")}
              className={route === "main" ? "active" : ""}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
            <button
              onClick={() => setRoute("editor")}
              className={route === "editor" ? "active" : ""}
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => setRoute("form")}
              className={route === "form" ? "active" : ""}
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
