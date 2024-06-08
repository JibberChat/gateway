import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    console.log(`Client connected: ${clientId}`);
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${clientId}`);
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
  }

  emitEvent(event: string, message: unknown): void {
    this.connectedClients.forEach((socket: Socket) => {
      socket.emit(event, message);
    });
  }

  // Add more methods for handling events, messages, etc.
}
