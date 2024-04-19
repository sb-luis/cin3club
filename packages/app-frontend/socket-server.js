import { Server } from 'socket.io';
import { v4 } from 'uuid';
const uuidv4 = v4;

class SocketServer {
  constructor(server) {
    // --- Socket.io server ---
    this.rooms = [];
    this.io = new Server(server);
    this.io.on('connection', this.onConnection.bind(this));
  }

  onConnection(socket) {
    // Get user id from socket
    console.log(`user ${socket.id} connected`);

    socket.on('create room', () => {
      const room = {
        host: socket.id,
        id: uuidv4(),
        joinRequests: [],
        members: [socket.id],
      };
      this.rooms.push(room);
      socket.join(room.id);
      // send confirmation to host that the room was created
      console.log(`room ${room.id} created by ${socket.id}`);
      this.io.to(socket.id).emit('room created', room.id);
    });

    socket.on('request membership', (roomId) => {
      //If room doesn't exist, return
      const requestedRoom = this.rooms.find((room) => room.id === roomId);

      if (!requestedRoom) {
        console.log(`Room ${roomId} doesn't exist`);
        return;
      }

      // Leave any room the user is currently a member of
      // or has a pending request to join
      for (const room of this.rooms) {
        if (room.members.includes(socket.id) || room.joinRequests.includes(socket.id)) {
          socket.leave(room.id);
          room.members = room.members.filter((member) => member !== socket.id);
          room.joinRequests = room.joinRequests.filter((request) => request !== socket.id);
          // Send a notification to the room that the user has left
          this.io.to(room.id).emit('member left', socket.id);
          console.log(`user ${socket.id} left room ${room.id}`);
        }
      }

      // Add user to the join request list of new room
      requestedRoom.joinRequests.push(socket.id);
      socket.join(roomId);
      this.io.to(requestedRoom.host).emit('user joined', socket.id);
      this.io.to(socket.id).emit('awaiting membership');
    });

    socket.on('accept membership', (userId, roomId) => {
      // Only accept user if the room exists
      // and this socket is the host of the room
      if (!this.rooms.find((room) => room.id === roomId && room.host === socket.id)) {
        return;
      }

      this.io.to(roomId).emit('member joined', userId);
      const room = this.rooms.find((room) => room.id === roomId);
      room.members.push(userId);
      room.joinRequests = room.joinRequests.filter((request) => request !== userId);
      console.log(`user ${userId} is now a member of the room ${roomId}`);
    });

    socket.on('increase count', (roomId) => {
      const room = this.rooms.find((room) => room.id === roomId);

      if (room && room.members.includes(socket.id)) {
        console.log(`count for ${socket.id} increased in room ${roomId}`);
        this.io.to(roomId).emit('count increased', socket.id);
      } else {
        console.log(`user ${socket.id} is not a member of the room ${roomId}`);
        console.log(room.members);
      }
    });

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      // Remove user from all rooms
      this.rooms.forEach((room) => {
        room.members = room.members.filter((member) => member !== socket.id);
        room.joinRequests = room.joinRequests.filter((request) => request !== socket.id);
        socket.leave(room.id);
        // Send a notification to the room that the user has left
        this.io.to(room.id).emit('member left', socket.id);
      });
      // Close any rooms that the user is a host of
      this.rooms = this.rooms.filter((room) => {
        if (room.host === socket.id) {
          this.io.to(room.id).emit('room closed');
          this.rooms = this.rooms.filter((r) => r.id !== room.id);
          return false;
        }
        return true;
      });
    });
  }
}

export function createSocketServer(server) {
  new SocketServer(server);
}
