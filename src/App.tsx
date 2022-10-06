import { DevTool } from "@hookform/devtools";
import { Button, LoadingOverlay } from "@mantine/core";
import { Provider, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Controller, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

import { FbGroups } from "./components/FbGroups";
import { FbPages } from "./components/FbPages";
import SimpleEditor from "./components/SimpleEditor";
import { Stats } from "./components/Stats";
import Tags from "./components/Tags";
import { isSelected, selectedFacebookIdsAtom } from "./store";
import {
  FacebookGroupItem,
  FacebookPageItem,
  getAllGroups,
  getAllPages,
} from "./utils/api";
import logger from "./utils/logger";

const NoteViewer = () => {
  const [tab, setTab] = useState<"group" | "page">("group");
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
  const [pages] = useLocalStorageState("pages", {
    defaultValue: [],
  });
  const [groups] = useLocalStorageState("groups", {
    defaultValue: [],
  });

  const onChange = (editorState: string) => {
    logger.info(`onChange: ${editorState}`);
  };

  return (
    <div className="mx-auto flex flex-col px-4 py-8">
      <div className="mx-auto flex flex-row gap-2 px-4 py-8">
        <Stats totalGroups={groups.length} totalPages={pages.length} />

        <div className="flex flex-col">
          <SimpleEditor
            onSubmitHandler={(formData) => onChange(formData.body)}
            hasSelected={ids.length > 0}
          />
          {/* Show the selected page/group and submit button */}
          <div className="grid grid-cols-2 gap-4">
            {ids.length > 0 &&
              ids?.map((id) => (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      logger.info(id);
                      const [groupId, groupName] = id.split("|");
                      const group: { id: number; name: string } = {
                        id: Number(groupId),
                        name: groupName,
                      };
                      setIds(
                        isSelected(ids, group)
                          ? ids.filter(
                              (fid) => fid !== `${group.id}|${group.name}`
                            )
                          : [...ids, `${group.id}|${group.name}`]
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-4 w-4 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  <a
                    className="link link-accent"
                    href={"https://facebook.com/" + id.split("|")[0]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="badge">{id.split("|")[1]}</span>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="tabs">
        <a
          onClick={() => setTab("group")}
          className={
            tab === "group" ? "tab tab-active tab-lifted" : "tab tab-lifted"
          }
        >
          My Groups
        </a>
        <a
          onClick={() => setTab("page")}
          className={
            tab === "page" ? "tab tab-active tab-lifted" : "tab tab-lifted"
          }
        >
          My Pages
        </a>
      </div>
      <div className="mt-2 bg-base-200 py-2">
        {tab === "group" ? (
          <FbGroups groups={groups} />
        ) : (
          <FbPages pages={pages} />
        )}
      </div>
    </div>
  );
};

type FormValues = {
  accessToken: string;
  tags: string;
};

function SettingForm({
  onSubmitHandler,
}: {
  onSubmitHandler: (data: FormValues) => void;
}) {
  const [accessToken, setAccessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });
  const [list, setList] = useLocalStorageState("list", {
    defaultValue: "",
  });

  const { register, handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      accessToken,
      tags: list,
    },
  });
  const onSubmit = handleSubmit((data: FormValues) => onSubmitHandler(data));

  const token = watch("accessToken");
  const tags = watch("tags");

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  useEffect(() => {
    setList(tags);
  }, [tags]);

  return (
    <div className="mx-auto flex h-64 flex-col items-center justify-center">
      <DevTool control={control} placement={"top-right"} />
      <form className="container mt-4 max-w-md p-4" onSubmit={onSubmit}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Access Token</span>

            <div className="tooltip" data-tip="Create a new access token">
              <a
                rel="noopener noreferrer"
                className="btn btn-info"
                target="_blank"
                href="https://developers.facebook.com/tools/accesstoken/"
              >
                Generate
              </a>
            </div>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Place your access token"
            defaultValue={accessToken}
            {...register("accessToken", {
              required: true,
            })}
          />
        </div>

        <div className="form-control w-full">
          <Controller
            name="tags"
            control={control}
            defaultValue={tags}
            render={({ field }) => <Tags {...field} />}
          />
        </div>

        <div className="form-control mt-4 w-full">
          <button className="btn" type="submit">
            Save & Scan{"  "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

function Welcome({ onClick }: { onClick: () => void }) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">Effortless Facebook Seeding Tool</p>
          <button onClick={onClick} className="btn btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState<"main" | "form" | "editor">("main");
  const [, setPages] = useLocalStorageState<FacebookPageItem[]>("pages", {
    defaultValue: [],
  });
  const [, setGroups] = useLocalStorageState<FacebookGroupItem[]>("groups", {
    defaultValue: [],
  });
  const [visible, setVisible] = useState(false);
  const [accessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });

  const fetchAllFacebookPagesAndGroups = async (token: string) => {
    setVisible(true);
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

  return (
    <Provider>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <button className="btn" onClick={() => resetErrorBoundary()}>
              Try again
            </button>
          </div>
        )}
      >
        <div className="min-h-screen w-full bg-base-200">
          <LoadingOverlay visible={visible} overlayBlur={2} />
          <div className="navbar bg-base-100 justify-center">
            <a className="btn btn-ghost text-xl normal-case">
              FB Seeder - Effortless Facebook Seeding Tool
            </a>
            <Button
              variant="white"
              onClick={() => fetchAllFacebookPagesAndGroups(accessToken)}
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

          {route === "editor" && <NoteViewer />}
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
