import { Server } from 'socket.io';
import roomController from './roomController.js';
import pollController from './pollController.js';
import { USER_LEFT, ROOM_CLOSED } from '../src/socket-constants.js';

class SocketServer {
  constructor(_server) {
    // --- Socket.io server ---
    this.rooms = [];
    this.io = new Server(_server);
    this.io.on('connection', this.onConnection.bind(this));
  }

  onConnection(_socket) {
    // Get user id from socket
    console.log(`user ${_socket.id} connected`);

    roomController(_socket, this);
    pollController(_socket, this);

    _socket.on('disconnect', () => {
      console.log(`user ${_socket.id} disconnected`);

      // Remove user from all rooms
      this.rooms.forEach((room) => {
        room.members = room.members.filter((member) => member !== _socket.id);
        room.joinRequests = room.joinRequests.filter((request) => request !== _socket.id);
        _socket.leave(room.id);

        // Send a notification each room that the user leaves
        console.log(`user ${_socket.id} left room ${room.id}`);
        this.io.to(room.id).emit(USER_LEFT, _socket.id);
      });

      // Close any rooms that the user is a host of
      this.rooms = this.rooms.filter((room) => {
        if (room.host === _socket.id) {
          this.io.to(room.id).emit(ROOM_CLOSED);
          this.rooms = this.rooms.filter((r) => r.id !== room.id);
          return false;
        }
        return true;
      });
    });
  }
}

export function createSocketServer(_server) {
  new SocketServer(_server);
}
