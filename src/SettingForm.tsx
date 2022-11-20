import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

import Tags from "./components/Tags";

export type FormValues = {
  accessToken: string;
  tags: string;
};

export function SettingForm({
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
    <div className="flex flex-col justify-center items-center mx-auto h-64">
      <DevTool control={control} placement={"top-right"} />
      <form className="container p-4 mt-4 max-w-md" onSubmit={onSubmit}>
        <div className="w-full form-control">
          <label className="label">
            <span className="label-text">User Access Token</span>

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

        <div className="w-full form-control">
          <Controller
            name="tags"
            control={control}
            defaultValue={tags}
            render={({ field }) => <Tags {...field} />}
          />
        </div>

        <div className="mt-4 w-full form-control">
          <button className="btn" type="submit">
            Save & Scan{"  "}
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
