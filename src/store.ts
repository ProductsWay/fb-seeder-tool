import { atom } from "jotai";

type FacebookId = number;
type FacebookName = string;
type FacebookEntity = `${FacebookId}|${FacebookName}`;

export const selectedFacebookIdsAtom = atom<FacebookEntity[]>([]);
export const favoriteFacebookIdsAtom = atom<number[]>([]);

// TODO: refactor to read-only atom
export const isSelected = (
  selectedEntities: FacebookEntity[],
  entity: { id: number; name: string },
) =>
  selectedEntities.some(
    (selectedEntity) => selectedEntity.split("|")[0] === entity.id.toString(),
  );
