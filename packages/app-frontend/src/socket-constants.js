// Room events
const CREATE_ROOM = 'create room';
const ROOM_CREATED = 'room created';
const ROOM_CLOSED = 'room closed';
const ROOM_NOT_FOUND = 'room does not exists';
const USER_JOINED = 'user joined';
const USER_LEFT = 'user left';
const REQUEST_MEMBERSHIP = 'request membership';
const AWAITING_MEMBERSHIP = 'awaiting membership';
const ACCEPT_MEMBERSHIP = 'accept membership';
const MEMBERSHIP_ACCEPTED = 'membership accepted';
const REJECT_MEMBERSHIP = 'reject membership';
const MEMBERSHIP_REJECTED = 'membership rejected';
// Poll events
const START_POLL = 'start poll';
const POLL_STARTED = 'poll started';
const POLL_ENDED = 'poll ended';
const ROUND_STARTED = 'round started';
const ROUND_ENDED = 'round ended';
const SUBMIT_VOTES = 'submit votes';

export {
  // Room events
  CREATE_ROOM,
  ROOM_CREATED,
  ROOM_CLOSED,
  ROOM_NOT_FOUND,
  USER_JOINED,
  USER_LEFT,
  REQUEST_MEMBERSHIP,
  AWAITING_MEMBERSHIP,
  ACCEPT_MEMBERSHIP,
  MEMBERSHIP_ACCEPTED,
  REJECT_MEMBERSHIP,
  MEMBERSHIP_REJECTED,
  // Poll events
  START_POLL,
  POLL_STARTED,
  POLL_ENDED,
  ROUND_STARTED,
  ROUND_ENDED,
  SUBMIT_VOTES,
};
