import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_TOKEN;

const configured = Boolean(projectId);

function missingConfigError() {
  return new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add Sanity environment variables before fetching content.",
  );
}

export const client = configured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token,
      perspective: "published",
    })
  : {
      fetch: async () => {
        throw missingConfigError();
      },
    };

const imageClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = createImageUrlBuilder(imageClient);

export function urlFor(source) {
  return builder.image(source);
}
