/**
 * Instagram Graph API client (Business / Creator accounts).
 * Requires a long-lived Page access token with instagram_basic,
 * instagram_content_publish, instagram_manage_comments, pages_read_engagement.
 */

const GRAPH = "https://graph.facebook.com/v21.0";

export type IgProfile = {
  id: string;
  username: string;
  name?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  profile_picture_url?: string;
};

export type IgInsight = {
  name: string;
  values: { value: number }[];
};

async function graph<T>(
  path: string,
  token: string,
  init?: RequestInit & { search?: Record<string, string> }
): Promise<T> {
  const url = new URL(`${GRAPH}${path}`);
  url.searchParams.set("access_token", token);
  if (init?.search) {
    Object.entries(init.search).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    method: init?.method || "GET",
    headers: init?.body
      ? { "Content-Type": "application/json", ...(init.headers || {}) }
      : init?.headers,
    body: init?.body,
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    const msg = json.error?.message || res.statusText || "Instagram API error";
    throw new Error(msg);
  }
  return json as T;
}

export async function getIgProfile(igUserId: string, token: string): Promise<IgProfile> {
  return graph<IgProfile>(`/${igUserId}`, token, {
    search: {
      fields: "id,username,name,followers_count,follows_count,media_count,profile_picture_url",
    },
  });
}

export async function getIgInsights(
  igUserId: string,
  token: string,
  metrics = "reach,impressions,profile_views"
) {
  try {
    return await graph<{ data: IgInsight[] }>(`/${igUserId}/insights`, token, {
      search: {
        metric: metrics,
        period: "day",
        metric_type: "total_value",
      },
    });
  } catch {
    return { data: [] as IgInsight[] };
  }
}

/** Create + publish a single image post. Media URL must be publicly reachable by Meta. */
export async function publishImagePost(
  igUserId: string,
  token: string,
  imageUrl: string,
  caption: string
): Promise<{ id: string }> {
  const container = await graph<{ id: string }>(`/${igUserId}/media`, token, {
    method: "POST",
    search: {
      image_url: imageUrl,
      caption,
    },
  });

  for (let i = 0; i < 8; i++) {
    const status = await graph<{ status_code?: string; status?: string }>(
      `/${container.id}`,
      token,
      { search: { fields: "status_code,status" } }
    );
    const code = status.status_code || status.status;
    if (code === "FINISHED" || code === "PUBLISHED") break;
    if (code === "ERROR" || code === "EXPIRED") {
      throw new Error(`Media container failed: ${code}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  return graph<{ id: string }>(`/${igUserId}/media_publish`, token, {
    method: "POST",
    search: { creation_id: container.id },
  });
}

export async function fetchRecentMediaComments(
  igUserId: string,
  token: string,
  limit = 12
): Promise<
  {
    mediaId: string;
    commentId: string;
    username: string;
    text: string;
    timestamp: string;
  }[]
> {
  const media = await graph<{ data: { id: string }[] }>(`/${igUserId}/media`, token, {
    search: { fields: "id", limit: String(Math.min(limit, 10)) },
  });

  const out: {
    mediaId: string;
    commentId: string;
    username: string;
    text: string;
    timestamp: string;
  }[] = [];

  for (const m of media.data || []) {
    try {
      const comments = await graph<{
        data: { id: string; text: string; username: string; timestamp: string }[];
      }>(`/${m.id}/comments`, token, {
        search: { fields: "id,text,username,timestamp", limit: "25" },
      });
      for (const c of comments.data || []) {
        out.push({
          mediaId: m.id,
          commentId: c.id,
          username: c.username,
          text: c.text,
          timestamp: c.timestamp,
        });
      }
    } catch {
      // skip
    }
  }
  return out;
}

export async function replyToIgComment(
  commentId: string,
  token: string,
  message: string
): Promise<{ id: string }> {
  return graph<{ id: string }>(`/${commentId}/replies`, token, {
    method: "POST",
    search: { message },
  });
}

export function hasGlobalIgConfig() {
  return Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_BUSINESS_ACCOUNT_ID);
}

export function globalIgCreds() {
  return {
    token: process.env.IG_ACCESS_TOKEN || "",
    igUserId: process.env.IG_BUSINESS_ACCOUNT_ID || "",
  };
}
