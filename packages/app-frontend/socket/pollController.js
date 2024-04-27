import { START_POLL, ROUND_STARTED, POLL_STARTED, POLL_ENDED, SUBMIT_VOTES } from '../src/socket-constants.js';

function startPoll(_socket, _server, _pollChoices, _roomId) {
  console.log('attempting to start poll');
  const room = _server.rooms.find((room) => room.id === _roomId);
  // Only start poll if the room exists & the socket is the host
  if (!room || room.host !== _socket.id) {
    console.log('only the room host can create polls');
    return;
  }

  // Decide the number of rounds depending on the number of members
  // And the number of choices
  console.log('deciding the number of rounds for the poll');
  let totalRounds = 3;
  if (room.members.length <= 3) {
    if (_pollChoices.length <= 3) {
      totalRounds = 1;
    } else if (_pollChoices.length <= 6) {
      totalRounds = 2;
    } else {
      totalRounds = 3;
    }
  } else if (room.members.length <= 6) {
    if (_pollChoices.length <= 3) {
      totalRounds = 2;
    } else {
      totalRounds = 3;
    }
  } else {
    totalRounds = 3;
  }

  room.poll = {
    roomId: room.id,
    members: room.members,
    choices: _pollChoices,
    roundIndex: 0,
    roundsTotal: totalRounds,
    rounds: [],
    winner: {},
  };
  console.log(`total rounds for this poll: ${totalRounds}`);

  // Start poll
  _server.io.to(_roomId).emit(POLL_STARTED, room.poll);

  // Start round
  const round = initRound(_pollChoices);
  room.poll.rounds.push(round);
  console.log(`emiting round started to ${_roomId}`);
  _server.io.to(_roomId).emit(ROUND_STARTED, round, room.poll.roundIndex);
}

function initRound(_choices) {
  console.log('deciding the number of votes for this round');
  // Decide the number of votes depending on the number of choices
  let totalVotes = 3;
  if (_choices.length <= 3) {
    totalVotes = 1;
  } else if (_choices.length <= 6) {
    totalVotes = 2;
  }

  console.log(`total votes for this round: ${totalVotes}`);
  return {
    choices: _choices,
    totalVotes: totalVotes,
    votes: {},
  };
}

/*
    Gets an array of choices. Each choice is an object with a choice.tmdbId property.
    Gets a votes object. Each votes key is a user id and the value is an array of choice.tmdbId. 
    Returns an array of choices sorted by the number of votes. 
*/
function reduceChoices(_choices, _votes) {
  // Votes is an object like {userId: [tmdbId1, tmdbId2, tmdbId3], userId2: [tmdbId1, tmdbId2, tmdbId3]}
  // Compute a totalVotes object that is just an array of [tmdbId1, tmdbId2, tmdbId3, tmdbId1, tmdbId2, tmdbId3]
  const totalVotes = Object.values(_votes).reduce((acc, votes) => {
    return acc.concat(votes);
  }, []);

  /*
    Creates an intermediate object like: 
    {
      tmdbId1: X, // number of votes
      tmdbId2: X, // number of votes
      tmdbId3: X, // number of votes
    }
    To store the number of votes for each choice.
  */
  const voteCount = totalVotes.reduce((acc, tmdbId) => {
    if (acc[tmdbId]) {
      acc[tmdbId]++;
    } else {
      acc[tmdbId] = 1;
    }
    return acc;
  }, {});

  return (
    _choices
      // If the choice have zero votes it won't get included in the array.
      .filter((choice) => voteCount[choice.tmdbId])
      // Sort the choices by the number of votes
      .sort((a, b) => {
        return voteCount[b.tmdbId] - voteCount[a.tmdbId];
      })
  );
}

function submitVotes(_socket, _server, _votes, _roomId) {
  console.log('submitting votes');
  const room = _server.rooms.find((room) => room.id === _roomId);

  if (!room) {
    console.log('room not found');
    return;
  }

  const poll = room.poll;
  if (!poll) {
    console.log('poll not found');
    return;
  }

  const round = poll.rounds[poll.roundIndex];
  if (!round) {
    console.log(`round ${poll.roundIndex} not found`);
    return;
  }

  // Check if the user has already submitted votes
  if (round.votes[_socket.id]) {
    console.log('member has already submitted votes');
    return;
  }

  // Add votes to the round
  round.votes[_socket.id] = _votes;
  console.log(`votes submitted by ${_socket.id}`);
  console.log(_votes);

  // Check if all votes have been submitted
  if (Object.keys(round.votes).length === poll.members.length) {
    console.log('all votes have been submitted');

    // Reduce the number of choices based on the votes
    // reducedChoices is an array of choices sorted by the number of votes
    const reducedChoices = reduceChoices(round.choices, round.votes);
    console.log('reduced choices');
    console.log(reducedChoices);

    // If round is last round - determine a winner
    if (poll.roundIndex === poll.roundsTotal - 1) {
      console.log('all rounds have been completed');
      console.log(`round ${poll.roundIndex + 1} is the last round - determining winner`);
      poll.winner = reducedChoices[0];
      console.log('winner is', poll.winner);
      _server.io.to(_roomId).emit(POLL_ENDED, poll);
      return;
    }
    // If there is only one choice left - the winner is decided
    else if (reducedChoices.length === 1) {
      poll.winner = reducedChoices[0];
      console.log('winner is', poll.winner);
      _server.io.to(_roomId).emit(POLL_ENDED, poll);
      return;
    }
    // Otherwise - Move to next round
    poll.roundIndex++;
    const nextRound = initRound(reducedChoices);
    poll.rounds.push(nextRound);
    _server.io.to(_roomId).emit(ROUND_STARTED, nextRound, poll.roundIndex);
    console.log(`round ${poll.roundIndex} started in room ${_roomId}`);
  }
}

export default function pollController(_socket, _server) {
  _socket.on(START_POLL, (_pollChoices, _roomId) => startPoll(_socket, _server, _pollChoices, _roomId));
  _socket.on(SUBMIT_VOTES, (_votes, _roomId) => submitVotes(_socket, _server, _votes, _roomId));
}
