"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { mutate, readDB, uid } from "./store";
import type { LibraryKind, Role } from "./types";
import {
  fetchRecentMediaComments,
  getIgInsights,
  getIgProfile,
  globalIgCreds,
  publishImagePost,
  replyToIgComment,
} from "./instagram";

const SESSION = "igcc_session";

function revalidateAll() {
  [
    "/",
    "/dashboard",
    "/calendar",
    "/composer",
    "/library",
    "/analytics",
    "/inbox",
    "/approvals",
    "/team",
    "/notifications",
    "/settings",
  ].forEach((p) => revalidatePath(p));
}

function sessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production" || process.env.NETLIFY === "true";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  };
}

export async function login(email: string, password: string) {
  const db = await readDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: "Invalid credentials" };
  cookies().set(SESSION, user.id, sessionCookieOptions());
  await mutate((d) => {
    d.sessionUserId = user.id;
  });
  revalidateAll();
  return { ok: true };
}

export async function logout() {
  cookies().delete(SESSION);
  await mutate((d) => {
    d.sessionUserId = null;
  });
  revalidateAll();
}

export async function currentUser() {
  const db = await readDB();
  const id = cookies().get(SESSION)?.value ?? db.sessionUserId;
  return db.users.find((u) => u.id === id) ?? null;
}

export async function createPost(form: {
  accountIds: string[];
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "carousel" | "reel";
  scheduledAt?: string;
  submit?: boolean;
}) {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!form.accountIds.length) return { ok: false, error: "Select at least one account" };
  await mutate((db) => {
    const now = new Date().toISOString();
    db.posts.unshift({
      id: uid("p"),
      accountIds: form.accountIds,
      caption: form.caption,
      mediaUrl:
        form.mediaUrl ||
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800",
      mediaType: form.mediaType,
      status: form.submit ? "submitted" : form.scheduledAt ? "scheduled" : "draft",
      scheduledAt: form.scheduledAt,
      createdBy: user.id,
      submittedBy: form.submit ? user.id : undefined,
      createdAt: now,
      updatedAt: now,
    });
    db.notifications.unshift({
      id: uid("n"),
      type: form.submit ? "approval" : "team",
      title: form.submit ? "Draft submitted" : "Draft saved",
      body: `${user.name} ${form.submit ? "submitted" : "saved"} a post.`,
      read: false,
      createdAt: now,
      href: "/approvals",
    });
  });
  revalidateAll();
  return { ok: true };
}

export async function reviewPost(id: string, decision: "approved" | "rejected", note?: string) {
  const user = await currentUser();
  if (!user) return { ok: false };
  if (user.role === "Editor") return { ok: false, error: "Editors cannot review" };
  await mutate((db) => {
    const post = db.posts.find((p) => p.id === id);
    if (!post) return;
    post.status =
      decision === "approved" ? (post.scheduledAt ? "scheduled" : "approved") : "rejected";
    post.reviewedBy = user.id;
    post.reviewNote = note;
    post.updatedAt = new Date().toISOString();
    db.notifications.unshift({
      id: uid("n"),
      type: "approval",
      title: decision === "approved" ? "Post approved" : "Post rejected",
      body: `${user.name} ${decision} a post.`,
      read: false,
      createdAt: new Date().toISOString(),
      href: "/approvals",
    });
  });
  revalidateAll();
  return { ok: true };
}

