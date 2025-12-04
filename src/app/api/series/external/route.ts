import { handleError, success } from "@/lib/api-response";
import { parseSearchParams } from "@/lib/validation";
import { searchAniList } from "@/modules/series/sources";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().min(2, "query too short"),
  take: z.coerce.number().min(1).max(20).optional().default(10),
});

export async function GET(request: Request) {
  try {
    const { q, take } = parseSearchParams(new URL(request.url).searchParams, querySchema);
    const results = await searchAniList(q, take);
    return success({
      results: results.map((item) => ({
        id: item.id,
        title: item.title.english || item.title.romaji || item.title.native,
        format: item.format,
        episodes: item.episodes,
        chapters: item.chapters,
        genres: item.genres,
        popularity: item.popularity,
        averageScore: item.averageScore,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
