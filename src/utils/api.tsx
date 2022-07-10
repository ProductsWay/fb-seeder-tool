import { invoke } from "@tauri-apps/api";

export async function getFacebookPages(token: string, after = "") {
  const response = await invoke<string>("fb_pages", { token, after });
  const { data, paging } = JSON.parse(response);

  return {
    pages: data as Array<{
      id: number;
      page_token: string;
    }>,
    nextCursor: paging?.cursors?.after,
  };
}

export async function getFacebookGroup(token: string, after = "") {
  const response = await invoke<string>("fb_groups", { token, after });
  const { data, paging } = JSON.parse(response);

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
