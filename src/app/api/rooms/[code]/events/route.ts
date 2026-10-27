import { NextRequest } from 'next/server';
import { RoomManager } from '@/lib/room-store';

interface Params {
  params: Promise<{ code: string }>;
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: Params) {
  const { code } = await params;
  const upperCode = code.toUpperCase();
  const room = RoomManager.getRoom(upperCode);

  if (!room) {
    return new Response('Room not found', { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state immediately
      const initialPayload = `data: ${JSON.stringify(room)}\n\n`;
      controller.enqueue(encoder.encode(initialPayload));

      // Subscribe to room changes
      const unsubscribe = RoomManager.subscribe(upperCode, (updatedRoom) => {
        try {
          const payload = `data: ${JSON.stringify(updatedRoom)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          unsubscribe();
        }
      });

      // Keepalive heartbeat every 15s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
