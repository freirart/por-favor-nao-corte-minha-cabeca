import { capitalizeStr } from "../../server/src/Core/utils";
import { Characters } from "../../server/src/Entities/Character";

const getImages = () => {
  const obj = {};

  const { characters, getAvailableActions } = Characters;

  const charactersNames = characters.map((c) => c.normalizedName);
  const actions = getAvailableActions();

  for (const action of actions) {
    const key = `${action}Card`;
    const value = new URL(`./card-${action}.png`, import.meta.url).href;
    obj[key] = value;
  }

  for (const name of charactersNames) {
    const key = `${name}Card`;
    const iconKey = `${name}Icon`;
    const escalpoKey = `escalpo${capitalizeStr(name)}Card`;

    const value = new URL(`./card-${name}.png`, import.meta.url).href;
    const iconValue = new URL(`./icon-${name}.png`, import.meta.url).href;
    const escalpoValue = new URL(`./card-escalpo-${name}.png`, import.meta.url)
      .href;

    obj[key] = value;
    obj[iconKey] = iconValue;
    obj[escalpoKey] = escalpoValue;
  }

  return obj;
};

const IMAGES = getImages();

export default IMAGES;