export async function publishPost(id: string) {
  const db = await readDB();
  const post = db.posts.find((p) => p.id === id);
  if (!post) return { ok: false, error: "Post not found" };

  const account = db.accounts.find((a) => post.accountIds.includes(a.id) && a.connected);
  const token = account?.accessToken || process.env.IG_ACCESS_TOKEN;
  const igUserId = account?.igUserId || process.env.IG_BUSINESS_ACCOUNT_ID;

  if (!token || !igUserId) {
    await mutate((d) => {
      const p = d.posts.find((x) => x.id === id);
      if (!p) return;
      p.status = "failed";
      p.updatedAt = new Date().toISOString();
      d.notifications.unshift({
        id: uid("n"),
        type: "failure",
        title: "Publish blocked",
        body: "Connect an Instagram account (Settings) or set IG_ACCESS_TOKEN + IG_BUSINESS_ACCOUNT_ID.",
        read: false,
        createdAt: new Date().toISOString(),
        href: "/settings",
      });
    });
    revalidateAll();
    return { ok: false, error: "No Instagram credentials" };
  }

  if (post.mediaType !== "image") {
    await mutate((d) => {
      const p = d.posts.find((x) => x.id === id);
      if (!p) return;
      p.status = "failed";
      d.notifications.unshift({
        id: uid("n"),
        type: "failure",
        title: "Publish limited",
        body: "Live Graph publish currently supports image posts. Carousel/reel marked failed.",
        read: false,
        createdAt: new Date().toISOString(),
        href: "/settings",
      });
    });
    revalidateAll();
    return { ok: false, error: "Only image publish is supported via Graph API in this build" };
  }

  try {
    const result = await publishImagePost(igUserId, token, post.mediaUrl, post.caption);
    await mutate((d) => {
      const p = d.posts.find((x) => x.id === id);
      if (!p) return;
      p.status = "published";
      p.publishedAt = new Date().toISOString();
      p.igMediaId = result.id;
      p.updatedAt = new Date().toISOString();
      d.notifications.unshift({
        id: uid("n"),
        type: "publish",
        title: "Published to Instagram",
        body: `Live post id ${result.id}`,
        read: false,
        createdAt: new Date().toISOString(),
        href: "/calendar",
      });
    });
    revalidateAll();
    return { ok: true, igMediaId: result.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Publish failed";
    await mutate((d) => {
      const p = d.posts.find((x) => x.id === id);
      if (!p) return;
      p.status = "failed";
      p.updatedAt = new Date().toISOString();
      d.notifications.unshift({
        id: uid("n"),
        type: "failure",
        title: "Instagram publish failed",
        body: message,
        read: false,
        createdAt: new Date().toISOString(),
        href: "/settings",
      });
    });
    revalidateAll();
    return { ok: false, error: message };
  }
}

export async function replyComment(id: string, text: string) {
  const db = await readDB();
  const c = db.comments.find((x) => x.id === id);
  if (!c) return { ok: false, error: "Comment not found" };

  if (c.igCommentId) {
    const account = db.accounts.find((a) => a.id === c.accountId);
    const token = account?.accessToken || process.env.IG_ACCESS_TOKEN;
    if (token) {
      try {
        await replyToIgComment(c.igCommentId, token, text);
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "IG reply failed" };
      }
    }
  }

  await mutate((d) => {
    const comment = d.comments.find((x) => x.id === id);
    if (!comment) return;
    comment.replied = true;
    comment.replyText = text;
  });
  revalidateAll();
  return { ok: true };
}

export async function addLibraryItem(item: {
  kind: LibraryKind;
  title: string;
  body: string;
  tags: string;
  campaign?: string;
}) {
  await mutate((db) => {
    db.library.unshift({
      id: uid("l"),
      kind: item.kind,
      title: item.title,
      body: item.body,
      tags: item.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      campaign: item.campaign,
    });
  });
  revalidateAll();
  return { ok: true };
}

export async function markNotificationsRead() {
  await mutate((db) => {
    db.notifications.forEach((n) => {
      n.read = true;
    });
  });
  revalidateAll();
}

export async function addUser(form: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) {
  const me = await currentUser();
  if (me?.role !== "Admin") return { ok: false, error: "Admin only" };
  await mutate((db) => {
    db.users.push({
      id: uid("u"),
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      avatar: form.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
  });
  revalidateAll();
  return { ok: true };
}

export async function updateRole(userId: string, role: Role) {
  const me = await currentUser();
  if (me?.role !== "Admin") return { ok: false };
  await mutate((db) => {
    const u = db.users.find((x) => x.id === userId);
    if (u) u.role = role;
  });
  revalidateAll();
  return { ok: true };
}

export async function generateCaption(prompt: string, voice?: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const base = voice || "Calm, specific, no hype.";
    return {
      ok: true,
      text: `${prompt.trim()}\n\nShot in natural light. ${base} Save this if it belongs in your rotation.`,
      source: "local-fallback",
    };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Write a short Instagram caption. Voice: ${voice || "calm and specific"}. No hashtag dump.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content?.trim();
    return { ok: true, text: text || prompt, source: "openai" };
  } catch {
    return { ok: true, text: prompt, source: "error-fallback" };
  }
}

export async function suggestReply(comment: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      ok: true,
      text: `Thanks for this — means a lot. ${
        comment.includes("?") ? "We'll answer in stories later today." : "Glad it landed."
      }`,
    };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Write a short warm Instagram comment reply. One or two sentences.",
          },
          { role: "user", content: comment },
        ],
      }),
    });
    const json = await res.json();
    return { ok: true, text: json.choices?.[0]?.message?.content?.trim() || "Thank you." };
  } catch {
    return { ok: true, text: "Thank you — we appreciate this." };
  }
}

