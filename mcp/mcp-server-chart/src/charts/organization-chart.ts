import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, TextureSchema, ThemeSchema, WidthSchema } from "./base";
import { ValidateError } from "../utils/validator";

// The recursive schema is not supported by gemini, and other clients, so we use a non-recursive schema which can represent a tree structure with a fixed depth.
// Ref: https://github.com/antvis/mcp-server-chart/issues/155
// Ref: https://github.com/antvis/mcp-server-chart/issues/132

// Function to count nodes in organization chart data
const countOrganizationChartNodes = (data: any): number => {
  let count = 1; // Count the current node
  if (data.children) {
    for (const child of data.children) {
      count += countOrganizationChartNodes(child);
    }
  }
  return count;
};

// Function to validate organization chart node count
const validateOrganizationChartNodeCount = (data: any) => {
  const nodeCount = countOrganizationChartNodes(data);
  if (nodeCount > 31) {
    throw new ValidateError(
      "Invalid parameters: organization chart data cannot exceed 31 nodes."
    );
  }
  return true;
};

const OrganizationChartNodeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  children: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        children: z
          .array(
            z.object({
              name: z.string(),
              description: z.string().optional(),
              children: z
                .array(
                  z.object({
                    name: z.string(),
                    description: z.string().optional(),
                  }),
                )
                .optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

const schema = {
  data: OrganizationChartNodeSchema.describe(
    "Data for organization chart which is a hierarchical structure, such as, { name: 'CEO', description: 'Chief Executive Officer', children: [{ name: 'CTO', description: 'Chief Technology Officer', children: [{ name: 'Dev Manager', description: 'Development Manager' }] }] }, and the maximum depth is 3."
  ).refine(validateOrganizationChartNodeCount, {
    message: "Invalid parameters: organization chart data cannot exceed 31 nodes.",
    path: ["data"],
  }),
  orient: z
    .enum(["horizontal", "vertical"])
    .default("vertical")
    .describe(
      "Orientation of the organization chart, either horizontal or vertical. Default is vertical, when the level of the chart is more than 3, it is recommended to use horizontal orientation.",
    ),
  style: z
    .object({
      texture: TextureSchema,
    })
    .optional()
    .describe("Custom style configuration for the chart."),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
};

const tool = {
  name: "generate_organization_chart",
  description:
    "Generate an organization chart to visualize the hierarchical structure of an organization, such as, a diagram showing the relationship between a CEO and their direct reports.",
  inputSchema: zodToJsonSchema(schema),
};

export const organizationChart = {
  schema,
  tool,
};
