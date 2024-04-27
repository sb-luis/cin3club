import { v4 } from 'uuid';
import {
  ROOM_CREATED,
  ROOM_NOT_FOUND,
  USER_LEFT,
  USER_JOINED,
  AWAITING_MEMBERSHIP,
  REQUEST_MEMBERSHIP,
  CREATE_ROOM,
  ACCEPT_MEMBERSHIP,
  REJECT_MEMBERSHIP,
  MEMBERSHIP_ACCEPTED,
  MEMBERSHIP_REJECTED,
} from '../src/socket-constants.js';

const uuidv4 = v4;

function createRoom(_socket, _server) {
  const room = {
    host: _socket.id,
    id: uuidv4(),
    joinRequests: [],
    members: [_socket.id],
    poll: {},
  };

  _server.rooms.push(room);
  _socket.join(room.id);
  // send confirmation to host that the room was created
  console.log(`room ${room.id} created by ${_socket.id}`);
  _server.io.to(_socket.id).emit(ROOM_CREATED, room.id);
}

function requestMembership(_socket, _server, _roomId) {
  //If room doesn't exist, return
  const requestedRoom = _server.rooms.find((room) => room.id === _roomId);

  if (!requestedRoom) {
    console.log(`Room ${_roomId} doesn't exist`);
    _server.io.to(_socket.id).emit(ROOM_NOT_FOUND);
    return;
  }

  // Leave any room the user is currently a member of
  // or has a pending request to join
  for (const room of _server.rooms) {
    if (room.members.includes(_socket.id) || room.joinRequests.includes(_socket.id)) {
      _socket.leave(room.id);
      room.members = room.members.filter((member) => member !== _socket.id);
      room.joinRequests = room.joinRequests.filter((request) => request !== _socket.id);
      // Send a notification to the room that the user has left
      _server.io.to(room.id).emit(USER_LEFT, _socket.id);
      console.log(`user ${_socket.id} left room ${room.id}`);
    }
  }

  // Add user to the join request list of new room
  requestedRoom.joinRequests.push(_socket.id);
  _socket.join(_roomId);
  _server.io.to(requestedRoom.host).emit(USER_JOINED, _socket.id);
  _server.io.to(_socket.id).emit(AWAITING_MEMBERSHIP);
}

function acceptMembership(_socket, _server, _userId, _roomId) {
  console.log('accept membership was called', _userId, _roomId);
  // Only accept user if the room exists
  // and this socket is the host of the room
  const room = _server.rooms.find((room) => room.id === _roomId);
  if (!room || room.host !== _socket.id) {
    return;
  }

  console.log('accepting membership');
  room.members.push(_userId);
  room.joinRequests = room.joinRequests.filter((request) => request !== _userId);
  _server.io.to(_roomId).emit(MEMBERSHIP_ACCEPTED, room.members);
  console.log(`user ${_userId} is now a member of the room ${_roomId}`);
}

function rejectMembership(_socket, _server, _userId, _roomId) {
  // Only reject user if the room exists
  // and server socket is the host of the room
  if (!_server.rooms.find((room) => room.id === _roomId && room.host === _socket.id)) {
    return;
  }

  const room = _server.rooms.find((room) => room.id === _roomId);
  room.joinRequests = room.joinRequests.filter((request) => request !== _userId);
  _server.io.to(_roomId).emit(MEMBERSHIP_REJECTED, _userId);
  console.log(`user ${_userId} was rejected from the room ${_roomId}`);
}

export default function roomController(socket, server) {
  // A user can request to join a room
  socket.on(REQUEST_MEMBERSHIP, (roomId) => requestMembership(socket, server, roomId));
  // The host can create a room, accept or reject memberships
  socket.on(CREATE_ROOM, () => createRoom(socket, server));
  socket.on(ACCEPT_MEMBERSHIP, (userId, roomId) => acceptMembership(socket, server, userId, roomId));
  socket.on(REJECT_MEMBERSHIP, (userId, roomId) => rejectMembership(socket, server, userId, roomId));
}
