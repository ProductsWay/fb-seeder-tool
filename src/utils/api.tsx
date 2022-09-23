import { invoke } from "@tauri-apps/api";
import pForever from "p-forever";

import logger from "./logger";

export type FacebookPageItem = {
  id: number;
  page_token: string;
};

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
    pages: data as Array<FacebookPageItem>,
    nextCursor: paging?.cursors?.after,
  };
}

export async function getAllPages(token: string) {
  const result: FacebookPageItem[] = [];

  let nextCursor = "";
  await pForever(async (isEnd) => {
    if (isEnd) {
      return pForever.end;
    }

    const data = await getFacebookPages(token, nextCursor);
    nextCursor = data.nextCursor;
    result.push(...data.pages);
    return !data.nextCursor;
  });

  return result;
}

export type FacebookGroupItem = {
  id: number;
  name: string;
  link: string;
  description?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
};

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
    groups: data as Array<FacebookGroupItem>,
    nextCursor: paging?.cursors?.after,
  };
}

export async function getAllGroups(token: string) {
  const result: FacebookGroupItem[] = [];

  let nextCursor = "";
  await pForever(async (isEnd) => {
    if (isEnd) {
      return pForever.end;
    }

    const data = await getFacebookGroup(token, nextCursor);
    nextCursor = data.nextCursor;
    result.push(...data.groups);
    return !data.nextCursor;
  });

  return result;
}
