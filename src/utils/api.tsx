import { invoke } from "@tauri-apps/api";

import logger from "./logger";

export async function getFacebookPages(token: string, after = "") {
  logger.info("get facebook pages", { token, after });
  const response = await invoke<string>("fb_pages", {
    token,
    after: after || "",
  });
  logger.info("get facebook pages response", response);
  const { data = [], paging, error } = JSON.parse(response);

  if (error) {
    return Promise.reject(error);
  }

  return {
    pages: data as Array<{
      id: number;
      page_token: string;
    }>,
    nextCursor: paging?.cursors?.after,
  };
}

export async function getFacebookGroup(token: string, after = "") {
  logger.info("get facebook group", { token, after });
  const response = await invoke<string>("fb_groups", {
    token,
    after: after || "",
  });
  logger.info("get facebook group response", response);
  const { data = [], paging, error } = JSON.parse(response);

  if (error) {
    return Promise.reject(error);
  }

  return {
    groups: data as Array<{
      id: number;
      name: string;
      link: string;
      description?: string;
      picture?: {
        data?: {
          url?: string;
        };
      };
    }>,
    nextCursor: paging?.cursors?.after,
  };
}
