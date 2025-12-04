import { z } from "zod";

const aniListEndpoint = "https://graphql.anilist.co";

const aniListSearchSchema = z.object({
  query: z.string(),
  page: z.number().default(1),
  perPage: z.number().default(10),
});

const aniListResponseSchema = z.object({
  data: z.object({
    Page: z.object({
      media: z.array(
        z.object({
          id: z.number(),
          title: z.object({
            romaji: z.string().optional(),
            english: z.string().optional(),
            native: z.string().optional(),
          }),
          format: z.string().optional(),
          episodes: z.number().nullable().optional(),
          chapters: z.number().nullable().optional(),
          genres: z.array(z.string()).optional(),
          popularity: z.number().optional(),
          averageScore: z.number().nullable().optional(),
        }),
      ),
    }),
  }),
});

export type AniListMedia = z.infer<typeof aniListResponseSchema>["data"]["Page"]["media"][number];

export async function searchAniList(query: string, perPage = 10): Promise<AniListMedia[]> {
  const parsed = aniListSearchSchema.parse({ query, perPage, page: 1 });
  const payload = {
    query: `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(search: $search, type_in: [ANIME, MANGA], sort: POPULARITY_DESC) {
            id
            title { romaji english native }
            format
            episodes
            chapters
            genres
            popularity
            averageScore
          }
        }
      }
    `,
    variables: { search: parsed.query, page: parsed.page, perPage: parsed.perPage },
  };

  const res = await fetch(aniListEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`AniList request failed: ${res.status}`);
  }

  const json = await res.json();
  const parsedResp = aniListResponseSchema.safeParse(json);
  if (!parsedResp.success) {
    throw new Error("Unexpected AniList response shape");
  }
  return parsedResp.data.data.Page.media;
}
