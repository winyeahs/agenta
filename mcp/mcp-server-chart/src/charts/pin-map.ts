import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  MapHeightSchema,
  MapTitleSchema,
  MapWidthSchema,
} from "./base";

// Define a limited POIs schema with max limit
const LimitedPOIsSchema = z
  .array(z.string())
  .nonempty("At least one POI name is required.")
  .max(31, { message: "Pin map POIs cannot exceed 31 items." })
  .describe(
    'A list of keywords for the names of points of interest (POIs) in Chinese. These POIs usually contain a group of places with similar locations, so the names should be more descriptive, must adding attributives to indicate that they are different places in the same area, such as "北京市" is better than "北京", "杭州西湖" is better than "西湖"; in addition, if you can determine that a location may appear in multiple areas, you can be more specific, such as "杭州西湖的苏堤春晓" is better than "苏堤春晓". The tool will use these keywords to search for specific POIs and query their detailed data, such as latitude and longitude, location photos, etc. For example, ["西安钟楼", "西安大唐不夜城", "西安大雁塔"].',
  );

const schema = {
  title: MapTitleSchema,
  data: LimitedPOIsSchema,
  markerPopup: z
    .object({
      type: z.string().default("image").describe('Must be "image".'),
      width: z.number().default(40).describe("Width of the photo."),
      height: z.number().default(40).describe("Height of the photo."),
      borderRadius: z
        .number()
        .default(8)
        .describe("Border radius of the photo."),
    })
    .optional()
    .describe(
      "Marker type, one is simple mode, which is just an icon and does not require `markerPopup` configuration; the other is image mode, which displays location photos and requires `markerPopup` configuration. Among them, `width`/`height`/`borderRadius` can be combined to realise rectangular photos and square photos. In addition, when `borderRadius` is half of the width and height, it can also be a circular photo.",
    ),
  width: MapWidthSchema,
  height: MapHeightSchema,
};

// https://modelcontextprotocol.io/specification/2025-03-26/server/tools#listing-tools
const tool = {
  name: "generate_pin_map",
  description:
    "Generate a point map to display the location and distribution of point data on the map, such as the location distribution of attractions, hospitals, supermarkets, etc.",
  inputSchema: zodToJsonSchema(schema),
};

export const pinMap = {
  schema,
  tool,
};
