/**
 * Server-Sent Events (SSE) utilities for streaming responses
 */

export interface SSEChunkData {
  model_id: string;
  content: string;
  sequence: number;
}

export interface SSEDoneData {
  turn_id: string;
  status: string;
}

export interface SSEErrorData {
  error: string;
  reason?: string;
}

/**
 * SSE Writer helper class
 */
export class SSEWriter {
  private encoder = new TextEncoder();

  constructor(private controller: ReadableStreamDefaultController) {}

  /**
   * Write SSE event
   */
  write(event: string, data: unknown): void {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.controller.enqueue(this.encoder.encode(message));
  }

  /**
   * Write chunk event
   */
  chunk(data: SSEChunkData): void {
    this.write('chunk', data);
  }

  /**
   * Write done event
   */
  done(data: SSEDoneData): void {
    this.write('done', data);
  }

  /**
   * Write error event
   */
  error(data: SSEErrorData): void {
    this.write('error', data);
  }

  /**
   * Close stream
   */
  close(): void {
    this.controller.close();
  }
}

/**
 * Create SSE stream with writer
 */
export function createSSEStream(
  handler: (writer: SSEWriter) => Promise<void>
): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const writer = new SSEWriter(controller);
      try {
        await handler(writer);
      } catch (error) {
        writer.error({
          error: 'Stream failed',
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        writer.close();
      }
    },
  });
}

/**
 * Helper to simulate streaming delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

