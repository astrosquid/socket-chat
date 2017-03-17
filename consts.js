// CB: had to pick the plural of a keyword, huh Steve?
const networkingConstants =
  {
      PORT: 4000,
      // SOCKET_NAME: '/tmp/watcher.sock',
  };

const userConstants = 
	{
		ADMIN1: 'steve',
		ADMIN2: 'chris'
	};

// expose module methods/objects
// CB: if we could stuff multiple objects into this export, then I think it would be fine to call it "consts". 
// Problem is that currently, the way it had to be referenced in other files was by calling var CONSTANT = networkingConsts
module.exports = {
	networkingConsts: networkingConstants,
	userConsts: userConstants
};