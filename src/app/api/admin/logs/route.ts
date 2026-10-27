import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-store';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'mooauan2026';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-key');
  const queryKey = req.nextUrl.searchParams.get('key');

  if ((authHeader || queryKey) !== ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = RoomManager.getAdminLogs();
  return NextResponse.json({ success: true, logs });
}
