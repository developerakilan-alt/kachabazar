import { NextResponse } from "next/server";
import { getAuthToken } from "@lib/auth-server";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ unreadCount: 0 });
    }

    const response = await resilientFetch(
      `${baseURL}/customer-tracking/notifications?page=1&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json({ unreadCount: 0 });
    }

    const data = await response.json();

    return NextResponse.json({
      unreadCount: data.unreadCount || 0,
    });
  } catch {
    return NextResponse.json({ unreadCount: 0 });
  }
}
