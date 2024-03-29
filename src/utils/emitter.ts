import { signal } from "@preact/signals-react";
import mitt from "mitt";

import logger from "./logger";

export const selectedFBPages = signal<string[]>([]);
export const selectedFbGroups = signal<string[]>([]);

type Events = {
  group: string;
  page: string;
};

const emitter = mitt<Events>(); // Inferred as Emitter<Events>

emitter.on("page", (pageId) => {
  logger.info("pageId", pageId);

  const allPages = selectedFBPages.value;
  if (allPages.includes(pageId)) {
    selectedFBPages.value = allPages.filter((page) => page !== pageId);
  } else {
    selectedFBPages.value.push(pageId);
  }
});

emitter.on("group", (groupId) => {
  logger.info("groupId", groupId);

  const allGroups = selectedFbGroups.value;
  if (allGroups.includes(groupId)) {
    selectedFbGroups.value = allGroups.filter((group) => group !== groupId);
  } else {
    selectedFbGroups.value.push(groupId);
  }
});

export default emitter;
