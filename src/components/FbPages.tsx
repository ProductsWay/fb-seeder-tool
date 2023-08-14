import { Button, Modal } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

import { isSelected, selectedFacebookIdsAtom } from "../store";
import { type FacebookPageItem } from "../utils/api";
import emitter from "../utils/emitter";
import logger from "../utils/logger";

type FormValues = {
  accessToken: string;
};

function FacebookPageSettingForm({
  onSubmitHandler,
  pageId,
}: {
  readonly onSubmitHandler: (data: FormValues) => void;
  readonly pageId: number;
}) {
  const [pageAccessToken, setPageAccessToken] = useLocalStorageState<
    Record<string, string>
  >(`pageAccessToken`, {
    defaultValue: {},
  });
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      accessToken: pageAccessToken?.[pageId] ?? "",
    },
  });
  const onSubmit = handleSubmit((data: FormValues) => {
    onSubmitHandler(data);
  });

  const token = watch("accessToken");

  useEffect(() => {
    setPageAccessToken({
      ...pageAccessToken,
      [pageId]: token,
    });
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center mx-auto">
      <form className="container max-w-md" onSubmit={onSubmit}>
        <div className="w-full form-control">
          <label className="label">
            <span className="label-text">Access Token</span>

            <div className="tooltip" data-tip="Create a new access token">
              <a
                rel="noopener noreferrer"
                className="btn btn-info"
                target="_blank"
                href="https://developers.facebook.com/tools/explorer/"
              >
                Generate
              </a>
            </div>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Place your access token"
            defaultValue={pageAccessToken?.[pageId] ?? ""}
            {...register("accessToken", {
              required: true,
            })}
          />
        </div>

        <div className="mt-4 w-full form-control">
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export function FbPages({ pages }: { readonly pages: FacebookPageItem[] }) {
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
  const [opened, setOpened] = useState<[boolean, number]>([false, 0]);

  if (pages.length === 0) {
    return <progress className="w-56 progress" />;
  }

  const onClose = () => {
    setOpened([false, 0]);
  };

  return (
    <>
      <Modal opened={opened[0]} title="Facebook Page Setting" onClose={onClose}>
        <FacebookPageSettingForm pageId={opened[1]} onSubmitHandler={onClose} />
      </Modal>
      <div className="grid gap-3 justify-center items-center mb-20 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Show all pages */}
        {pages.map((page) => (
          <div key={page.id} className="w-96 shadow-xl card bg-base-100">
            <div className="items-center text-center card-body">
              <a
                className="link link-accent"
                href={"https://facebook.com/" + page.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="card-title">{page.page_token}</h2>
              </a>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    logger.warn("fb page", page);
                    emitter.emit("page", page.id.toString());
                    setIds(
                      isSelected(ids, { id: page.id, name: page.page_token })
                        ? ids.filter(
                            (id) => id !== `${page.id}|${page.page_token}`,
                          )
                        : [...ids, `${page.id}|${page.page_token}`],
                    );
                  }}
                >
                  {isSelected(ids, { id: page.id, name: page.page_token })
                    ? "Remove"
                    : "Add"}
                </button>
                <Button
                  className="btn btn-secondary"
                  onClick={() => {
                    setOpened([true, page.id]);
                  }}
                >
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
                      d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.867 19.125h.008v.008h-.008v-.008z"
                    />
                  </svg>
                  Setting
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
