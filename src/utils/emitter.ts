import { signal } from "@preact/signals-react";
import mitt from "mitt";

import logger from "./logger";

export const selectedFBPages = signal<string[]>([]);

type Events = {
  group: string;
  page: string;
};

const emitter = mitt<Events>(); // inferred as Emitter<Events>

emitter.on("page", (pageId) => {
  logger.info("pageId", pageId);

  const allPages = selectedFBPages.value;
  if (allPages.includes(pageId)) {
    selectedFBPages.value = allPages.filter((page) => page !== pageId);
  } else {
    selectedFBPages.value.push(pageId);
  }
});

export default emitter;