/** Connect a real Instagram Business/Creator account via long-lived token. */
export async function connectInstagramAccount(form: {
  igUserId: string;
  accessToken: string;
  replaceAccountId?: string;
}) {
  const me = await currentUser();
  if (!me) return { ok: false, error: "Not signed in" };
  if (me.role === "Editor") return { ok: false, error: "Admin or Approver required to connect" };

  const igUserId = form.igUserId.trim();
  const accessToken = form.accessToken.trim();
  if (!igUserId || !accessToken) return { ok: false, error: "IG user id and token required" };

  try {
    const profile = await getIgProfile(igUserId, accessToken);
    const insights = await getIgInsights(igUserId, accessToken);
    const reach =
      insights.data.find((i) => i.name === "reach")?.values?.[0]?.value ?? 0;
    const impressions =
      insights.data.find((i) => i.name === "impressions")?.values?.[0]?.value ?? 0;

    await mutate((db) => {
      const payload = {
        handle: `@${profile.username}`,
        displayName: profile.name || profile.username,
        followers: profile.followers_count ?? 0,
        following: profile.follows_count ?? 0,
        postsCount: profile.media_count ?? 0,
        engagementRate: 0,
        reach30d: reach,
        impressions30d: impressions,
        avatar: (profile.username || "IG").slice(0, 2).toUpperCase(),
        connected: true,
        igUserId: profile.id,
        accessToken,
        profilePictureUrl: profile.profile_picture_url,
        lastSyncedAt: new Date().toISOString(),
      };

      if (form.replaceAccountId) {
        const existing = db.accounts.find((a) => a.id === form.replaceAccountId);
        if (existing) Object.assign(existing, payload);
      } else {
        const existingByIg = db.accounts.find((a) => a.igUserId === profile.id);
        if (existingByIg) Object.assign(existingByIg, payload);
        else
          db.accounts.push({
            id: uid("a"),
            ...payload,
          });
      }

      db.notifications.unshift({
        id: uid("n"),
        type: "team",
        title: "Instagram connected",
        body: `@${profile.username} linked for live publish and inbox sync.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: "/settings",
      });
    });

    revalidateAll();
    return { ok: true, username: profile.username };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Connect failed" };
  }
}

export async function syncInstagramAccount(accountId: string) {
  const me = await currentUser();
  if (!me) return { ok: false, error: "Not signed in" };

  const db = await readDB();
  const account = db.accounts.find((a) => a.id === accountId);
  if (!account?.igUserId || !account.accessToken) {
    return { ok: false, error: "Account not connected" };
  }

  try {
    const profile = await getIgProfile(account.igUserId, account.accessToken);
    const comments = await fetchRecentMediaComments(account.igUserId, account.accessToken);

    await mutate((d) => {
      const a = d.accounts.find((x) => x.id === accountId);
      if (!a) return;
      a.followers = profile.followers_count ?? a.followers;
      a.following = profile.follows_count ?? a.following;
      a.postsCount = profile.media_count ?? a.postsCount;
      a.displayName = profile.name || a.displayName;
      a.handle = `@${profile.username}`;
      a.profilePictureUrl = profile.profile_picture_url;
      a.lastSyncedAt = new Date().toISOString();
      a.connected = true;

      for (const c of comments) {
        const exists = d.comments.some((x) => x.igCommentId === c.commentId);
        if (exists) continue;
        d.comments.unshift({
          id: uid("c"),
          accountId,
          postId: c.mediaId,
          author: `@${c.username}`,
          text: c.text,
          createdAt: c.timestamp || new Date().toISOString(),
          replied: false,
          igCommentId: c.commentId,
        });
      }
    });

    revalidateAll();
    return { ok: true, commentsImported: comments.length };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Sync failed" };
  }
}

export async function disconnectInstagramAccount(accountId: string) {
  const me = await currentUser();
  if (!me || me.role === "Editor") return { ok: false, error: "Not allowed" };
  await mutate((db) => {
    const a = db.accounts.find((x) => x.id === accountId);
    if (!a) return;
    a.connected = false;
    a.accessToken = undefined;
    a.lastSyncedAt = undefined;
  });
  revalidateAll();
  return { ok: true };
}

export async function bootstrapGlobalIg() {
  const { token, igUserId } = globalIgCreds();
  if (!token || !igUserId) return { ok: false, error: "Global IG env not set" };
  return connectInstagramAccount({ igUserId, accessToken: token });
}

export async function getDashboard() {
  return readDB();
}

export async function getRuntimeConfig() {
  return {
    openai: Boolean(process.env.OPENAI_API_KEY),
    igEnv: Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_BUSINESS_ACCOUNT_ID),
    netlify: Boolean(process.env.NETLIFY),
    nodeEnv: process.env.NODE_ENV || "development",
  };
}
