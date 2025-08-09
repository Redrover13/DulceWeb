import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.WP_PREVIEW_SECRET) {
    return NextResponse.json({ ok:false, message:"Invalid secret" }, { status:401 });
  }
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  return NextResponse.json({ ok:true, revalidated:true, path });
}
