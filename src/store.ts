import { atom } from "jotai";

import emitter from "./utils/emitter";
import logger from "./utils/logger";

type FacebookId = number;
type FacebookName = string;
type FacebookEntity = `${FacebookId}|${FacebookName}`;

export const selectedFacebookIdsAtom = atom<FacebookEntity[]>([]);
export const favoriteFacebookIdsAtom = atom<number[]>([]);

// TODO: refactor to read-only atom
export const isSelected = (
  selectedEntities: FacebookEntity[],
  entity: { id: number; name: string }
) => {
  return selectedEntities.some(
    (selectedEntity) => selectedEntity.split("|")[0] === entity.id.toString()
  );
};

// TODO: refactor to handle the pub-sub event
emitter.on("page", (page) => {
  logger.info(`page`, page);
});

emitter.on("group", (group) => {
  logger.info(`group`, group);
});
