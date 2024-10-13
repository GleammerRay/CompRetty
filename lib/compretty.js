import { REST, Gateway } from './gleamcord.js';
import * as Fs from 'fs';
import * as Path from 'path';

const helpDesc = 'Show a list of available commands';
const setupDesc = 'Summon the setup wizard';
const forceStartDesc = 'Force a game to start';
const kickDesc = 'Kick player(s) from competition';
const kickAllDesc = 'Kick all players from competition';
const kickPlayerDesc = 'Kick a player from competition';
const userDesc = 'Discord user';
const competitionDesc = 'Show the competition';
const joinDesc = 'Join the competition';
const joinRandomDesc = 'Join a random available team';
const joinTeamDesc = 'Join a competition team';
const joinQueueDesc = 'Join player queue';
const leaveDesc = 'Leave the competition';
const readyDesc = 'Ready up';
const unreadyDesc = 'Unready';
const getRoleDesc = 'Get the competition role';
const shuffleDesc = 'Vote to shuffle players';
const getPlayerNameDesc = 'Get player name by user ID';
const coinFlipDesc = 'Flip a coin';
const coinFlipCaptainsDesc = 'Pick random team captains';
const coinFlipHeadsOrTailsDesc = 'Heads or tails';
const userIdDesc = 'Discord user ID';

const commands = [
  {
    name: 'help',
    dm_permission: false,
    description: helpDesc,
    type: 1,
  },
  {
    name: 'setup',
    dm_permission: false,
    description: setupDesc,
    type: 1,
    default_member_permissions: '0',
    default_permission: false,
  },
  {
    name: 'force_start',
    dm_permission: false,
    description: forceStartDesc,
    type: 1,
    default_member_permissions: '0',
    default_permission: false,
  },
  {
    name: 'kick',
    dm_permission: false,
    description: kickDesc,
    type: 1,
    default_member_permissions: '0',
    default_permission: false,
    options: [
      {
        name: 'all',
        dm_permission: false,
        description: kickAllDesc,
        type: 1,
        default_member_permissions: '0',
        default_permission: false,
      },
      {
        name: 'player',
        dm_permission: false,
        description: kickPlayerDesc,
        type: 1,
        default_member_permissions: '0',
        default_permission: false,
        options: [
          {
            name: 'user',
            description: userDesc,
            type: 6,
            required: true,
          }
        ],
      },
    ],
  },
  {
    name: 'competition',
    dm_permission: false,
    description: competitionDesc,
    type: 1,
  },
  {
    name: 'comp',
    dm_permission: false,
    description: competitionDesc,
    type: 1,
  },
  {
    name: 'pug',
    dm_permission: false,
    description: competitionDesc,
    type: 1,
  },
  {
    name: 'join',
    dm_permission: false,
    description: competitionDesc,
    type: 1,
  },
  {
    name: 'leave',
    dm_permission: false,
    description: leaveDesc,
    type: 1,
  },
  {
    name: 'unpug',
    dm_permission: false,
    description: leaveDesc,
    type: 1,
  },
  {
    name: 'ready',
    dm_permission: false,
    description: readyDesc,
    type: 1,
  },
  {
    name: 'unready',
    dm_permission: false,
    description: unreadyDesc,
    type: 1,
  },
  {
    name: 'get_role',
    dm_permission: false,
    description: getRoleDesc,
    type: 1,
  },
  {
    name: 'shuffle',
    dm_permission: false,
    description: shuffleDesc,
    type: 1,
  },
  {
    name: 'get_player_name',
    dm_permission: false,
    description: getPlayerNameDesc,
    type: 1,
    options: [
      {
        name: 'user_id',
        description: userIdDesc,
        type: 3,
        required: true,
        autocomplete: true,
      }
    ],
  },
  {
    name: 'coin_flip',
    dm_permission: false,
    description: coinFlipDesc,
    type: 1,
    options: [
      {
        name: 'captains',
        dm_permission: false,
        description: coinFlipCaptainsDesc,
        type: 1,
      },
      {
        name: 'heads_or_tails',
        dm_permission: false,
        description: coinFlipHeadsOrTailsDesc,
        type: 1,
      },
      {
        name: 'coin',
        dm_permission: false,
        description: coinFlipHeadsOrTailsDesc,
        type: 1,
      },
    ],
  },
  {
    name: 'flip',
    dm_permission: false,
    description: coinFlipDesc,
    type: 1,
    options: [
      {
        name: 'captains',
        dm_permission: false,
        description: coinFlipCaptainsDesc,
        type: 1,
      },
      {
        name: 'heads_or_tails',
        dm_permission: false,
        description: coinFlipHeadsOrTailsDesc,
        type: 1,
      },
      {
        name: 'coin',
        dm_permission: false,
        description: coinFlipHeadsOrTailsDesc,
        type: 1,
      },
    ],
  },
  {
    name: 'coin',
    dm_permission: false,
    description: coinFlipHeadsOrTailsDesc,
    type: 1,
  },
  {
    name: 'Kick player',
    dm_permission: false,
    type: 2,
  },
  {
    name: 'Kick mentioned player',
    dm_permission: false,
    type: 3,
  },
];

const embedColor = 16546406;
const logoURL = 'https://raw.github.com/GleammerRay/CompRetty/master/assets/logo.png';
const embedAuthor = {
  name: 'CompRetty',
  url: 'https://github.com/GleammerRay/CompRetty',
  icon_url: logoURL,
};
const embedFooter = {
  icon_url: 'https://cdn.discordapp.com/attachments/1005272489380827199/1005581705035399198/gleam.jpg',
  text: 'Made by Gleammer (nice)',
};

const adminHelpField = '{"name":"Admin commands :crown:","value":"' +
`\`/setup\` - ${setupDesc}\\n` +
`\`/force_start\` - ${forceStartDesc}\\n` +
`\`/kick\` - ${kickDesc}` +
'"}';

const defaultTeamFirstWords = [
  'Awesome',
  'Powerful',
  'Glittery',
  'Swift',
  'Shiny',
];

const defaulTeamSecondWords = [
  'Possums',
  'Cookies',
  'Gnomes',
  'Flakes',
  'Wranglers',
];

export const PlayerType = {
  Any: 'Any',
  Ready: 'Ready',
  NotReady: 'NotReady',
}

export const VoteType = {
  None: 'None',
  Against: 'Against',
  For: 'For',
}

export class BurstStack {
  #active;
  #paused;
  #currentTimeout;
  #timeout;
  #stack;

  constructor(timeout, stack = null) {
    this.#active = false;
    this.#paused = false;
    this.#timeout = timeout;
    if (stack == null) stack = {};
    this.#stack = stack;
  }

  set(name, command) {
    this.#stack[name] = command;
    if (this.#paused) {
      this.#paused = false;
      this.#currentTimeout = setTimeout(() => this._mainLoop(), this.#timeout);
    }
  }
  
  get(name) {
    return this.#stack[name];
  }

  remove(name) {
    delete this.#stack[name];
  }

  _mainLoop() {
    var _stack = Object.values(this.#stack);
    if (_stack.length == 0) {
      this.#paused = true;
      return;
    }
    this.#stack = {};
    _stack.forEach((value) => value());
    if (!this.#active) return;
    this.#currentTimeout = setTimeout(() => this._mainLoop(), this.#timeout);
  }

  start() {
    if (this.#active) return;
    this.#active = true;
    this._mainLoop();
  }

  stop() {
    this.#active = false;
    this.#paused = false;
    clearTimeout(this.#currentTimeout);
    this.#currentTimeout = undefined;
    Object.values(this.#stack).forEach((value) => value());
    this.#stack = {};
  }
}

var burstStacksStarted = false;
var burstStack10 = new BurstStack(10000);

export const startBurstStacks = () => {
  burstStacksStarted = true;
  burstStack10.start();
}

export const stopBurstStacks = () => {
  burstStacksStarted = false;
  burstStack10.stop();
}

process.on('SIGINT', () => stopBurstStacks());
process.on('SIGTERM', () => stopBurstStacks());

class CompRettyDB {
  #timeout;
  #entries;
  #newEntries;
  #scheduledRemoval;

  constructor() {
    process.on('SIGINT', () => clearTimeout(this.#timeout));
    process.on('SIGTERM', () => clearTimeout(this.#timeout));
    this.#entries = {};
    this.#newEntries = {};
    this.#scheduledRemoval = {};
    this._schedule();
  }

  _schedule() {
    this.#scheduledRemoval = this.#newEntries;
    this.#newEntries = {};
    this.#timeout = setTimeout(() => this._remove(), 30000);
  };

  _remove() {
    Object.keys(this.#scheduledRemoval).forEach((name) => delete this.#entries[name]);
    this.#scheduledRemoval = {};
    this.#timeout = setTimeout(() => this._schedule(), 30000);
  }

  register(name, data) {
    this.#entries[name] = data;
    this.#newEntries[name] = null;
  }

  get(name) {
    var _data = this.#entries[name];
    if (_data === undefined) return undefined;
    if (this.#scheduledRemoval[name] != null) {
      delete this.#scheduledRemoval[name];
      this.register(name, _data);
    }
    return _data;
  }

  remove(name) {
    if (this.#entries[name] === undefined) return;
    delete this.#entries[name];
    delete this.#newEntries[name];
    delete this.#scheduledRemoval[name];
  }
}

const db = new CompRettyDB();

const snakeToCamel = str => str.replace( /([-_]\w)/g, g => g[ 1 ].toUpperCase() );

const snakeToPascal = str => {
  let camelCase = snakeToCamel( str );
  let pascalCase = camelCase[ 0 ].toUpperCase() + camelCase.substr( 1 );
  return pascalCase;
}

const simpleStringMatchAccuracy = (a, b) => {
  var _bIndex = 0;
  if (b.length == 0) return;
  for (let i = 0; i != a.length; i++) {
    if (a[i] == b[_bIndex]) {
      _bIndex++;
      if (_bIndex == b.length) return _bIndex;
      continue;
    }
    _bIndex = 0;
  }
  return _bIndex;
}

const linearStringMatchAccuracy = (a, b) => {
  var _bIndex = 0;
  if (b.length == 0) return;
  for (let i = 0; i != a.length; i++) {
    if (a[i] != b[_bIndex]) break;
    _bIndex++;
    if (_bIndex == b.length) return _bIndex;
  }
  return _bIndex;
}

const addMilliseconds = (date, milliseconds) => {
  return new Date(date.getTime() + milliseconds);
}

const ranInt = (start, end) => {
  return start + Math.round((Math.random() * (end - start)));
}

const generateTeamName = () => {
  var _word1 = defaultTeamFirstWords[ranInt(0, 4)];
  var _word2 = defaulTeamSecondWords[ranInt(0, 4)];
  return `${_word1} ${_word2}`;
}

const getFirstRole = str => {
  if (str == null) return null;
  var _reading = false;
  var _role = '';
  for (let i = 0; i != str.length; i++) {
    var _char = str[i];
    if (_reading) {
      if (_char == '>') return _role;
      if (/^\d+$/.test(_char)) _role += _char;
      else {
        _role = '';
        _reading = false;
      }
      continue;
    }
    if (_char != '<') continue;
    if (str[i + 1] != '@') continue;
    _reading = true;
    i++;
  }
  return null;
}

const formatRole = id => {
  if (id != null) return `<@&${id}>`;
  else return 'Not set';
}

const getHelpMsg = (isAdmin = false) => {
  var _adminHelpField = '';
  if (isAdmin) _adminHelpField = adminHelpField;
  return (`{"type":4,"data":{"flags":${1 << 6},"embeds":[{` +
    '"title":"Command list",' +
    `"footer":${JSON.stringify(embedFooter)},` +
    `"thumbnail":{"url":"${logoURL}"},` +
    `"author":${JSON.stringify(embedAuthor)},` +
    '"description":"' +
    `\`/help\` - ${helpDesc}\\n` +
    `\`/competition\`, \`/comp\`, \`/pug\`, \`/join\` - ${competitionDesc}\\n` +
    `\`/join random\` - ${joinRandomDesc}\\n` +
    `\`/join team\` - ${joinTeamDesc}\\n` +
    `\`/join queue\` - ${joinQueueDesc}\\n` +
    `\`/leave\`, \`/unpug\` - ${leaveDesc}\\n` +
    `\`/ready\` - ${readyDesc}\\n` +
    `\`/unready\` - ${unreadyDesc}\\n` +
    `\`/get_role\` - ${getRoleDesc}\\n` +
    `\`/shuffle\` - ${shuffleDesc}\\n` +
    `\`/get_player_name\` - ${getPlayerNameDesc}\\n` +
    `\`/coin_flip\` - ${coinFlipDesc}\\n` +
    `\`/flip\` - ${coinFlipDesc}\\n` +
    `\`/coin\` - ${coinFlipHeadsOrTailsDesc}` +
    '",' +
    `"fields":[${_adminHelpField}]` +
    '}]}}');
}

const getInteractionResponse = (data, type = 4) => {
  return `{"type":${type},"data":${JSON.stringify(data)}}`;
}

const getEphemeralResponse = (content) => {
  return getInteractionResponse({flags: 1 << 6, content: content});
}

const getSimpleModal = (title, customID, component) => {
  return {
    title: title,
    custom_id: customID,
    components: [{
      type: 1,
      components: [component]
    }]
  };
}

const isAdmin = (member) => {
  return (member.permissions & (1 << 3)) == (1 << 3);
}

const dmUsers = (rest, userIDs, message) => {
  if (userIDs.length == 0) return;
  rest.createDMMessage(userIDs[0], message);
  return setTimeout(() => dmUsers(rest, userIDs.slice(1), message), 500);
}

const ghostPingUsers = async (rest, channelID, userIDs) => {
  if (userIDs.length == 0) return;
  var _message = `<@${userIDs[0]}>`
  async function _ghostPing(rest) {
    _message = await rest.createMessage(channelID, `{"content":"${_message}"}`);
    if (_message != null) if (_message.id != null) await rest.deleteMessage(channelID, _message.id);
  }
  for (let i = 1; i < userIDs.length; i++) {
    // Maximum of 95 mentions per ping
    if ((i % 95) == 0) {
      await _ghostPing(rest);
      _message = '';
    }
    _message += `<@${userIDs[i]}>`;
  }
  await _ghostPing(rest);
}

export const CompRettyEventType = {
  Left: 'Left',
  Joined: 'Joined',
}

export class CompRettyEvent {
  playerID;
  team;
  type;
  message;

  constructor(playerID, team, type, message) {
    this.playerID = playerID;
    this.team = team;
    this.type = type;
    this.message = message;
  }
}

export class CompRettyPlayer {
  #id;
  #ready;

  constructor(id, ready = false) {
    this.#id = id;
    this.#ready = ready;
  }

  static fromJSON(json) {
    return new CompRettyPlayer(json.id, json.ready);
  }

  toJSON() {
    return {
      id: this.#id,
      ready: this.#ready,
    };
  }

  get id() {
    return this.#id;
  }

  get ready() {
    return this.#ready;
  }

  set ready(value) {
    this.#ready = value;
  }
}

export class CompRettyTeam {
  #rest;
  #name;
  #description;
  #imageURL;
  #minPlayers;
  #maxPlayers;
  #players;
  #readyPlayers;
  #notReadyPlayers;

  constructor(name, description = '', imageURL = '', minPlayers = 1, maxPlayers = 50, players = {}) {
    this.#name = name;
    this.#description = description;
    this.#imageURL = imageURL;
    this.#minPlayers = minPlayers;
    this.#maxPlayers = maxPlayers;
    this.#players = players;
    this.#readyPlayers = {};
    this.#notReadyPlayers = {};
    Object.values(this.#players).forEach((player) => {
      if (player.ready) {
        this.#readyPlayers[player.id] = player;
        return;
      }
      this.#notReadyPlayers[player.id] = player;
    });
  }

  static withREST(rest, name, description = '', imageURL = '', minPlayers = 1, maxPlayers = 50, players = {}) {
    var _team = new CompRettyTeam(name, description, imageURL, minPlayers, maxPlayers, players);
    _team.#rest = rest;
    return _team;
  }

  static fromJSON(json, rest = null) {
    var _players = {};
    Object.values(json.players).forEach((player) => _players[player.id] = CompRettyPlayer.fromJSON(player));
    return CompRettyTeam.withREST(rest, json.name, json.description, json.imageURL, json.minPlayers, json.maxPlayers, _players);
  }

  toJSON() {
    var _playersJSON = [];
    Object.values(this.#players).forEach((player) => _playersJSON.push(player.toJSON()));
    return {
      name: this.#name,
      description: this.#description,
      imageURL: this.#imageURL,
      minPlayers: this.#minPlayers,
      maxPlayers: this.#maxPlayers,
      players: _playersJSON,
    };
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (typeof value != 'string') return;
    if (value.startsWith('cr_')) return;
    this.#name = value;
  }

  get description() {
    return this.#description;
  }

  set description(value) {
    this.#description = value;
  }
  
  get imageURL() {
    return this.#imageURL;
  }

  set imageURL(value) {
    this.#imageURL = value;
  }

  get minPlayers() {
    return this.#minPlayers;
  }

  set minPlayers(value) {
    this.#minPlayers = value;
  }

  get maxPlayers() {
    return this.#maxPlayers;
  }

  set maxPlayers(value) {
    this.#maxPlayers = value;
  }

  get players() {
    return this.#players;
  }

  get playerCount() {
    return Object.keys(this.#players).length;
  }

  get readyPlayers() {
    return this.#readyPlayers;
  }

  get notReadyPlayers() {
    return this.#notReadyPlayers;
  }

  getPlayer(id) {
    return this.#players[id];
  }

  getOrCreatePlayer(id) {
    if (Object.keys(this.#players).length >= this.#maxPlayers) return;
    if (this.#players[id] != null) return;
    this.resetReady();
    var _player = new CompRettyPlayer(id);
    this.#players[id] = _player;
    this.#notReadyPlayers[id] = _player;
    return _player;
  }

  removePlayer(id) {
    var _player = this.#players[id];
    if (_player == null) return;
    this.resetReady();
    delete this.#players[id];
    delete this.#readyPlayers[id];
    delete this.#notReadyPlayers[id];
  }

  clearPlayers() {
    this.#players = {};
    this.#readyPlayers = {};
    this.#notReadyPlayers = {};
  }

  setPlayerReady(id, value) {
    if (Object.keys(this.#players).length < this.#minPlayers) return;
    var _player = this.#players[id];
    if (_player == null) return;
    _player.ready = value;
    if (value) {
      delete this.#notReadyPlayers[id];
      this.#readyPlayers[id] = _player;
      return;
    }
    delete this.#readyPlayers[id];
    this.#notReadyPlayers[id] = _player;
  }

  resetReady() {
    Object.values(this.#readyPlayers).forEach((player) => {
      delete this.#readyPlayers[player.id];
      player.ready = false
      this.#notReadyPlayers[player.id] = player;
    });
  }

  get isReady() {
    var _playerCount = Object.keys(this.#players).length;
    if (_playerCount < this.#minPlayers) return false;
    var _readyPlayerCount = Object.keys(this.#readyPlayers).length;
    if (_readyPlayerCount == _playerCount) return true;
    return false;
  }

  getTeamInfoMessage() {
    var _description = '';
    if (this.#description != '') _description = `${this.#description}\n\n`;
    var _players = Object.keys(this.#players);
    if (_players.length == 0) _description += '**No players**.';
    else {
      _description += ':hugging: **Players:**\n';
      _players.forEach((userID) => _description += `<@${userID}> `);
    }
    var _image;
    var _imageURL = this.#imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: this.#imageURL };
    return {
      embeds: [{
        title: `:shield: ${this.#name}`,
        description: _description,
        color: embedColor,
        timestamp: new Date().toISOString(),
        thumbnail: _image,
      }],
    }
  }

  sendTeamInfo(channelID) {
    return this.#rest.createMessage(
      channelID,
      JSON.stringify(this.getTeamInfoMessage()),
    );
  }

  dmPlayers(message) {
    var _userIDs = Object.keys(this.#players);
    return dmUsers(this.#rest, _userIDs, message);
  }

  dmReadyPlayers(message) {
    var _userIDs = Object.keys(this.#readyPlayers);
    return dmUsers(this.#rest, _userIDs, message);
  }

  dmNotReadyPlayers(message) {
    var _userIDs = Object.keys(this.#notReadyPlayers);
    return dmUsers(this.#rest, _userIDs, message);
  }

  ghostPingPlayers(channelID) {
    var _userIDs = Object.keys(this.#players);
    return ghostPingUsers(this.#rest, channelID, _userIDs);
  }

  ghostPingNotReadyPlayers(channelID) {
    var _userIDs = Object.keys(this.#notReadyPlayers);
    return ghostPingUsers(this.#rest, channelID, _userIDs);
  }
}

export class CompRettyTeams {
  #onSave;
  #onAllReady;
  #rest;
  #competitionName;
  #teams;
  #playerTeams;
  #queue;
  #queueOnly;
  #logEnabled;

  constructor(teams = {}) {
    this.#teams = teams;
    this.#playerTeams = {};
    this.#queue = null;
    this.#queueOnly = false;
    this.#logEnabled = false;
    Object.values(teams).forEach((team) => Object.values(team.players).forEach((player) => this.#playerTeams[player.id] = team));
  }

  static withREST(rest, teams = {}) {
    var _teams = new CompRettyTeams(teams);
    _teams.#rest = rest;
    return _teams;
  }

  static fromJSON(json, rest = null) {
    var _teams = {};
    Object.values(json).forEach((team) => _teams[team.name] = CompRettyTeam.fromJSON(team, rest));
    return CompRettyTeams.withREST(rest, _teams);
  }

  toJSON() {
    var _teamsJSON = [];
    Object.values(this.#teams).forEach((team) => _teamsJSON.push(team.toJSON()))
    return _teamsJSON;
  }

  async _onSave(arrangementChanged = true) {
    if (this.#onSave == null) return;
    await this.#onSave(arrangementChanged);
  }

  set onSave(value) {
    this.#onSave = value;
  }

  set competitionName(value) {
    this.#competitionName = value;
  }

  set onAllReady(value) {
    this.#onAllReady = value;
  }

  set logEnabled(value) {
    this.#logEnabled = value;
  }

  get values() {
    return Object.values(this.#teams);
  }

  get length() {
    return Object.keys(this.#teams).length;
  }

  get players() {
    var _players = {};
    Object.values(this.#teams).forEach((team) => _players = { ..._players, ...team.players });
    return _players;
  }

  get playerCount() {
    return Object.keys(this.#playerTeams).length;
  }

  get allReady() {
    var _teams = Object.values(this.#teams);
    for (let i = 0; i < _teams.length; i++) {
      if (!_teams[i].isReady) return false;
    }
    return true;
  }

  resetAllReady() {
    Object.values(this.#teams).forEach((team) => team.resetReady());
  }

  get teams() {
    return this.#teams;
  }

  get teamNames() {
    return Object.keys(this.#teams);
  }

  /**
   * @param {CompRettyTeam} value
   */
  set queue(value) {
    this.removeQueue();
    if (value == null) {
      this.#queue = null;
      return;
    }
    if (value instanceof CompRettyTeam) {
      this.#queue = value;
      Object.values(value.players).forEach((player) => this.#playerTeams[player.id] = value);
    }
  }

  set queueOnly(value) {
    this.#queueOnly = value;
  }

  getTeam(name) {
    if (name == 'cr_queue') return this.#queue;
    return this.#teams[name];
  }

  removeTeam(name) {
    Object.keys(this.#teams[name].players).forEach((id) => delete this.#playerTeams[id]);
    delete this.#teams[name];
  }

  removeQueue() {
    var _team = this.#queue;
    if (_team == null) return;
    Object.keys(_team.players).forEach((id) => delete this.#playerTeams[id]);
    this.#queue = null;
  }

  createTeam(name) {
    this.#teams[name] = new CompRettyTeam(name);
  }

  renameTeam(name, newName) {
    var _team = this.getTeam(name);
    if (_team == null) return;
    if (this.getTeam(newName) != null) return;
    delete this.#teams[name];
    _team.name = newName;
    this.#teams[newName] = _team;
  }

  getPlayerTeam(playerID) {
    return this.#playerTeams[playerID];
  }

  setPlayerTeam(playerID, teamName) {
    var _team = this.#playerTeams[playerID];
    if (_team != null) _team.removePlayer(playerID);
    _team = this.getTeam(teamName);
    _team.getOrCreatePlayer(playerID);
    this.#playerTeams[playerID] = _team;
  }

  removePlayer(id) {
    var _team = this.#playerTeams[id];
    if (_team == null) return;
    _team.removePlayer(id);
    delete this.#playerTeams[id];
    return _team;
  }
  
  clearPlayers() {
    Object.values(this.#teams).forEach((team) => team.clearPlayers());
    var _queue = this.#queue;
    if (_queue != null) _queue.clearPlayers();
    this.#playerTeams = {};
  }

  setPlayerReady(id, value) {
    var _team = this.#playerTeams[id];
    if (_team == null) return;
    _team.setPlayerReady(id, value);
  }

  shuffle() {
    var _playerIDs = Object.keys(this.#playerTeams);
    if (_playerIDs.length == 0) return;
    this.clearPlayers();
    var _teams = Object.values(this.#teams);
    var _currentSortTeams = Object.values(this.#teams);
    while (_playerIDs.length != 0) {
      if (_currentSortTeams == null) {
        var _minPlayers = 100000;
        _currentSortTeams = [];
        _teams.forEach((team) => {
          if (team.playerCount > _minPlayers) return;
          if (team.playerCount == team.maxPlayers) return;
          if (team.playerCount == _minPlayers) {
            _currentSortTeams.push(team);
            return;
          }
          _minPlayers = team.playerCount;
          _currentSortTeams = [team];
        });
      }
      while (_currentSortTeams.length != 0) {
        var _teamIndex = ranInt(0, _currentSortTeams.length - 1);
        var _team = _currentSortTeams[_teamIndex];
        var _playerIndex = ranInt(0, _playerIDs.length - 1);
        var _playerID = _playerIDs[_playerIndex];
        _playerIDs.splice(_playerIndex, 1);
        this.setPlayerTeam(_playerID, _team.name);
        if (_playerIDs.length == 0) return;
        _currentSortTeams.splice(_teamIndex, 1);
      }
      _currentSortTeams = null;
    }
  }

  sendPermissionDenied(interaction) {
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Permission denied. :lock:'));
  }

  async sendTeamsInfo(channelID) {
    if (this.#queueOnly) {
      var queue = this.#queue;
      if (queue != null) return await queue.sendTeamInfo(channelID);
      return;
    }
    var _teams = Object.values(this.#teams);
    for (let i = 0; i < _teams.length; i++) await _teams[i].sendTeamInfo(channelID);
  }

  async setupWizard(interaction, updateMessage = false, teamIndex = 0) {
    if (teamIndex == 'new_team') {
      teamIndex = Object.keys(this.#teams).length;
      if (teamIndex != 15) {
        this.createTeam(generateTeamName());
        await this._onSave();
      }
    }
    var _options = [];
    var i = 0;
    Object.values(this.#teams).forEach((value) => {
      var _description;
      if (value.description == '') _description = 'No description';
      else _description = value.description;
      _options.push({
        value: i,
        label: value.name,
        description: _description,
      });
      i++;
    });
    var _length = _options.length;
    var _disabled = false;
    if (_length == 0) {
      _disabled = true;
    }
    if (_length != 15) {
      _options = [
        ..._options,
        {
          value: 'new_team',
          label: 'Add a new team',
          description: `Team #${_length + 1}`,
          emoji: {
            id: null,
            name: '➕',
          },
        },        
      ];
    }
    var _chosenOption = _options[teamIndex];
    if (_chosenOption == null) {
      teamIndex = 0;
      _chosenOption = _options[0];
    }
    else if (_chosenOption.value == 'new_team') {
      teamIndex = 0;
      _chosenOption = _options[0];
    }
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _team = this.getTeam(_chosenOption.label);
    var _image;
    if (_team != null) {
      var _imageURL = _team.imageURL.split('://');
      if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: _team.imageURL };
    }
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: [{
          title: 'Setup Teams',
          color: embedColor,
          timestamp: new Date().toISOString(),
          footer: embedFooter,
          thumbnail: _image,
          author: embedAuthor,
          fields: [
            {
              name: _chosenOption.label,
              value: _chosenOption.description,
            }
          ]
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'setup teams get',
                options: _options,
                placeholder: _chosenOption.label,
              },
            ],
          },
          {
            type: 1,
            components: [
              {
                type: 2,                
                custom_id: `setup teams name "${_chosenOption.label}"`,
                disabled: _disabled,
                style: 1,
                label: 'Name',
                emoji: {
                  id: null,
                  name: '🛡️',
                },
              },
              {
                type: 2,                
                custom_id: `setup teams description "${_chosenOption.label}"`,
                disabled: _disabled,
                style: 2,
                label: 'Description',
                emoji: {
                  id: null,
                  name: '📝',
                },
              },
              {
                type: 2,                
                custom_id: `setup teams image_url "${_chosenOption.label}"`,
                disabled: _disabled,
                style: 2,
                label: 'Image',
                emoji: {
                  id: null,
                  name: '🖌️',
                },
              },
              {
                type: 2,
                custom_id: `setup teams remove "${_chosenOption.label}"`,
                disabled: _disabled,
                style: 4,
                label: 'Remove',
                emoji: {
                  id: null,
                  name: '🗑️',
                },
              },
            ]
          },
        ],
      },
      _type,
    ));
  }

  _teamNameModal(interaction, teamName) {
    var _team = this.#teams[teamName];
    if (_team == null) return this.setupWizard(interaction, true);
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Team Name',
        `setup teams name "${teamName}"`,
        {
          type: 4,
          custom_id: 'name',
          label: 'Team name',
          style: 1,
          min_length: 1,
          max_length: 50,
          value: teamName,
        },
      ),
      9,
    ));
  }

  _teamDescriptionModal(interaction, teamName) {
    var _team = this.#teams[teamName];
    if (_team == null) return this.setupWizard(interaction, true);
    var _value;
    if (_team.description != '') _value = _team.description;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Team Description',
        `setup teams description "${teamName}"`,
        {
          type: 4,
          custom_id: 'description',
          label: 'Team description',
          style: 1,
          min_length: 1,
          max_length: 100,
          value: _value,
        }
      ),
      9,
    ));
  }

  _teamImageModal(interaction, teamName) {
    var _team = this.#teams[teamName];
    if (_team == null) return this.setupWizard(interaction, true);
    var _value;
    if (_team.imageURL != '') _value = _team.imageURL;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Team Image',
        `setup teams image_url "${teamName}"`,
        {
          type: 4,
          custom_id: 'image_url',
          label: 'Team image URL',
          style: 1,
          min_length: 1,
          max_length: 256,
          value: _value,
        },
      ),
      9,
    ));
  }

  async setup(interaction) {
    if (burstStacksStarted) burstStack10.set(`updGldCmds${interaction.guild_id}`, () => this.updateGuildCommands(interaction));
    var _command =  interaction.data.custom_id.split(' ');
    var _arg2 = _command[2];
    if (_arg2 == null) return await this.setupWizard(interaction);
    var _team;
    var _val;
    if (_arg2 != 'get') {
      var _teamName =  interaction.data.custom_id.split('"')[1];
      _team = this.getTeam(_teamName);
      if (_team == null) return await this.setupWizard(interaction, true);
      var _components = interaction.data.components;
      if (_components != null) _val = _components[0].components[0].value;
    }
    switch (_arg2) {
    case 'get':
      var _value = interaction.data.values['0'];
      if (_value != 'new_team') _value = Number.parseInt(_value);
      return await this.setupWizard(interaction, true, _value);
    case 'name':
      if (_val == null) return await this._teamNameModal(interaction, _team.name);
      _val = _val.slice(0, 50);
      if (this.getTeam(_val) != null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`A team with name ${_val} already exists. :exploding_head:`));
      this.renameTeam(_team.name, _val);
      await this._onSave();
      return await this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    case 'description':
      if (_val == null) return await this._teamDescriptionModal(interaction, _team.name);
      _val = _val.slice(0, 100);
      _team.description = _val;
      await this._onSave();
      return await this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    case 'image_url':
      if (_val == null) return await this._teamImageModal(interaction, _team.name);
      _val = _val.slice(0, 256);
      _team.imageURL = _val;
      await this._onSave();
      return await this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    case 'remove':
      this.removeTeam(_team.name);
      await this._onSave();
      return await this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    }
  }

  teamsWizard(interaction, isAdmin = false, updateMessage = false, teamName, teamsControls = false) {
    var _options = [];
    this.values.forEach((value) => {
      var _description;
      if (value.description != '') _description = value.description;      
      _options.push({
        value: value.name,
        label: value.name,
        description: _description,
      });
    });
    var _playerID = interaction.member.user.id;
    var _team = this.getTeam(teamName);
    var _isQueue;
    if (teamName == 'cr_queue') {
      _isQueue = true;
    } else {
      _isQueue = false;
    }
    if (_team == null) {
      _isQueue = false;
      var _playerTeam = this.getPlayerTeam(_playerID);
      if (_playerTeam == null) {
        teamName = _options[0].label;
        _team = this.getTeam(teamName);
        if (_team == null) return this.teamsWizard(interaction, isAdmin, updateMessage, teamName, teamsControls);
      } else {
        teamName = _playerTeam.name;
        _team = _playerTeam;
      }
    }
    var _description;
    if (_team.description == '') _description = 'No description';
    else _description = _team.description;
    var _readyPlayers = Object.keys(_team.readyPlayers);
    var _notReadyPlayers = Object.keys(_team.notReadyPlayers);
    var _players = Object.keys(_team.players);
    if (_readyPlayers.length != 0 || _notReadyPlayers.length != 0) {
      _description += `\n\n**${_readyPlayers.length}/${_team.playerCount} players ready.**`;
    }
    if (_readyPlayers.length != 0) {
      var _readyDescription = `:shield: **Ready players:**\n`;
      _description += `\n\n${_readyDescription}`;
      _readyPlayers.forEach((playerID) => {
        var _index = _players.indexOf(playerID);
        _description += `${_index == -1 ? '' : `${_index + 1}:`}<@${playerID}> `;
      });
    }
    if (_notReadyPlayers.length != 0) {
      var _notReadyDescription = ':sleeping: **Not ready players:**\n';
      _description += `\n\n${_notReadyDescription}`;
      _notReadyPlayers.forEach((playerID) => {
        var _index = _players.indexOf(playerID);
        _description += `${_index == -1 ? '' : `${_index + 1}:`}<@${playerID}> `;
      });
    }
    var _buttons = [];
    var _isNotMember;
    var _player = _team.getPlayer(interaction.member.user.id);
    if (_player == null) _isNotMember = true;
    else _isNotMember = false;
    if (_isNotMember) {
      _buttons.push({
        type: 2,
        custom_id: `competition teams join "${_isQueue ? 'cr_queue' : teamName}"`,
        label: 'Join',
        style: 1,
      });      
    } else {
      _buttons.push({
        type: 2,
        custom_id: `competition teams leave${_isQueue ? ' "cr_queue"' : ''}`,
        label: 'Leave',
        style: 4,
      });
    }
    if (_player == null) {
      _buttons.push(
        {
          type: 2,
          custom_id: 'competition teams ready true',
          label: `Ready`,
          style: 2,
          disabled: true,
        },
      );
    } else {
      if (_player.ready) {
        _buttons.push(
          {
            type: 2,
            custom_id: 'competition teams ready false',
            label: `Unready`,
            style: 4,
          },
        );
      } else {
        _buttons.push(
          {
            type: 2,
            custom_id: 'competition teams ready true',
            label: `Ready`,
            style: 1,
          },
        );
      }
    }
    if (_isQueue) _buttons.pop();
    _buttons.push(
      {
        type: 2,
        custom_id: `competition teams refresh "${_isQueue ? 'cr_queue' : teamName}"`,
        label: 'Refresh',
        style: 2,
        emoji: {
          id: null,
          name: '🔄',
        },
      },
    );
    if (isAdmin || !_isNotMember) {
      _buttons.push(
        {
          type: 2,
          custom_id: `competition teams ping not_ready "${_isQueue ? 'cr_queue' : teamName}"`,
          label: 'Ping not ready',
          style: 4,
          emoji: {
            id: null,
            name: '🔔',
          },
        }
      );
    }
    var _teamNames = Object.keys(this.#teams);
    var _teamIndex = _teamNames.indexOf(_team.name);
    var _arrowButtons = [];
    if (_teamIndex != -1) {
      if (_teamIndex == 0) {
        _arrowButtons.push(
          {
            type: 2,
            custom_id: `competition teams refresh "${_teamNames[_teamNames.length - 1]}" left`,
            style: 2,
            emoji: {
              id: null,
              name: '⬅️',
            },
          }
        );
      } else {
        _arrowButtons.push(
          {
            type: 2,
            custom_id: `competition teams refresh "${_teamNames[_teamIndex - 1]}" left`,
            style: 1,
            emoji: {
              id: null,
              name: '⬅️',
            },
          }
        );
      }
      if (_teamIndex == (_teamNames.length - 1)) {
        _arrowButtons.push(
          {
            type: 2,
            custom_id: `competition teams refresh "${_teamNames[0]}" right`,
            style: 2,
            emoji: {
              id: null,
              name: '➡️',
            },
          }
        );
      } else {
        _arrowButtons.push(
          {
            type: 2,
            custom_id: `competition teams refresh "${_teamNames[_teamIndex + 1]}" right`,
            style: 1,
            emoji: {
              id: null,
              name: '➡️',
            },
          }
        );
      }
    }
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _image;
    var _imageURL = _team.imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: _team.imageURL };
    var _message = {
      flags: 1 << 6,
      content: `${this.playerCount} player(s) entered this competition.`,
      embeds: [{
        title: _isQueue ? 'Player queue' : teamName,
        description: _description,
        color: embedColor,
        timestamp: new Date().toISOString(),
        thumbnail: _image,
      }],
      components: [
        {
          type: 1,
          components: _buttons,
        },
      ],
    };
    if (teamsControls) {
      _message.components.splice(0, 0, {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'competition teams',
                placeholder: teamName,
                options: _options,
              },
            ],
          },
        );
      _message.components.push(
        {
          type: 1,
          components: _arrowButtons,
        }
      );
    }
    if (updateMessage == null) return this.#rest.createFollowupMessage(interaction, JSON.stringify(_message));
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(_message, _type));  
  }

  _logEvents(channelID, events) {
    if (channelID == true) return events;
    var _contentIndex = 0;
    var _contents = [''];
    for (let i = 0; i != events.length; i++) {
      _contents[_contentIndex] += `> ${events[i].message}\\n`;
      if (i != 0) {
        if (((i + 1) % 15) == 0) {
          _contents.push('');
          _contentIndex++;
        }
      }
    }
    _contents.forEach((content) => this.#rest.createMessage(channelID, `{"content":"${content}","allowed_mentions":{"parse":[]}}`));
  }

  logEvent(channelID, event) {
    if (!this.#logEnabled) return;
    var _events = [];
    _events.push(event);
    if (!burstStacksStarted) {
      return this._logEvents(channelID, _events);
    }
    var _stackName = `log${channelID}`;
    var _logEvents = burstStack10.get(_stackName);
    if (_logEvents == null) {
      burstStack10.set(_stackName, (_channelID = channelID) => {
        return this._logEvents(_channelID, _events);
      });
      return;
    }
    burstStack10.remove(_stackName);
    _events = _logEvents(true);
    _events.push(event);
    burstStack10.set(_stackName, (_channelID = channelID) => {
      return this._logEvents(_channelID, _events);
    });
  }

  async sendTeamsWizards(interaction, isAdmin = false) {
    if (this.#queueOnly) {
      return await this.teamsWizard(interaction, isAdmin, null, 'cr_queue');
    }
    var _teamNames = Object.keys(this.#teams);
    for (let i = 0; i < _teamNames.length; i++) {
      await this.teamsWizard(interaction, isAdmin, null, _teamNames[i]);
    }
    if (this.#queue != null) await this.teamsWizard(interaction, isAdmin, null, 'cr_queue');
  }

  async onPlayerLeave(interaction) {
    var _playerID = interaction.member.user.id;
    var _user = interaction.member.user;
    var _username = _user.username;
    if (_user.discriminator != '0') _username += '#' + _user.discriminator;
    var _team = this.getPlayerTeam(_playerID);
    if (_team == null) {
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('You are not a member of any team. :spy:'));
    } else {
      var _teamName = _team.name;
      _team.dmReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> (\`@${_username}\`) left ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}.\\n\\nYou are no longer marked ready, make sure that the team arrangement is still good at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
      this.removePlayer(_playerID);
      this.logEvent(interaction.channel_id, new CompRettyEvent(_playerID, _teamName, CompRettyEventType.Joined, `<@${_playerID}> (\`@${_username}\`) left ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`} (${_team.playerCount})   /   **${this.playerCount} player(s) entered**.`));
      await this._onSave();
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have left ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}. :levitate:`));
    }
  }

  async _onJoinRandom(interaction) {
    var _availableTeams = [];
    Object.values(this.#teams).forEach((team) => {
      if (Object.keys(team.players).length < team.maxPlayers) _availableTeams.push(team);
    });
    if (_availableTeams.length == 0) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('All teams are full. :no_entry:'));
    var _playerID = interaction.member.user.id;
    var _user = interaction.member.user;
    var _username = _user.username;
    if (_user.discriminator != '0') _username += '#' + _user.discriminator;
    var _teamIndex = ranInt(0, _availableTeams.length - 1);
    var _team = _availableTeams[_teamIndex];
    var _teamName = _team.name;
    _team.dmReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> (\`@${_username}\`) joined team ${_teamName}.\\n\\nYou are no longer marked ready, make sure that the team arrangement is still good at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
    this.setPlayerTeam(_playerID, _teamName);
    await this._onSave();
    this.logEvent(interaction.channel_id, new CompRettyEvent(_playerID, _teamName, CompRettyEventType.Joined, `<@${_playerID}> (\`@${_username}\`) joined team ${_teamName} (${_team.playerCount})   /   **${this.playerCount} player(s) entered**.`));
    return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have been randomly assigned to team ${_teamName}. :game_die:`));
  }
  
  async updateGuildCommands(interaction) {
    var _joinCommand = {
      name: commands[7].name,
      dm_permission: commands[7].dm_permission,
      description: joinDesc,
      type: commands[7].type,
      options: [
        {
          name: 'queue',
          dm_permission: false,
          description: joinQueueDesc,
          type: 1,
        },
        {
          name: 'random',
          dm_permission: false,
          description: joinRandomDesc,
          type: 1,
        },
      ],
    };
    if (!this.#queueOnly) {
      _joinCommand.options.splice(0, 0, {
          name: 'team',
          dm_permission: false,
          description: joinTeamDesc,
          type: 1,
          options: [
            {
              name: 'team',
              dm_permission: false,
              description: 'Team name',
              type: 3,
              required: true,
              autocomplete: true,
            },
          ],
        });
    }
    await this.#rest.bulkOverwriteGuildApplicationCommands(interaction.application_id, interaction.guild_id, JSON.stringify([
      _joinCommand,
    ]));
  }

  async _onJoinTeam(interaction, isAdmin = false, teamName) {
    var _playerID = interaction.member.user.id;
    var _user = interaction.member.user;
    var _username = _user.username;
    if (_user.discriminator != '0') _username += '#' + _user.discriminator;
    {
      var _lastTeam = this.getPlayerTeam(_playerID);
      if (_lastTeam != null) _lastTeam.dmReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> (\`@${_username}\`) joined team ${teamName}.\\n\\nYou are no longer marked ready, make sure that the team arrangement is still good at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
    }
    var _team = this.getTeam(teamName);
    if (_team == null) return await this.teamsWizard(interaction, isAdmin, true);
    var _playerCount = Object.keys(_team.players).length;
    if (_playerCount >= _team.maxPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Team ${teamName} is full - ${_playerCount}/${_team.maxPlayers} players. :no_entry:`));
    _team.dmReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> (\`@${_username}\`) joined team ${teamName}.\\n\\nYou are no longer marked ready, make sure that the team arrangement is still good at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
    this.setPlayerTeam(_playerID, teamName);
    await this._onSave();
    this.logEvent(interaction.channel_id, new CompRettyEvent(_playerID, teamName, CompRettyEventType.Joined, `<@${_playerID}> (\`@${_username}\`) joined team ${teamName} (${_team.playerCount})   /   **${this.playerCount} player(s) entered**.`));
  }

  async _onJoinQueue(interaction, isWizard = false) {
    var _playerID = interaction.member.user.id;
    var _user = interaction.member.user;
    var _username = _user.username;
    if (_user.discriminator != '0') _username += '#' + _user.discriminator;
    var _team = this.#queue;
    if (_team == null) {
      if (isWizard) return await this.teamsWizard(interaction, isAdmin, true);
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Player queue is disabled for this competition. :no_entry_sign:`));
    }
    if (_team.getPlayer(_playerID) != null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You are already in player queue. :hourglass:`));
    {
      var _lastTeam = this.getPlayerTeam(_playerID);
      if (_lastTeam != null) {
        _lastTeam.dmReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> (\`@${_username}\`) joined player queue.\\n\\nYou are no longer marked ready, make sure that the team arrangement is still good at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
        _lastTeam.removePlayer(_playerID);
      }
    }
    var _playerCount = Object.keys(_team.players).length;
    if (_playerCount >= _team.maxPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Player queue is full - ${_playerCount}/${_team.maxPlayers} players. :no_entry:`));
    _team.getOrCreatePlayer(_playerID);
    this.#playerTeams[_playerID] = _team;
    await this._onSave();
    this.logEvent(interaction.channel_id, new CompRettyEvent(_playerID, 'cr_queue', CompRettyEventType.Joined, `<@${_playerID}> (\`@${_username}\`) joined player queue (${_team.playerCount})   /   **${this.playerCount} player(s) entered**.`));
  }

  async _onKickPlayer(interaction, playerID) {
    var _playerTeam = this.getPlayerTeam(playerID);
    if (_playerTeam == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Player is not a member of any team. :face_in_clouds:`));
    this.removePlayer(playerID);
    await this._onSave();
    var _teamName = _playerTeam.name;
    var _msg = `<@${interaction.member.user.id}> kicked <@${playerID}> from ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}. :wind_blowing_face:`;
    this.#rest.createDMMessage(playerID, `{"content":"> ${this.#competitionName}: ${_msg}\\n\\nhttps://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
    this.logEvent(interaction.channel_id, new CompRettyEvent(playerID, _teamName, CompRettyEventType.Left, _msg));
    return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Kicked player <@${playerID}> from team ${_playerTeam.name} :wind_blowing_face:`));
  }

  async _coinFlip(interaction, arg1) {
    switch (arg1) {
    case 'captains':
      var _players = Object.keys(this.#playerTeams);
      if (_players.length == 0) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`No players have entered the competition. :empty_nest:`));
      var _teamNames = Object.keys(this.#teams);
      if (_teamNames.length == 0) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`No players have entered the competition. :empty_nest:`));
      var _fields = [];
      while ((_players.length != 0) && (_teamNames.length != 0)) {
        var _random;
        if (_players.length == 1) _random = 0;
        else _random = ranInt(0, _players.length - 1);
        var _id = _players[_random];
        _players.splice(_random, 1);
        if (_teamNames.length == 1) _random = 0;
        else _random = ranInt(0, _teamNames.length - 1);
        var _teamName = `:shield: ${_teamNames[_random]}`;
        _teamNames.splice(_random, 1);
        var _player = `<@${_id}>`;
        _fields.push({
          name: _teamName,
          value: _player,
        });
      }
      if (_teamNames.length != 0) {
        for (let i = 0; i != _teamNames.length; i++) {
          var _teamName = `:shield: ${_teamNames[i]}`;
          _fields.push({
            name: _teamName,
            value:  'No players.',
          });
        }
      }
      _fields.sort((a, b) => a.name.localeCompare(b.name));
      return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
        {
          embeds: [{
            title: ':coin: Coin flip :coin:',
            color: embedColor,
            timestamp: new Date().toISOString(),
            footer: embedFooter,
            description: ':crown: **Team captains:**',
            thumbnail: {
              url: logoURL,
            },
            author: embedAuthor,
            fields: _fields,
          }],
        },
        4,
      ));
    case 'heads_or_tails':
      var random = ranInt(0, 1);
      return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
        {
          embeds: [{
            title: ':coin: Coin flip :coin:',
            color: embedColor,
            timestamp: new Date().toISOString(),
            footer: embedFooter,
            description: random == 1 ? ':exploding_head: Heads :exploding_head:' : ':fox: Tails :fox:',
            thumbnail: {
              url: logoURL,
            },
            author: embedAuthor,
          }],
        },
        4,
      ));
    case 'coin':
      var random = ranInt(0, 1);
      return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
        {
          embeds: [{
            title: ':coin: Coin flip :coin:',
            color: embedColor,
            timestamp: new Date().toISOString(),
            footer: embedFooter,
            description: random == 1 ? ':exploding_head: Heads :exploding_head:' : ':fox: Tails :fox:',
            thumbnail: {
              url: logoURL,
            },
            author: embedAuthor,
          }],
        },
        4,
      ));
    }
  }

  async execute(interaction, isAdmin = false) {
    if (burstStacksStarted) burstStack10.set(`updGldCmds${interaction.guild_id}`, () => this.updateGuildCommands(interaction));
    if (Object.keys(this.#teams).length == 0) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`There are no teams set up for this competition. :empty_nest:`));
    var _arg1;
    var _arg2;
    var _option;
    var _option2;
    var _playerID = interaction.member.user.id;
    if (interaction.data.options != null) {
      _option = interaction.data.options[0];
      if (_option != null) {
        _arg1 = _option.name;
        if (_option.options != null) {
          _option2 = _option.options[0];
          if (_option2 != null) {
            _arg2 = _option2.name;
          }
        }
      }
    }
    async function _onJoin() {
      switch (_arg1) {
      case 'random': return await this._onJoinRandom(interaction);
      case 'team':
        if (_option2 == null) return;
        var _teamNames = Object.keys(this.#teams);
        var _reqTeamName = _option2.value;
        if (_option2.focused == true) {
          var _choices = [];
          _teamNames.sort((a, b) => simpleStringMatchAccuracy(b.toLowerCase(), _reqTeamName.toLowerCase()) - simpleStringMatchAccuracy(a.toLowerCase(), _reqTeamName.toLowerCase()));
          _teamNames.forEach((name) => _choices.push({ name: name, value: name }));
          if (_choices.length > 15) _choices.splice(15);
          return await this.#rest.createInteractionResponse(interaction, JSON.stringify({ type: 8, data: { choices: _choices } }));
        }
        if (_teamNames.indexOf(_reqTeamName) == -1) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Team with name ${_reqTeamName} does not exist. :exploding_head:`));
        await this._onJoinTeam(interaction, isAdmin, _reqTeamName);
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have joined team ${_reqTeamName}. :shield:`));
      case 'queue':
        if (await this._onJoinQueue(interaction) != null) return;
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have joined player queue. :hourglass:`));
      default:
        var _team = this.#queue;
        if (_team == null) return;
        var response = await this._onJoinQueue(interaction);
        if (response != null) return response;
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have joined player queue. :hourglass:`));
      }
    }
    switch (interaction.data.name) {
    case 'kick':
      if (!isAdmin) return await this.sendPermissionDenied(interaction);
      switch (_arg1) {
      case 'all':
        var _msg = `<@${interaction.member.user.id}> kicked all players from all teams. :cloud_tornado:`;
        this.dmPlayers(`{"content":"> ${this.#competitionName}: ${_msg}\\n\\nhttps://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
        this.clearPlayers();
        await this._onSave();
        this.logEvent(interaction.channel_id, new CompRettyEvent(null, null, CompRettyEventType.Left, _msg));
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Kicked all players from all teams. :cloud_tornado:`));
      case 'player':
        var _playerID = _option.options[0].value;
        return await this._onKickPlayer(interaction, _playerID);
      }
      return;
    case 'join':
      var response = await _onJoin.apply(this, []);
      if (response != null) return response;
    case 'pug':
      var response = await _onJoin.apply(this, []);
      if (response != null) return response;
    case 'leave': return await this.onPlayerLeave(interaction);
    case 'unpug': return await this.onPlayerLeave(interaction);
    case 'ready':
      var _team = this.getPlayerTeam(_playerID);
      if (_team == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('You are not a member of any team. :spy:'));
      _teamName = _team.name;
      if (_teamName == 'cr_queue') {
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Can not ready up in a queue, only allowed when in a team. :no_entry_sign:`));
      }
      if (Object.keys(_team.players).length < _team.minPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Your team needs at least ${_team.minPlayers} players to start. :busts_in_silhouette:`));
      this.setPlayerReady(_playerID, true);
      await this._onSave(false);
      if (this.#onAllReady != null) if (this.allReady) return await this.#onAllReady(interaction);
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You are marked ready. :shield:`));
    case 'unready':
      var _team = this.getPlayerTeam(_playerID);
      if (_team == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('You are not a member of any team. :spy:'));
      _teamName = _team.name;
      if (Object.keys(_team.players).length < _team.minPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Your team needs at least ${_team.minPlayers} players to start. :busts_in_silhouette:`));
      this.setPlayerReady(_playerID, false);
      await this._onSave(false);
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You are marked not ready. :sleeping:`));
    case 'get_player_name':
      if (_option == null) return;
      var _playerIds = Object.keys(this.#playerTeams);
      var _reqPlayerId = _option.value;
      if (_option.focused == true) {
        var _choices = [];
        _playerIds.sort((a, b) => linearStringMatchAccuracy(b.toLowerCase(), _reqPlayerId.toLowerCase()) - linearStringMatchAccuracy(a.toLowerCase(), _reqPlayerId.toLowerCase()));
        _playerIds.forEach((name) => _choices.push({ name: name, value: name }));
        if (_choices.length > 15) _choices.splice(15);
        return await this.#rest.createInteractionResponse(interaction, JSON.stringify({ type: 8, data: { choices: _choices } }));
      }
      if (_playerIds.indexOf(_reqPlayerId) == -1) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`<@${_reqPlayerId}> is not in the player list. :spy:`));
      var _error = `Unable to find <@${_reqPlayerId}>'s name. :exploding_head:`;
      var _user = await this.#rest.getUser(_reqPlayerId);
      var _info = `<@${_reqPlayerId}> - \`<@${_reqPlayerId}>\``;
      if (_user == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(_error));
      var _username = _user.username;
      if (_username == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(_error));
      _info += ` - \`@${_username}`;
      var _discriminator = _user.discriminator;
      if (_discriminator == '0') _info += `\``;
      else _info += `#${_discriminator}\``;
      var _globalName = _user.global_name;
      if (_globalName != null) _info += ` - \`@${_globalName}\``;
      var _displayName = _user.display_name;
      if (_displayName != null) _info += ` - \`@${_displayName}\``;
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`${_info} :bust_in_silhouette:`));
    case 'coin_flip': return await this._coinFlip(interaction, _arg1);
    case 'flip': return await this._coinFlip(interaction, _arg1);
    case 'coin': return await this._coinFlip(interaction, 'coin');
    case 'Kick player':
      _playerID = interaction.data.target_id;
      if (interaction.data.resolved.members != null) if (!isAdmin) return await this.sendPermissionDenied(interaction);
      return await this._onKickPlayer(interaction, _playerID);
    case 'Kick mentioned player':
      _playerID = getFirstRole(interaction.data.resolved.messages[interaction.data.target_id].content);
      if (!isAdmin) return await this.sendPermissionDenied(interaction);
      return await this._onKickPlayer(interaction, _playerID);
    }
    var _command =  interaction.data.custom_id.split(' ');
    var _teamName =  interaction.data.custom_id.split('"')[1];
    var _arg2 = _command[2];
    var _arg3 = _command[3];
    switch (_arg2) {
    case 'refresh':
      return await this.teamsWizard(interaction, isAdmin, true, _teamName);
    case 'join': {
      if (_teamName == 'cr_queue') {
        if (await this._onJoinQueue(interaction, true) != null) return;
        return await this.teamsWizard(interaction, isAdmin, true, 'cr_queue');
      }
      if (await this._onJoinTeam(interaction, isAdmin, _teamName) != null) return;
      return await this.teamsWizard(interaction, isAdmin, true, _teamName);
    }
    case 'join_random': return await this._onJoinRandom(interaction);
    case 'join_queue':
      if (await this._onJoinQueue(interaction) != null) return;
      return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have joined player queue. :hourglass:`));
    case 'ready':
      var _team = this.getPlayerTeam(_playerID);
      if (_team == null) return await this.teamsWizard(interaction, isAdmin, true);
      _teamName = _team.name;
      if (_teamName == 'cr_queue') {
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Can not ready up in a queue, only allowed when in a team. :no_entry_sign:`));
      }
      if (Object.keys(_team.players).length < _team.minPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Your team needs at least ${_team.minPlayers} players to start. :busts_in_silhouette:`));
      this.setPlayerReady(_playerID, JSON.parse(_arg3));
      await this._onSave(false);
      if (this.#onAllReady != null) if (this.allReady) return await this.#onAllReady(interaction);
      return await this.teamsWizard(interaction, isAdmin, true, _teamName);
    case 'leave':
      var _team = this.getPlayerTeam(_playerID);
      var _isQueue = _teamName == 'cr_queue';
      if (_team == null) _teamName = '';
      else {
        _teamName = _team.name;
        _team.dmReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> left ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}.\\n\\nYou are no longer marked ready, make sure that the team arrangement is still good at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
        this.removePlayer(_playerID);
        this.logEvent(interaction.channel_id, new CompRettyEvent(_playerID, _teamName, CompRettyEventType.Joined, `<@${_playerID}> left ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`} (${_team.playerCount})   /   **${this.playerCount} player(s) entered**.`));
        await this._onSave();
      }
      if (_arg3 == 'minimalist') {
        if (_team == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('You are not a member of any team. :spy:'));
        return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You have left ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}. :levitate:`));
      }
      return await this.teamsWizard(interaction, isAdmin, true, _isQueue ? 'cr_queue' : _teamName);
    case 'ping':
      var _isQueue = _teamName == 'cr_queue';
      var _team = this.getTeam(_teamName);
      if (_team == null) return await this.teamsWizard(interaction, isAdmin, true);
      _teamName = _team.name;
      if (_team.getPlayer(_playerID) == null) if (!isAdmin) return this.teamsWizard(interaction, isAdmin, true);
      switch (_arg3) {
      case 'not_ready':
        var _response = await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Pinging not ready players in ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}. :mega:`));
        this.#rest.createMessage(interaction.channel_id, `{"content":"> <@${_playerID}> pinged not ready players in ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}. :mega:","allowed_mentions":{"parse":[]}}`);
        _team.dmNotReadyPlayers(`{"content":"> ${this.#competitionName}: <@${_playerID}> pinged not ready players in ${_teamName == 'cr_queue' ? 'player queue' : `team ${_teamName}`}. :mega:\\n\\nYou can vote to shuffle or ready up at https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
        return _response;
      }
    }
    if (interaction.data.values == null) {
      var response;
      if (this.#queueOnly) {
        _response = await this.teamsWizard(interaction, isAdmin, false, 'cr_queue');
      } else {
        var _teamNames = Object.keys(this.#teams);
        _response = await this.teamsWizard(interaction, isAdmin, false, _teamNames[0]);
        for (let i = 1; i < _teamNames.length; i++) {
          await this.teamsWizard(interaction, isAdmin, null, _teamNames[i]);
        }
        if (this.#queue != null) await this.teamsWizard(interaction, isAdmin, null, 'cr_queue');  
      }
      return _response;
    }
    return await this.teamsWizard(interaction, isAdmin, true, interaction.data.values[0]);
  }

  async dmPlayers(message) {
    this.values.forEach((team) => team.dmPlayers(message));
    var _queue = this.#queue;
    if (_queue != null) _queue.dmPlayers(message);
  }

  async ghostPingPlayers(channelID) {
    var _teams = this.values;
    for (let i = 0; i < _teams.length; i++) {
      var _team = _teams[i];
      if (_team == null) return;
      await _team.ghostPingPlayers(channelID);
    }
    var _queue = this.#queue;
    if (_queue != null) _queue.ghostPingPlayers(channelID);
  }
}

export class CompRettyVotes {
  #playersAgainst;
  #playersFor;
  #votes;
  #voteThreshold;
  #requiredVotesCount;
  
  constructor(votes = {}, voteThreshold = 0.5) {
    this.#playersAgainst = [];
    this.#playersFor = [];
    var _votesEntries = Object.entries(votes);
    _votesEntries.forEach((entry) => {
      const [key, value] = entry;
      if (value == VoteType.Against) this.#playersAgainst.push(key);
      if (value == VoteType.For) this.#playersFor.push(key);
    });
    this.#votes = votes;
    this.#voteThreshold = voteThreshold;
    this.#requiredVotesCount = Math.ceil(_votesEntries.length * this.#voteThreshold);
  }

  static fromJSON(json) {
    return new CompRettyVotes(
      json.votes,
      json.voteThreshold,
    );
  }

  toJSON() {
    return {
      votes: this.#votes,
      voteThreshold: this.#voteThreshold,
    };
  }

  get length() {
    return Object.keys(this.#votes).length;
  }

  get voteThreshold() {
    return this.#voteThreshold;
  }

  get requiredVotesCount() {
    return this.#requiredVotesCount;
  }

  get againstCount() {
    return Object.keys(this.#playersAgainst).length;
  }

  get forCount() {
    return Object.keys(this.#playersFor).length;
  }

  getVote(playerID) {
    return this.#votes[playerID];
  }

  voteFor(playerID) {
    var _curVote = this.#votes[playerID];
    if (_curVote == VoteType.For) return;
    if (_curVote == VoteType.Against) this.#playersAgainst.splice(this.#playersAgainst.indexOf(_curVote), 1);
    this.#playersFor.push(playerID);
    this.#votes[playerID] = VoteType.For;
  }

  voteAgainst(playerID) {
    var _curVote = this.#votes[playerID];
    if (_curVote == VoteType.Against) return;
    if (_curVote == VoteType.For) this.#playersFor.splice(this.#playersFor.indexOf(_curVote), 1);
    this.#playersAgainst.push(playerID);
    this.#votes[playerID] = VoteType.Against;
  }
}

export class CompRettyShuffle {
  #onFinished;
  #dbPath;
  #jsonPath;
  #rest;
  #channelID;
  #teams;
  #votes;

  constructor(teams, votes = null) {
    if (votes == null) {
      var _players = Object.entries(teams.players);
      var _votes = {};
      _players.forEach((entry) => {
        var [_id, _] = entry;
        _votes[_id] = VoteType.None;
      });
      votes = new CompRettyVotes(_votes);
    }
    this.#teams = teams;
    this.#votes = votes;
  }

  set channelID(value) {
    this.#channelID = value;
  }

  set competitionName(value) {
    this.#teams.competitionName = value
  }

  static withREST(rest, teams, votes = null) {
    var _shuffle = new CompRettyShuffle(teams, votes);
    _shuffle.#rest = rest;
    return _shuffle;
  }

  static fromDB(path, rest = null) {
    var _jsonPath =  Path.join(path, 'shuffle.json');
    var _dbObject = db.get(_jsonPath);
    if (_dbObject != null) return _dbObject;
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _shuffle;
    if (Fs.existsSync(_jsonPath)) {
      var _jsonString = Fs.readFileSync(_jsonPath, { encoding: 'utf8', flag: 'r' });
      var _json = JSON.parse(_jsonString);
      _shuffle = CompRettyShuffle.fromJSON(_json, rest);
      _shuffle.#dbPath = path;
      _shuffle.#jsonPath = _jsonPath;
    } else {
      _shuffle = CompRettyShuffle.withREST(rest, CompRettyTeams.withREST(rest));
      _shuffle.#dbPath = path;
      _shuffle.#jsonPath = _jsonPath;
      _shuffle.saveSync();
    }
    db.register(_jsonPath, _shuffle);
    return _shuffle;
  }

  static fromJSON(json, rest = null) {
    return CompRettyShuffle.withREST(rest, CompRettyTeams.fromJSON(json.teams, rest), CompRettyVotes.fromJSON(json.votes));
  }

  toJSON() {
    return {
      teams: this.#teams.toJSON(),
      votes: this.#votes.toJSON(),
    };
  }

  registerDBPath(path) {
    this.#dbPath = path;
    this.#jsonPath = Path.join(path, 'shuffle.json');
  }

  saveSync() {
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
  }

  rmSync() {
    if (this.#dbPath != null) {
      db.remove(this.#jsonPath);
      Fs.rmSync(this.#jsonPath);
    }
  }

  set onFinished(value) {
    this.#onFinished = value;
  }

  cancel() {
    this.rmSync();
    if (this.#onFinished != null) this.#onFinished();
    return this.#rest.createMessage(this.#channelID, JSON.stringify({ content: '> Shuffle has been cancelled. :sleeping:' }));
  }

  shuffleWizard(interaction, isAdmin = false, updateMessage = false, teamName = null) {
    var _options = [];
    this.#teams.values.forEach((value) => {
      var _description;
      if (value.description != '') _description = value.description;      
      _options.push({
        value: value.name,
        label: value.name,
        description: _description,
      });
    });
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _team
    if (teamName == null) {
      _team = this.#teams.values[0];
    } else {
      _team = this.#teams.getTeam(teamName);
      if (_team == null) _team = this.#teams.values[0];
    }
    var _teamEmbed = _team.getTeamInfoMessage().embeds[0];
    _teamEmbed.fields = [
      {
        name: 'For',
        value: `${this.#votes.forCount}/${this.#votes.requiredVotesCount}`,
        inline: true,
      },
      {
        name: 'Against',
        value: `${this.#votes.againstCount}/${this.#votes.requiredVotesCount}`,
        inline: true,
      },
    ];
    var _components = [
      {
        type: 1,
        components: [{
          type: 3,
          custom_id: 'shuffle get team',
          placeholder: _team.name,
          options: _options,
        }],
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            custom_id: 'shuffle vote for',
            label: 'Vote for',
            style: 3,
            emoji: {
              id: null,
              name: '🎲',
            },
          },
          {
            type: 2,
            custom_id: 'shuffle vote against',
            label: 'Vote against',
            style: 4,
            emoji: {
              id: null,
              name: '🛡️',
            },
          },
          {
            type: 2,
            custom_id: 'shuffle refresh',
            label: 'Refresh',
            style: 2,
            emoji: {
              id: null,
              name: '🔄',
            },
          },
        ],
      },
    ];
    if (isAdmin) {
      _components.push({
        type: 1,
        components: [
          {
            type: 2,
            custom_id: 'shuffle vote for force',
            label: 'Force shuffle',
            style: 4,
            emoji: {
              id: null,
              name: '👑',
            },
          },
          {
            type: 2,
            custom_id: 'shuffle vote against force',
            label: 'Force cancel',
            style: 4,
            emoji: {
              id: null,
              name: '👑',
            },
          },
        ],
      });
    }
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse({
      flags: 1 << 6,
      embeds: [_teamEmbed],
      components: _components,
    }, _type));
  }

  async execute(interaction, isAdmin = false) {
    var _playerID = interaction.member.user.id;
    if (this.#votes.getVote(_playerID) == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('You are not participating in this vote. :no_entry_sign:'));
    var _command = interaction.data.custom_id.split(' ');
    var _arg1 = _command[1];
    var _arg2 = _command[2];
    var _arg3 = _command[3];
    switch (_arg1) {
    case undefined: return await this.shuffleWizard(interaction, isAdmin);
    case 'refresh': return await this.shuffleWizard(interaction, isAdmin, true);
    case 'vote':
      switch (_arg2) {
      case 'for':
        if (isAdmin) {
          if (_arg3 == 'force') {
            this.rmSync();
            var _response = await this.#rest.createInteractionResponse(interaction, getInteractionResponse({content: 'The shuffle has finished. :game_die:', embeds: [], components: []}, 7));
            await this.#rest.createMessage(this.#channelID, JSON.stringify({ content: `> <@${_playerID}> shuffled teams. :game_die:`, allowed_mentions: { parse:[] } }));
            if (this.#onFinished != null) this.#onFinished(this.#teams);
            return _response;
          }
        }
        this.#votes.voteFor(_playerID);
        if (this.#votes.forCount == this.#votes.requiredVotesCount) {
          this.rmSync();
          var _response = await this.#rest.createInteractionResponse(interaction, getInteractionResponse({content: 'The shuffle has finished. :game_die:', embeds: [], components: []}, 7));
          await this.#rest.createMessage(this.#channelID, JSON.stringify({ content: '> The majority has voted to shuffle. :game_die:' }));
          if (this.#onFinished != null) this.#onFinished(this.#teams);
          return _response;
        }
        this.saveSync();
        return await this.shuffleWizard(interaction, isAdmin, true);
      case 'against':
        if (isAdmin) {
          if (_arg3 == 'force') {
            this.rmSync();
            var _response = await this.#rest.createInteractionResponse(interaction, getInteractionResponse({content: 'The shuffle has finished. :game_die:', embeds: [], components: []}, 7));
            await this.#rest.createMessage(this.#channelID, JSON.stringify({ content: `> <@${_playerID}> cancelled the shuffle. :sleeping:`, allowed_mentions: { parse:[] } }));
            if (this.#onFinished != null) this.#onFinished();
            return _response;
          }
        }
        this.#votes.voteAgainst(_playerID);
        if (this.#votes.againstCount == this.#votes.requiredVotesCount) {
          this.rmSync();
          var _response = await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('The shuffle has finished. :game_die:'));
          await this.#rest.createMessage(this.#channelID, JSON.stringify({ content: '> The majority has voted to cancel the shuffle. :sleeping:' }));
          if (this.#onFinished != null) this.#onFinished();
          return _response;
        }
        this.saveSync();
        return await this.shuffleWizard(interaction, isAdmin, true);
      }
      return await this.shuffleWizard(interaction, isAdmin);
    case 'get':
      if (_arg2 == 'team') {
        var _teamName = interaction.data.values[0];
        return await this.shuffleWizard(interaction, isAdmin, true, _teamName);
      }
      return await this.shuffleWizard(interaction, isAdmin);
    }
    return await this.shuffleWizard(interaction, isAdmin);
  }
}

export class CompRettyCompetition {
  #dbPath;
  #jsonPath;
  #rest;
  #enabled;
  #guildID;
  #channelID;
  #name;
  #description;
  #imageURL;
  #shuffleEnabled;
  #competitionRole;
  #teams;
  #queue;
  #shuffle;
  #competitionMessageID;
  #logEnabled;
  #startOnShuffle;
  #autoClearThreshold;
  #autoClearDate;
  #moderatorRoleCheck;
  #queueOnly;

  constructor(name, description = '', imageURL = '', shuffleEnabled = true, competitionRole = null, teams = null, queue = null, queueOnly = false, shuffle = null, competitionMessageID = null, logEnabled = false, startOnShuffle = false, autoClearThreshold = null, autoClearDate = null, moderatorRoleCheck = true) {
    if (teams == null) teams = new CompRettyTeams();
    teams.competitionName = name;
    teams.onSave = async (arrangementChanged) => {
      if (arrangementChanged) {
        if (this.#autoClearDate != null) this.#autoClearDate = addMilliseconds(new Date(), this.#autoClearThreshold);
        await this.cancelShuffle();
      }
      this.saveSync();
    }
    teams.onAllReady = async (interaction) => {
      await this.#rest.createInteractionResponse(interaction, getInteractionResponse({content: 'All teams are ready, the competition is starting. :crossed_swords:', embeds: [], components: []}, 7));
      await this._onAllTeamsReady(interaction);
    };
    if (shuffle != null) {
      shuffle.competitionName = name;
      shuffle.onFinished = (teams) => this._onShuffle(teams);
    }
    if (logEnabled == null) logEnabled = false;
    teams.logEnabled = logEnabled;
    if (startOnShuffle == null) startOnShuffle = false;
    this.#enabled = true;
    this.#name = name;
    this.#description = description;
    this.#imageURL = imageURL;
    this.#shuffleEnabled = shuffleEnabled;
    if (competitionRole == null) this.#competitionRole = null;
    else this.#competitionRole = competitionRole;
    this.#teams = teams;
    this.#queue = queue;
    this.#queueOnly = queueOnly;
    teams.queueOnly = queueOnly;
    this.#shuffle = shuffle;
    this.#competitionMessageID = competitionMessageID;
    this.#logEnabled = logEnabled;
    this.#startOnShuffle = startOnShuffle;
    this.#autoClearThreshold = autoClearThreshold;
    this.#autoClearDate = autoClearDate;
    this.#moderatorRoleCheck = moderatorRoleCheck;
  }

  static withREST(rest, name, description = '', imageURL = '', shuffleEnabled = true, competitionRole = null, teams = null, queue = null, queueOnly = false, shuffle = null, competitionMessageID = null, logEnabled = false, startOnShuffle = false, autoClearThreshold = null, autoClearDate = null, moderatorRoleCheck = true) {
    if (teams == null) teams = CompRettyTeams.withREST(rest);
    var _competition = new CompRettyCompetition(name, description, imageURL, shuffleEnabled, competitionRole, teams, queue, queueOnly, shuffle, competitionMessageID, logEnabled, startOnShuffle, autoClearThreshold, autoClearDate, moderatorRoleCheck);
    _competition.#rest = rest;
    return _competition;
  }

  static fromDB(path, rest = null) {
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _jsonPath =  Path.join(path, 'competition.json');
    var _competition;
    if (Fs.existsSync(_jsonPath)) {
      var _jsonString = Fs.readFileSync(_jsonPath, { encoding: 'utf8', flag: 'r' });
      var _json = JSON.parse(_jsonString);
      _competition = CompRettyCompetition.fromJSON(_json, rest);
      _competition.#dbPath = path;
      _competition.#jsonPath = _jsonPath;
    } else {
      _competition = CompRettyCompetition.withREST(rest, 'Competition');
      _competition.#dbPath = path;
      _competition.#jsonPath = _jsonPath;
      _competition.saveSync();
    }
    return _competition;
  }

  static fromJSON(json, rest = null) {
    var _teams = CompRettyTeams.fromJSON(json.teams, rest);
    var _queue;
    if (json.queue == null) {
      _queue = null;
    } else {
      _queue = CompRettyTeam.fromJSON(json.queue, rest);
      _teams.queue = _queue;
    }
    if (json.queueOnly == null) {
      json.queueOnly = false;
    }
    var _shuffle;
    var _competition;
    if (json.shuffle != null) _shuffle = CompRettyShuffle.fromJSON(json.shuffle, rest);
    else _shuffle = null;
    var _autoClearDate;
    if (json.autoClearDate == null) _autoClearDate = null;
    else _autoClearDate = new Date(json.autoClearDate);
    if (json.moderatorRoleCheck == null) json.moderatorRoleCheck = true;
    _competition = CompRettyCompetition.withREST(rest, json.name, json.description, json.imageURL, json.shuffleEnabled, json.competitionRole, _teams, _queue, json.queueOnly, _shuffle, json.competitionMessageID, json.logEnabled, json.startOnShuffle, json.autoClearThreshold, _autoClearDate, json.moderatorRoleCheck);
    return _competition;
  }

  toJSON() {
    var _autoClearDate;
    if (this.#autoClearDate == null) _autoClearDate = null;
    else _autoClearDate = this.#autoClearDate.toISOString();
    return {
      enabled: this.#enabled,
      name: this.#name,
      description: this.#description,
      imageURL: this.#imageURL,
      shuffleEnabled: this.#shuffleEnabled,
      competitionRole: this.#competitionRole,
      teams: this.#teams.toJSON(),
      queue: this.#queue == null ? null : this.#queue.toJSON(),
      shuffle: this.#shuffle,
      competitionMessageID: this.#competitionMessageID,
      logEnabled: this.#logEnabled,
      startOnShuffle: this.#startOnShuffle,
      autoClearThreshold: this.#autoClearThreshold,
      autoClearDate: _autoClearDate,
      moderatorRoleCheck: this.#moderatorRoleCheck,
      queueOnly: this.#queueOnly,
    };
  }

  saveSync() {
    this.updateCompetitionMessage();
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
  }

  set guildID(value) {
    this.#guildID = value;
  }

  set channelID(value) {
    this.#channelID = value;
    if (this.#shuffle != null) this.#shuffle.channelID = value;
  }

  get shuffleExists() {
    if (this.#dbPath != null) {
      var _jsonPath = Path.join(this.#dbPath, 'shuffle.json');
      return Fs.existsSync(_jsonPath);
    }
    return this.#shuffle != null;
  }

  _onShuffle(teams) {
    if (teams == null) return;
    this.#teams = teams;
    if (!this.#startOnShuffle) return this.saveSync();
    this._onAllTeamsReady();
  }

  getOrCreateShuffle() {
    if (this.#shuffle == null) {
      if (this.#dbPath != null) {
        if (this.shuffleExists) {
          var _shuffle = CompRettyShuffle.fromDB(this.#dbPath, this.#rest);
          _shuffle.channelID = this.#channelID;
          _shuffle.competitionName = this.#name;
          _shuffle.onFinished = (teams) => this._onShuffle(teams);
          return _shuffle;
        }
        var _newTeams = CompRettyTeams.fromJSON(this.#teams.toJSON(), this.#rest);
        _newTeams.competitionName = this.#name;
        _newTeams.shuffle();
        var _shuffle = CompRettyShuffle.withREST(this.#rest, _newTeams);
        _shuffle.channelID = this.#channelID;
        _shuffle.competitionName = this.#name;
        _shuffle.onFinished = (teams) => this._onShuffle(teams);
        _shuffle.registerDBPath(this.#dbPath);
        _shuffle.saveSync();
        var _jsonPath =  Path.join(this.#dbPath, 'shuffle.json');
        db.register(_jsonPath, _shuffle);
        return _shuffle;
      }
      var _newTeams = CompRettyTeams.fromJSON(this.#teams.toJSON(), this.#rest);
      _newTeams.competitionName = this.#name;
      _newTeams.shuffle();
      this.#shuffle = CompRettyShuffle.withREST(this.#rest, _newTeams);
      this.#shuffle.channelID = this.#channelID;
      _shuffle.competitionName = this.#name;
      _shuffle.onFinished = (teams) => this._onShuffle(teams);
    }
    return this.#shuffle;
  }

  cancelShuffle() {
    if (this.#dbPath == null) {
      if (this.#shuffle != null) return this.#shuffle.cancel();
      this.#shuffle = null;
      this.saveSync();
    }
    else if (this.shuffleExists) this.getOrCreateShuffle().cancel();
  }

  async clearPlayers() {
    this.#teams.clearPlayers();
    await this.cancelShuffle();
    this.saveSync();
  }

  sendPermissionDenied(interaction) {
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Permission denied. :lock:'));
  }

  getRoleWizard(interaction, updateMessage = false) {
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _roleButton;
    if (interaction.member.roles.indexOf(this.#competitionRole) == -1) {
      _roleButton = {
        type: 2,
        custom_id: 'get_role get',
        style: 1,
        label: 'Get role',
        emoji: {
          id: null,
          name: '🛡️',
        },
      };
    } else {
      _roleButton = {
        type: 2,
        custom_id: 'get_role remove',
        style: 4,
        label: 'Remove role',
        emoji: {
          id: null,
          name: '🛡️',
        },
      };
    }
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: [{
          title: 'Get competition role',
          description: `<@&${this.#competitionRole}>`,
          color: embedColor,
          timestamp: new Date().toISOString(),
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          author: embedAuthor,
        }],
        components: [
          {
            type: 1,
            components: [
              _roleButton,
            ],
          },
        ],
      },
      _type,
    ));
  }

  async checkQueueOnly(interaction) {
    if (!this.#queueOnly) return false;
    var result = false;
    var _playerID = interaction.member.user.id;
    var _arg0 = null;
    var _arg1 = null;
    var _arg2 = null;
    var _arg3 = null;
    var _option = null;
    var _option2 = null;
    var _playerID = interaction.member.user.id;
    var _customID = interaction.data.custom_id;
    if (_customID == null) {
      if (interaction.data.options != null) {
        _option = interaction.data.options[0];
        if (_option != null) {
          _arg1 = _option.name;
          if (_option.options != null) {
            _option2 = _option.options[0];
            if (_option2 != null) {
              _arg2 = _option2.name;
            }
          }
        }
      }
      switch (interaction.data.name) {
      case 'join':
        switch (_arg1) {
        case null:
          result = false;
          break;
        case 'queue':
          result = false;
          break;
        default:
          result = true;
          break;
        }
        break;
      case 'leave': 
        result = false;
        break;
      case 'unpug':
        result = false;
        break;
      case 'ready':
        result = false;
        break;
      case 'unready':
        result = false;
        break;
      case 'force_start':
        result = false;
        break;
      case 'get_role':
        result = false;
        break;
      case 'kick':
        result = false;
        break;
      case 'shuffle':
        result = true;
        break;
      case 'get_player_name':
        result = false;
        break;
      case 'coin_flip':
        result = false;
        break;
      case 'flip':
        result = false;
        break;
      case 'coin':
        result = false;
        break;
      case 'Kick player':
        result = false;
        break;
      case 'Kick mentioned player':
        result = false;
        break;
      }
    }
    else {
      var _command = interaction.data.custom_id.split(' ');
      _arg0 = _command[0];
      _arg1 = _command[1];
      _arg2 = _command[2];
      _arg3 = _command[3];
      if (_arg1 == 'teams') {
        switch (_arg2) {
        case 'join':
          if (_arg3 == '"cr_queue"') result = false;
          else result = true;
          break;
        case 'join_random':
          result = true;
          break;
        case 'join_queue':
          result = false;
          break;
        }
      } else {
        switch (_arg0) {
        case 'setup':
          result = false;
          break;
        case 'get_role':
          result = false;
          break;
        case 'shuffle':
          result = true;
          break;
        }
      }
    }
    if (result) {
      await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Command disabled in queue-only mode. :regional_indicator_q:`));
    }
    return result;
  }

  async execute(interaction, isAdmin = false) {
    if (await this.checkQueueOnly(interaction)) return;
    if (!this.#enabled) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Competition is currently disabled. :no_entry_sign:`));
    if (this.#autoClearDate != null) {
      if (this.#teams.playerCount != 0) {
        var _now = new Date();
        if (_now.getTime() > this.#autoClearDate.getTime()) {
          var _time = this.#autoClearThreshold / 60000;
          if (_time % 60 == 0) _time = `${_time / 60} hour(s)`;
          else _time = `${_time} minute(s)`;
          var _msg = `Competition has been inactive for more than ${_time}, all players have been kicked. :cloud_tornado:`;
          this.#teams.dmPlayers(`{"content":"> ${this.#name}: ${_msg}\\n\\nhttps://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}"}`);
          this.#rest.createMessage(this.#channelID, `{"content":"> ${_msg}"}`);
          this.#autoClearDate = addMilliseconds(_now, this.#autoClearThreshold);
          this.clearPlayers();
          this.saveSync();
        }
      }
    }
    var _playerID = interaction.member.user.id;
    switch (interaction.data.name) {
    case 'join':
      var response = this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
      if (interaction.data.options == null) return await this.sendCompetition(interaction, isAdmin || !this.#moderatorRoleCheck);
      return response;
    case 'pug':
      var response = this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
      if (interaction.data.options == null) return await this.sendCompetition(interaction, isAdmin || !this.#moderatorRoleCheck);
      return response;
    case 'leave': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'unpug': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'ready': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'unready': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'force_start':
      if (!(isAdmin || !this.#moderatorRoleCheck)) return await this.sendPermissionDenied(interaction);
      var _response = this.#rest.createInteractionResponse(interaction, getInteractionResponse({ content: 'Forcing the competition to start. :crossed_swords:' }));
      this._onAllTeamsReady(interaction);
      return _response;
    case 'get_role':
      if (this.#competitionRole == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`No role set up for this competition. :empty_nest:`));
      return await this.getRoleWizard(interaction);
    case 'kick': return await this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'shuffle':
      if (!this.#shuffleEnabled) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Shuffle is disabled for this competition. :no_entry_sign:`));
      if (this.#teams.getPlayerTeam(_playerID) == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`You must be a member of a team to start a shuffle. :spy:`));
      if (this.#teams.playerCount == 1) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`There needs to be at least 2 players to start a shuffle. :busts_in_silhouette:`));
      var _shuffleExists = this.shuffleExists;
      if (!_shuffleExists) this.getOrCreateShuffle();
      await this.#rest.createInteractionResponse(interaction, getInteractionResponse({
        embeds:[{
          title: ':game_die: Vote to shuffle',
          color: embedColor,
          timestamp: new Date().toISOString(),
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          author: embedAuthor,
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                custom_id: 'shuffle',
                style: 1,
                label: 'Vote to shuffle or to cancel',
                emoji: {
                  id: null,
                  name: '🎲',
                },
              },
            ],
          },
        ],
      }));
      var _response = await this.#rest.getOriginalInteractionResponse(interaction);
      if (!_shuffleExists) {
        var _url = `https://discord.com/channels/${interaction.guild_id}/${interaction.channel_id}`;
        if (_response != null) if (_response.id != null) _url += `/${_response.id}`;
        this.#teams.dmPlayers(`{"content":"> ${this.#name}: <@${_playerID}> started a vote to shuffle. :game_die:\\n\\nMake your choice count at ${_url}"}`);
      }
      return _response;
    case 'get_player_name': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'coin_flip': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'flip': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'coin': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'Kick player': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    case 'Kick mentioned player': return this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    }
    var _customID = interaction.data.custom_id;
    if (_customID == null) return await this.sendCompetition(interaction, isAdmin || !this.#moderatorRoleCheck);
    var _command = interaction.data.custom_id.split(' ');
    var _arg0 = _command[0];
    var _arg1 = _command[1];
    switch (_arg0) {
    case 'setup': return await this.setup(interaction, isAdmin);
    case 'get_role':
      if (this.#competitionRole == null) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`No role set up for this competition. :empty_nest:`));
      switch (_arg1) {
        case 'get':
          if (interaction.member.roles.indexOf(this.#competitionRole) != -1) return await this.getRoleWizard(interaction, true);
          var _response = await this.#rest.addGuildMemberRole(interaction.guild_id, _playerID, this.#competitionRole);
          if (_response.code == 50001) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('No access to changing member roles. :lock:'));
          if (_response.code == 50013) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Can\'t manage a role that\'s higher than mine. Move me up the list! :baby:'));
          interaction.member.roles.push(this.#competitionRole);
          break;
        case 'remove':
          var _roleIndex = interaction.member.roles.indexOf(this.#competitionRole);
          if (_roleIndex == -1) return await this.getRoleWizard(interaction, true);
          var _response = await this.#rest.removeGuildMemberRole(interaction.guild_id, _playerID, this.#competitionRole);
          if (_response.code == 50001) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('No access to changing member roles. :lock:'));
          if (_response.code == 50013) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Can\'t manage a role that\'s higher than mine. Move me up the list! :baby:'));
          interaction.member.roles.splice(_roleIndex, 1);
          break;
      }
      return await this.getRoleWizard(interaction, true);
    case 'shuffle':
      if (!this.shuffleExists) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('There is no shuffle in progress. You can start a new shuffle with `/shuffle`. :sleeping:'));
      return await this.getOrCreateShuffle().execute(interaction, isAdmin || !this.#moderatorRoleCheck);
    }
    if (_arg1 == 'teams') return await this.#teams.execute(interaction, isAdmin || !this.#moderatorRoleCheck);
  }

  setupWizard(interaction, updateMessage = false, page) {
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _image;
    var _imageURL = this.#imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: this.#imageURL };
    var _description;
    if (this.#description == '') _description = 'No description';
    else _description = this.#description;
    var _shufflePostfix;
    if (this.#shuffleEnabled) _shufflePostfix = ' enabled';
    else _shufflePostfix = ' disabled';
    var _moderatorRoleCheckPostfix;
    if (this.#moderatorRoleCheck) _moderatorRoleCheckPostfix = ' enabled';
    else _moderatorRoleCheckPostfix = ' disabled';
    var _logPostfix;
    if (this.#logEnabled) _logPostfix = ' enabled';
    else _logPostfix = ' disabled';
    var _startOnShufflePostfix;
    if (this.#startOnShuffle) _startOnShufflePostfix = ' enabled';
    else _startOnShufflePostfix = ' disabled';
    var _autoClearThresholdFormatted;
    if (this.#autoClearThreshold == null) _autoClearThresholdFormatted = 'Not set';
    else _autoClearThresholdFormatted = `${this.#autoClearThreshold / 60000} minute(s)`;
    var _embeds = [{
      title: 'Setup Competition',
      color: embedColor,
      timestamp: new Date().toISOString(),
      footer: embedFooter,
      thumbnail: _image,
      author: embedAuthor,
      fields: [
        {
          name: this.#name,
          value: _description,
        },
        {
          name: 'Competition role',
          value: formatRole(this.#competitionRole),
          inline: true,
        },
        {
          name: 'Auto clear threshold',
          value: _autoClearThresholdFormatted,
          inline: true,
        },
        {
          name: 'Player queue',
          value: this.#queue == null ? 'Disabled' : 'Enabled',
          inline: true,
        },
        {
          name: 'Queue-only mode',
          value: this.#queueOnly ? 'Enabled' : 'Disabled',
          inline: true,
        },
      ]
    }];
    if (page == '1') {
      return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
        {
          flags: 1 << 6,
          embeds: _embeds,
          components: [
            {
              type: 1,
              components: [
                {
                  type: 6,
                  custom_id: 'setup competition competition_role set',
                  placeholder: '🏏 Select a competition role',
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: 'setup competition auto_clear_threshold',
                  placeholder: '🌪️ Change auto clear threshold',
                  options: [
                    {
                      value: 'disable',
                      label: '🌪️ Disable auto clear threshold',
                      description: 'Players will not be automatically kicked',
                    },
                    {
                      value: 'set',
                      label: '🌪️ Set auto clear threshold',
                      description: 'Continuous inactivity within the competition will kick all players',
                    },
                  ],
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: 'setup competition moderator_role_check',
                  placeholder: `🦾 Moderator role check${_moderatorRoleCheckPostfix}`,
                  options: [
                    {
                      value: 'true',
                      label: '🦾 Moderator role check enabled',
                      description: 'Only admins and moderators will be able to use kick and force commands',
                    },
                    {
                      value: 'false',
                      label: '🦾 Moderator role check disabled',
                      description: 'Everyone will be able to use kick and force commands',
                    },
                  ],
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: `setup competition queue enable ${this.#queue == null}`,
                  style: 2,
                  label: `${this.#queue == null ? 'Enable' : 'Disable'} player queue`,
                  emoji: {
                    id: null,
                    name: '⏳',
                  },
                },
                {
                  type: 2,
                  custom_id: `setup competition queue_only enable ${!this.#queueOnly}`,
                  style: 2,
                  label: `${this.#queueOnly ? 'Disable' : 'Enable'} queue-only mode`,
                  emoji: {
                    id: null,
                    name: '🇶',
                  },
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: 'setup competition page 0',
                  style: 1,
                  label: 'Page 0',
                  emoji: {
                    id: null,
                    name: '⬅️',
                  },
                },
              ],
            },
          ],
        },
        _type,
      ));
    }
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: _embeds,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                custom_id: 'setup competition name',
                style: 1,
                label: 'Name',
                emoji: {
                  id: null,
                  name: '⚔️',
                },
              },
              {
                type: 2,                
                custom_id: `setup competition description`,
                style: 2,
                label: 'Description',
                emoji: {
                  id: null,
                  name: '📝',
                },
              },
              {
                type: 2,                
                custom_id: `setup competition image_url`,
                style: 2,
                label: 'Image',
                emoji: {
                  id: null,
                  name: '🖌️',
                },
              },
              {
                type: 2,
                custom_id: 'setup teams',
                style: 1,
                label: 'Teams',
                emoji: {
                  id: null,
                  name: '🤼',
                },
              },
              {
                type: 2,                
                custom_id: 'setup competition competition_role reset',
                style: 4,
                label: 'Reset competition role',
                emoji: {
                  id: null,
                  name: '🏏'
                },
              },
            ],
          },
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'setup competition shuffle_enabled',
                placeholder: `🎲 Shuffle${_shufflePostfix}`,
                options: [
                  {
                    value: 'true',
                    label: '🎲 Shuffle enabled',
                    description: 'Allow voting to shuffle players',
                  },
                  {
                    value: 'false',
                    label: '🎲 Shuffle disabled',
                    description: 'Disable shuffle',
                  },
                ],
              },
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'setup competition log_enabled',
                placeholder: `📝 Log${_logPostfix}`,
                options: [
                  {
                    value: 'true',
                    label: '📝 Log enabled',
                    description: 'Enable action log',
                  },
                  {
                    value: 'false',
                    label: '📝 Log disabled',
                    description: 'Disable action log',
                  },
                ],
              },
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'setup competition start_on_shuffle',
                placeholder: `🎲 Start on shuffle${_startOnShufflePostfix}`,
                options: [
                  {
                    value: 'true',
                    label: '🎲 Start on shuffle enabled',
                    description: 'Start game on shuffle',
                  },
                  {
                    value: 'false',
                    label: '🎲 Start on shuffle disabled',
                    description: 'Wait for everyone to get ready after shuffle',
                  },
                ],
              },
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 2,
                custom_id: 'setup competition page 1',
                style: 1,
                label: 'Page 1',
                emoji: {
                  id: null,
                  name: '➡️',
                },
              },
            ],
          },
        ],
      },
      _type,
    ));
  }

  _nameModal(interaction) {
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Competition Name',
        'setup competition name',
        {
          type: 4,
          custom_id: 'name',
          label: 'Competition name',
          style: 1,
          min_length: 1,
          max_length: 50,
          value: this.#name,
        },
      ),
      9,
    ));
  }

  _descriptionModal(interaction) {
    var _value;
    if (this.#description != '') _value = this.#description;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Competition Description',
        'setup competition description',
        {
          type: 4,
          custom_id: 'description',
          label: 'Competition description',
          style: 1,
          min_length: 1,
          max_length: 100,
          value: _value,
        }
      ),
      9,
    ));
  }

  _imageModal(interaction) {
    var _value;
    if (this.#imageURL != '') _value = this.#imageURL;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Competition Image',
        'setup competition image_url',
        {
          type: 4,
          custom_id: 'image_url',
          label: 'Competition image URL',
          style: 1,
          min_length: 1,
          max_length: 256,
          value: _value,
        },
      ),
      9,
    ));
  }

  _autoClearThresholdModal(interaction) {
    var _value;
    if (this.#autoClearThreshold != null) _value = this.#autoClearThreshold / 60000;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      getSimpleModal(
        'Auto Clear Threshold',
        'setup competition auto_clear_threshold',
        {
          type: 4,
          custom_id: 'auto_clear_threshold',
          label: 'Auto clear threshold (in minutes)',
          style: 1,
          min_length: 1,
          max_length: 15,
          value: _value,
        },
      ),
      9,
    ));
  }

  async setup(interaction, isAdmin = false) {
    if (!isAdmin) return await this.sendPermissionDenied(interaction);
    var _command =  interaction.data.custom_id.split(' ');
    var _arg1 = _command[1];
    var _arg2 = _command[2];
    var _arg3 = _command[3];
    var _arg4 = _command[4];
    var _components = interaction.data.components;
    if (_arg1 == 'competition') {
      if (_arg2 == null) return await this.setupWizard(interaction);
      switch (_arg2) {
      case 'page':
        return await this.setupWizard(interaction, true, _arg3);
      case 'name':
        if (_components == null) return await this._nameModal(interaction);
        var _val = _components[0].components[0].value;
        this.#name = _val.slice(0, 50);
        this.#teams.competitionName = this.#name;
        this.saveSync();
        return await this.setupWizard(interaction, true);
      case 'description':
        if (_components == null) return await this._descriptionModal(interaction);
        var _val = _components[0].components[0].value;
        this.#description = _val.slice(0, 100);
        this.saveSync();
        return await this.setupWizard(interaction, true);
      case 'image_url':
        if (_components == null) return await this._imageModal(interaction);
        var _val = _components[0].components[0].value;
        this.#imageURL = _val.slice(0, 256);
        this.saveSync();
        return await this.setupWizard(interaction, true);
      case 'shuffle_enabled':
        this.#shuffleEnabled = JSON.parse(interaction.data.values[0]);
        this.saveSync();
        return await this.setupWizard(interaction, true);
      case 'log_enabled':
        this.#logEnabled = JSON.parse(interaction.data.values[0]);
        this.#teams.logEnabled = this.#logEnabled;
        this.saveSync();
        return await this.setupWizard(interaction, true);
      case 'start_on_shuffle':
        this.#startOnShuffle = JSON.parse(interaction.data.values[0]);
        this.saveSync();
        return await this.setupWizard(interaction, true);
      case 'competition_role':
        switch (_arg3) {
        case 'set':
          var _roleID = interaction.data.values[0];
          var _botID = interaction.message.author.id;
          var _response = await this.#rest.addGuildMemberRole(interaction.guild_id, _botID, _roleID);
          if (_response.code == 50001) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('No access to changing member roles. :lock:'));
          if (_response.code == 50013) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Can\'t manage a role that\'s higher than mine. Move me up the list! :baby:'));
          this.#rest.removeGuildMemberRole(interaction.guild_id, _botID, _roleID);
          this.#competitionRole = _roleID;
          this.saveSync();
          return await this.setupWizard(interaction, true, 1);
        case 'reset':
          this.#competitionRole = null;
          this.saveSync();
          return await this.setupWizard(interaction, true);
        }
        return await this.setupWizard(interaction, true);
      case 'auto_clear_threshold':
        if (_components != null) {
          var _val = _components[0].components[0].value;
          _val = _val.slice(0, 15);
          try {
            _val = JSON.parse(_val);
          } catch {
            return await this.setupWizard(interaction, true, 1);
          }
          if (typeof _val != 'number') return await this.setupWizard(interaction, true, 1);
          this.#autoClearThreshold = _val * 60000;
          this.#autoClearDate = addMilliseconds(new Date(), this.#autoClearThreshold);
          this.#teams.competitionName = this.#name;
          this.saveSync();
          return await this.setupWizard(interaction, true, 1);
        }
        switch (interaction.data.values['0']) {
        case 'disable':
          this.#autoClearThreshold = null;
          this.#autoClearDate = null;
          this.saveSync();
          return await this.setupWizard(interaction, true, 1);
        case 'set': return await this._autoClearThresholdModal(interaction);
        }
        return await this.setupWizard(interaction, true, 1);
      case 'moderator_role_check':
        switch (interaction.data.values['0']) {
        case 'true':
          this.#moderatorRoleCheck = true;
          this.saveSync();
          return await this.setupWizard(interaction, true, 1);
        case 'false':
          this.#moderatorRoleCheck = false;
          this.saveSync();
          return await this.setupWizard(interaction, true, 1);
        }
        return await this.setupWizard(interaction, true, 1);
      case 'queue':
        switch (_arg3) {
        case 'enable':
          switch (_arg4) {
          case 'true':
            if (this.#queue != null) break;
            var _queue = new CompRettyTeam('cr_queue', 'Player queue');
            this.#queue = _queue;
            this.#teams.queue = _queue;
            this.saveSync();
            return await this.setupWizard(interaction, true, 1);
          case 'false':
            if (this.#queue == null) break;
            this.#queueOnly = false;
            this.#teams.queueOnly = false;
            this.#teams.removeQueue();
            this.#queue = null;
            this.saveSync();
            return await this.setupWizard(interaction, true, 1);
          }
          return await this.setupWizard(interaction, true, 1);
        }
        return await this.setupWizard(interaction, true, 1);
      case 'queue_only':
        if (this.#queue == null) {
          return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Could not enable queue-only mode. Please enable player queue first. :sweat_smile:'));
        }
        switch (_arg3) {
        case 'enable':
          switch (_arg4) {
          case 'true':
            if (this.#queueOnly) break;
            this.#queueOnly = true;
            this.#teams.queueOnly = true;
            this.#teams.clearPlayers();
            this.saveSync();
            return await this.setupWizard(interaction, true, 1);
          case 'false':
            if (!this.#queueOnly) break;
            this.#queueOnly = false;
            this.#teams.queueOnly = false;
            this.saveSync();
            return await this.setupWizard(interaction, true, 1);
          }
          return await this.setupWizard(interaction, true, 1);
        }
        return await this.setupWizard(interaction, true, 1);
      }
      return await this.setupWizard(interaction);
    }
    return await this.#teams.setup(interaction);
  }

  _getCompetitionMessage(_hasControls = true, _hasPlayerCount = true) {
    var _fields = [];
    this.#teams.values.forEach((value) => {
      var _description;
      if (value.description == '') _description = 'No description';
      else _description = value.description;
      _fields.push({
        name: `:shield: ${value.name}`,
        value: _description,
        inline: true,
      });
    });
    var _description = '';
    if (_hasPlayerCount) _description += `**${this.#teams.playerCount} player(s) entered.**\n\n`;
    if (this.#queueOnly) _description += `*Queue-only mode enabled.*\n\n`;
    if (this.#description != '') _description += `${this.#description}\n\n`;
    _description += ':crossed_swords: **Teams:**';
    var _components;
    if (_hasControls) {
      _components = [
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: 'competition teams',
              label: this.#queueOnly ? 'View queue' : 'View/join teams',
              style: 1,
              emoji: {
                id: null,
                name: this.#queueOnly ? '👥' : '🛡️',
              },
            },
            {
              type: 2,
              custom_id: 'competition teams leave minimalist',
              label: this.#queueOnly ? 'Leave queue' : 'Leave the competition',
              style: 4,
              emoji: {
                id: null,
                name: '🕴️',
              },
            },
          ],
        },
      ];
      if (!this.#queueOnly) {
        _components[0].components.splice(1, 0, {
            type: 2,
            custom_id: 'competition teams join_random',
            label: 'Join a random team',
            style: 3,
            emoji: {
              id: null,
              name: '🎲',
            },
          });
      }
      if (this.#queue != null) {
        _components[0].components.splice(this.#queueOnly ? 0 : 2, 0, {
            type: 2,
            custom_id: 'competition teams join_queue',
            label: 'Join queue',
            style: this.#queueOnly ? 3 : 2,
            emoji: {
              id: null,
              name: '⌛',
            },
          });
      }
    }
    var _image;
    var _imageURL = this.#imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: this.#imageURL };
    return {
      embeds: [{
        title: this.#name,
        description: _description,
        color: embedColor,
        timestamp: new Date().toISOString(),
        footer: embedFooter,
        thumbnail: _image,
        author: embedAuthor,
        fields: _fields,
      }],
      components: _components,
    };
  }

  async _updateCompetitionMessage(messageID, hasPlayerCount = true) {
    this.#rest.editMessage(this.#channelID, messageID , JSON.stringify(this._getCompetitionMessage(true, hasPlayerCount)));
  }

  updateCompetitionMessage(hasPlayerCount = true) {
    if (this.#competitionMessageID == null) return;
    var _messageID = this.#competitionMessageID;
    if (burstStacksStarted) return burstStack10.set(`UpdCmpMsg${this.#channelID}${hasPlayerCount}`, () => this._updateCompetitionMessage(_messageID, hasPlayerCount));
    return this._updateCompetitionMessage(_messageID, hasPlayerCount);
  }

  async _updateCompetitionMessageID(interaction) {
    var _result = await this.#rest.getOriginalInteractionResponse(interaction);
    if (_result == null) return;
    if (_result.id == null) return;
    this.#competitionMessageID = _result.id;
    this.saveSync();
    return;
  }

  async sendCompetition(interaction, isAdmin = false) {
    await this.updateCompetitionMessage(false);
    var _result = await this.#rest.createInteractionResponse(interaction, getInteractionResponse(this._getCompetitionMessage(true, true)));
    this._updateCompetitionMessageID(interaction);
    this.#teams.sendTeamsWizards(interaction, isAdmin);
    return _result;
  }

  async _onAllTeamsReady(interaction) {
    this.#enabled = false;
    this.saveSync();
    await this.cancelShuffle();
    var _channelID;
    if (interaction == null) _channelID = this.#channelID;
    else _channelID = interaction.channel_id;
    await this.#rest.createMessage(_channelID, JSON.stringify(this._getCompetitionMessage(false)));
    await this.#teams.sendTeamsInfo(_channelID);
    this.#teams.dmPlayers(`{"content":"> ${this.#name}: All teams are ready, the competition is starting. :crossed_swords:\\n\\nHead over to https://discord.com/channels/${this.#guildID}/${this.#channelID} and get to playing!"}`);
    this.clearPlayers();
    this.#enabled = true;
    this.saveSync();
  }
}

export class CompRettyChannel {  
  #dbPath;
  #jsonPath;
  #rest;
  #guildID;
  #id;  
  #enabled;
  #adminRole;
  #competition;

  constructor(id, enabled = false, adminRole = null, competition = undefined) {
    if (competition === undefined) {
      competition = new CompRettyCompetition('Competition', 'Working together wins games.');
      competition.channelID = id;
    }
    this.#id = id;
    this.#enabled = enabled;
    this.#adminRole = adminRole;
    this.#competition = competition;
  }

  static withREST(rest, id, enabled = false, adminRole = null, competition = undefined) {
    if (competition == null) {
      competition = CompRettyCompetition.withREST(rest, 'Competition', 'Working together wins games.');
      competition.channelID = id;
    }
    var _channel = new CompRettyChannel(id, enabled, adminRole, competition);
    _channel.#rest = rest;
    return _channel;
  }

  static fromDB(path, rest = null) {
    var _jsonPath =  Path.join(path, 'channel.json');
    var _dbObject = db.get(_jsonPath);
    if (_dbObject != null) return _dbObject;
    var _id;
    {
      var _pathSplit = path.split(Path.sep);
      _id = _pathSplit[_pathSplit.length - 1];
    }
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _channel;
    if (Fs.existsSync(_jsonPath)) {
      var _jsonString = Fs.readFileSync(_jsonPath, { encoding: 'utf8', flag: 'r' });
      var _json = JSON.parse(_jsonString);
      _channel = CompRettyChannel.fromJSON(_json, rest);
      _channel.#dbPath = path;
      _channel.#jsonPath = _jsonPath;
    } else {
      _channel = CompRettyChannel.withREST(rest, _id);
      _channel.#dbPath = path;
      _channel.#jsonPath = _jsonPath;
      _channel.saveSync();
    }
    _channel.#competition = CompRettyCompetition.fromDB(Path.join(path, 'competition'), rest);
    _channel.#competition.channelID = _channel.id;
    db.register(_jsonPath, _channel);
    return _channel;
  }

  static fromJSON(json, rest = null) {
    var _competition;
    if (json.competition == null) _competition = undefined;
    else {
      _competition = CompRettyCompetition.fromJSON(json.competition, rest);
      _competition.channelID = json.id;
    }
    return CompRettyChannel.withREST(rest, json.id, json.enabled, json.adminRole, _competition);
  }

  toJSON() {
    var _competition;
    if ((this.#dbPath == null) && (this.#competition != null)) _competition = this.#competition.toJSON();
    else _competition = null;
    return {
      id: this.#id,
      enabled: this.#enabled,
      adminRole: this.#adminRole,
      competition: _competition,
    };
  }

  saveSync() {
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
  }

  set guildID(value) {
    this.#guildID = value
    if (this.#competition != null) this.#competition.guildID = this.#guildID;
  }

  get id() {
    return this.#id;
  }

  get enabled() {
    return this.#enabled;
  }

  set enabled(value) {
    this.#enabled = value;
  }

  isAdmin(member) {
    return isAdmin(member) || member.roles.includes(this.#adminRole);
  }

  _onInteractionError(interaction, message) {
    if (message != null) {
      console.log('E:');
      console.log(message);
    }
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Whoops! There appears to be a problem on our side. :exploding_head:'));
  }

  sendPermissionDenied(interaction) {
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Permission denied. :lock:'));
  }

  _competitionExecute(interaction, isAdmin = false) {
    if (!this.#enabled) return this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Competition commands are currently disabled for this channel. :no_entry_sign:`));
    var _response = this.#competition.execute(interaction, isAdmin);
    return _response;
  }

  execute(interaction, isAdmin = false) {
    if (!isAdmin) isAdmin = this.isAdmin(interaction.member);
    var _commandName;
    if (interaction.data.custom_id == null) _commandName = interaction.data.name;
    else _commandName = interaction.data.custom_id.split(' ')[0];
    switch (_commandName) {
    case 'setup': return this.setup(interaction, isAdmin);
    case 'force_start': return this._competitionExecute(interaction, isAdmin);
    case 'competition': return this._competitionExecute(interaction, isAdmin);
    case 'comp': return this._competitionExecute(interaction, isAdmin);
    case 'join': return this._competitionExecute(interaction, isAdmin);
    case 'pug': return this._competitionExecute(interaction, isAdmin);
    case 'leave': return this._competitionExecute(interaction);
    case 'unpug': return this._competitionExecute(interaction);
    case 'ready': return this._competitionExecute(interaction);
    case 'unready': return this._competitionExecute(interaction);
    case 'kick': return this._competitionExecute(interaction, isAdmin);
    case 'get_role': return this._competitionExecute(interaction, isAdmin);
    case 'shuffle': return this._competitionExecute(interaction, isAdmin);
    case 'get_player_name': return this._competitionExecute(interaction, isAdmin);
    case 'coin_flip': return this._competitionExecute(interaction, isAdmin);
    case 'flip': return this._competitionExecute(interaction, isAdmin);
    case 'coin': return this._competitionExecute(interaction, isAdmin);
    case 'Kick player': return this._competitionExecute(interaction, isAdmin);
    case 'Kick mentioned player': return this._competitionExecute(interaction, isAdmin);
    }
    return this._onInteractionError(interaction)
  }

  setupWizard(interaction, updateMessage = false) {
    var _enabled;
    if (this.#enabled) _enabled = 'enabled';
    else _enabled = 'disabled';
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: [{
          title: 'Channel Setup',
          color: embedColor,
          timestamp: new Date().toISOString(),
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          author: embedAuthor,
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'setup channel enabled',
                placeholder: `⚔️ Competitions ${_enabled}`,
                options: [                  
                  {
                    value: 'false',
                    label: '⚔️ Competitions disabled',
                    description: 'Competiton commands are disabled',
                  },
                  {
                    value: 'true',
                    label: '⚔️ Competitions enabled',
                    description: 'Everyone can access the competition commands',
                  },
                ],
              },
            ],
          },
        ],
      },
      _type,
    ));
  }

  setup(interaction, isAdmin = false) {
    if (!isAdmin) return this.sendPermissionDenied(interaction);
    var _command =  interaction.data.custom_id.split(' ');
    var _arg1 = _command[1];
    if (_arg1 == 'channel') {
      var _arg2 = _command[2];
      if (_arg2 == null) return this.setupWizard(interaction);
      switch (_arg2) {
      case 'enabled':
        this.enabled = JSON.parse(interaction.data.values[0]);
        this.saveSync();
        return this.setupWizard(interaction, true);
      }
    }
    return this.#competition.execute(interaction, isAdmin);
  }
}

export class CompRettyGuild {
  #dbPath;
  #jsonPath;
  #rest;
  #id;
  #channels;
  #adminRole;

  constructor(id, adminRole = null, channels = {}) {
    this.#id = id;    
    this.#channels = channels;
    this.#adminRole = adminRole;
  }

  static withREST(rest, id, adminRole = null, channels = {}) {
    var _guild = new CompRettyGuild(id, adminRole, channels);
    _guild.#rest = rest;
    return _guild;
  }

  static fromDB(path, rest = null) {
    var _jsonPath =  Path.join(path, 'guild.json');
    var _dbObject = db.get(_jsonPath);
    if (_dbObject != null) return _dbObject;
    var _id;
    {
      var _pathSplit = path.split(Path.sep);
      _id = _pathSplit[_pathSplit.length - 1];
    }
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _guild;
    if (Fs.existsSync(_jsonPath)) {
      var _jsonString = Fs.readFileSync(_jsonPath, { encoding: 'utf8', flag: 'r' });
      var _json = JSON.parse(_jsonString);
      _guild = CompRettyGuild.fromJSON(_json, rest);
      _guild.#dbPath = path;
      _guild.#jsonPath = _jsonPath;
    } else {
      _guild = CompRettyGuild.withREST(rest, _id);
      _guild.#dbPath = path;
      _guild.#jsonPath = _jsonPath;
      _guild.saveSync();
    }
    db.register(_jsonPath, _guild);
    return _guild;
  }

  static fromJSON(json, rest = null) {
    var _channels = {};
    Object.values(json.channels).forEach((channel) => {
      var _channel = CompRettyChannel.fromJSON(channel, rest);
      _channel.guildID = json.id;
      _channels[channel.id] = _channel;
    });
    return CompRettyGuild.withREST(rest, json.id, json.adminRole, _channels);
  }

  toJSON() {
    var _channelsJSON = [];
    Object.values(this.#channels).forEach((channel) => _channelsJSON.push(channel.toJSON()));
    return {
      id: this.#id,
      adminRole: this.#adminRole,
      channels: this.#channels,
    };
  }

  saveSync() {
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
  }

  get id() {
    return this.#id;
  }

  get adminRole() {
    return this.#adminRole;
  }

  set adminRole(value) {
    this.#adminRole = value;
  }

  /**
  * 
  * @param {CompRettyChannel} value 
  */
  setChannel(value) {
    this.#channels[value.id] = value;
  }
  
  /**
   * 
   * @param {string} id 
   * @returns {CompRettyChannel}
   */
  getChannel(id) {
    return this.#channels[id]
  }  

  getOrCreateChannel(id) {
    if (this.#dbPath != null) {
      var _channel = CompRettyChannel.fromDB(Path.join(this.#dbPath, 'channels', id), this.#rest);
      _channel.guildID = this.#id;
      return _channel;
    }
    var _channel = this.#channels[id];
    if (_channel == null) {
      _channel = CompRettyChannel.withREST(this.#rest, id);
      this.#channels[id] = _channel;
    }
    _channel.guildID = this.#id;
    return _channel;
  }

  isAdmin(member) {
    return isAdmin(member) || member.roles.includes(this.#adminRole);
  }

  sendPermissionDenied(interaction) {
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Permission denied. :lock:'));
  }

  async listHelp(interaction) {
    var _isAdmin = this.isAdmin(interaction.member);
    var _helpMsg = getHelpMsg(_isAdmin);
    return this.#rest.createInteractionResponse(interaction, _helpMsg);
  }

  _channelExecute(interaction) {
    var _channel = this.getOrCreateChannel(interaction.channel_id);
    return _channel.execute(interaction, this.isAdmin(interaction.member));
  }

  execute(interaction) {
    var _commandName;
    if (interaction.data.custom_id == null) _commandName = interaction.data.name;
    else _commandName = interaction.data.custom_id.split(' ')[0];
    var _isAdmin = this.isAdmin(interaction.member);
    switch (_commandName) {
    case 'help': return this.listHelp(interaction);
    case 'setup': return this.setup(interaction);
    case 'force_start': return this._channelExecute(interaction, _isAdmin);
    case 'kick': return this._channelExecute(interaction, _isAdmin);
    case 'competition': return this._channelExecute(interaction, _isAdmin);
    case 'comp': return this._channelExecute(interaction, _isAdmin);
    case 'join': return this._channelExecute(interaction, _isAdmin);
    case 'pug': return this._channelExecute(interaction, _isAdmin);
    case 'leave': return this._channelExecute(interaction);
    case 'unpug': return this._channelExecute(interaction);
    case 'ready': return this._channelExecute(interaction);
    case 'unready': return this._channelExecute(interaction);
    case 'get_role': return this._channelExecute(interaction, _isAdmin);
    case 'shuffle': return this._channelExecute(interaction, _isAdmin);
    case 'get_player_name': return this._channelExecute(interaction, isAdmin);
    case 'coin_flip': return this._channelExecute(interaction, isAdmin);
    case 'flip': return this._channelExecute(interaction, isAdmin);
    case 'coin': return this._channelExecute(interaction, isAdmin);
    case 'Kick player': return this._channelExecute(interaction, _isAdmin);
    case 'Kick mentioned player': return this._channelExecute(interaction, _isAdmin);
    }
  }

  setupWizard(interaction, updateMessage = false) {
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: [{
          title: 'Guild Setup',
          color: embedColor,
          timestamp: new Date().toISOString(),
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          author: embedAuthor,
          fields: [
            {
              name: ':crown: Admin role',
              value: formatRole(this.#adminRole),
            },
          ],
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 6,
                custom_id: 'setup guild admin_role set',
                placeholder: '👑 Select an admin role',
              },
            ],
          },
          {
            type: 1,
            components: [
              {
                type: 2,                
                custom_id: 'setup guild admin_role reset',
                style: 4,
                label: 'Reset admin role',
                emoji: {
                  id: null,
                  name: '👑'
                },
              },
            ],
          },
        ],
      },
      _type,
    ));
  }

  setup(interaction) {
    if (!this.isAdmin(interaction.member)) return this.sendPermissionDenied(interaction);
    var _command =  interaction.data.custom_id.split(' ');
    var _arg1 = _command[1];
    if (_arg1 == 'guild') {
      var _arg2 = _command[2];
      if (_arg2 == null) return this.setupWizard(interaction);
      var _arg3 = _command[3];      
      switch (_arg2) {
      case 'admin_role':
        if (!isAdmin(interaction.member)) return this.sendPermissionDenied(interaction);
        switch (_arg3) {
          case 'set':
            this.#adminRole = interaction.data.values[0];
            break;
          case 'reset':
            this.#adminRole = null;
            break;
        }
        this.saveSync();
        return this.setupWizard(interaction, true);
      }
      return this.setupWizard(interaction);
    }
    return this._channelExecute(interaction);
  }
}

export class CompRettyDiscord {
  #dbPath;
  #jsonPath;
  #rest;
  #guilds;

  constructor(guilds = {}) {
    this.#guilds = guilds;
  }

  static withREST(rest, guilds = {}) {
    var _discord = new CompRettyDiscord(guilds);
    _discord.#rest = rest;
    return _discord;
  }

  static fromDB(path, rest = null) {
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _jsonPath =  Path.join(path, 'discord.json');
    var _discord;
    if (Fs.existsSync(_jsonPath)) {
      var _jsonString = Fs.readFileSync(_jsonPath, { encoding: 'utf8', flag: 'r' });
      var _json = JSON.parse(_jsonString);
      _discord = CompRettyDiscord.fromJSON(_json, rest);
      _discord.#dbPath = path;
      _discord.#jsonPath = _jsonPath;
    } else {
      _discord = CompRettyDiscord.withREST(rest);
      _discord.#dbPath = path;
      _discord.#jsonPath = _jsonPath;
      _discord.saveSync();
    }
    return _discord;
  }

  static fromJSON(json, rest = null) {
    var _guilds = {};
    Object.values(json.guilds == null ? [] : json.guilds).forEach((guild) => _guilds[guild.id] = CompRettyGuild.fromJSON(guild, rest));
    return CompRettyDiscord.withREST(rest, _guilds);
  }

  toJSON() {
    var _guildsJSON = [];
    Object.values(this.#guilds).forEach((guild) => _guildsJSON.push(guild.toJSON()));
    return {
      guilds: _guildsJSON,
    };
  }

  saveSync() {
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
  }

  /**
   * 
   * @param {string} id 
   * @returns {CompRettyGuild}
   */
  getGuild(id) {
    return this.#guilds[id];
  }

  /**
   * 
   * @param {CompRettyGuild} value 
   */
  setGuild(value) {
    this.#guilds[value.id] = value;
  }

  /**
   * 
   * @param {string} id 
   * @param {object} channels 
   * @param {*} adminRole 
   * @returns {CompRettyGuild}
   */
  getOrCreateGuild(id, adminRole = null, channels = {}) {
    if (this.#dbPath != null) {
      return CompRettyGuild.fromDB(Path.join(this.#dbPath, 'guilds', id), this.#rest);
    }
    var _guild = this.#guilds[id];
    if (_guild == null) {
      _guild = CompRettyGuild.withREST(this.#rest, id, adminRole, channels);
      this.#guilds[id] = _guild;
    }
    return _guild;
  }
}

export class CompRetty {
  #isRunning;
  #botToken;
  #ownerID;
  #rest;
  #gateway;
  #discord;

  _setupExecute(interaction) {
    if (interaction.data.custom_id != null) return this._guildExecute(interaction);
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse({
      flags: 1 << 6,
      embeds: [{
        title: 'Setup',
        description: 'Hi! I am Retty, here to help you and your server create and enjoy exciting competitions.\n\n▶️ In this menu, I will walk you through setting up team names, descriptions and images of your competition teams for this channel. \n\n▶️ You can set up many competitions at once in separate channels.\n\n▶️ Once a competition is set up and enabled, simply use `/competition` to start playing.',
        color: embedColor,
        timestamp: new Date().toISOString(),
        footer: embedFooter,
        thumbnail: {
          url: logoURL,
        },
        author: embedAuthor,
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: 'setup guild',
              style: 1,
              label: 'Guild',
              emoji: {
                id: null,
                name: '🏕️',
              },
              description: 'Guild settings',
            },
            {
              type: 2,
              custom_id: 'setup channel',
              style: 1,
              label: 'Channel',
              emoji: {
                id: null,
                name: '📻',
              },
              description: 'Channel settings',
            },
            {
              type: 2,
              custom_id: 'setup competition',
              style: 1,
              label: 'Competition',
              emoji: {
                id: null,
                name: '⚔️',
              },
              description: 'Competition settings',
            },
          ],
        },
      ],
    }));
  }

  _guildExecute(interaction) {
    var _guild = this.#discord.getOrCreateGuild(interaction.guild_id);
    return _guild.execute(interaction);
  }

  constructor(botToken, ownerID) {
    this.#botToken = botToken;
    this.#ownerID = ownerID;
    this.#rest = REST.fromBotToken(this.#botToken);
    this.#discord = CompRettyDiscord.withREST(this.#rest);
  }

  static fromDB(path, botToken, ownerID) {
    var _rest = REST.fromBotToken(botToken);
    var _compRetty = new CompRetty(botToken, ownerID);
    _compRetty.#rest = _rest;
    var _discord;
    try {
      _discord = CompRettyDiscord.fromDB(path, _rest);
    } catch (err) {
      console.log(`F:Couldn\'t load preferences, check your \`${path}\` database folder for errors.`);
      throw err;
    }
    _compRetty.#discord = _discord;
    return _compRetty;
  }

  static fromENV() {
    var _dbPath = process.env.COMPRETTY_PREFS_PATH;
    var _ownerID = process.env.COMPRETTY_OWNER_ID;
    var _botToken = process.env.COMPRETTY_BOT_TOKEN;
    if (_dbPath == null || _dbPath == '') {
      throw { name: 'EnvPrefsPath', message: 'Environment variable COMPRETTY_PREFS_PATH is missing.' };
    }
    if (_botToken == null || _botToken == '') {
      throw { name: 'EnvBotToken', message: 'Environment variable COMPRETTY_BOT_TOKEN is missing.' };
    }
    if (_ownerID == null || _ownerID == '') {
      throw { name: 'EnvOwnerID', message: 'Environment variable COMPRETTY_OWNER_ID is missing.' };
    }
    return CompRetty.fromDB(_dbPath, _botToken, _ownerID);
  }

  _onInteractionError(interaction, message) {
    if (message != null) {
      console.log('E:');
      console.log(message);
    }
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Whoops! There appears to be a problem on our side. :exploding_head:'));
  }

  sendPermissionDenied(interaction) {
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse('Permission denied. :lock:'));
  }

  executeInteraction(interaction) {
    var _commandName;
    if (interaction.data.custom_id == null) _commandName = interaction.data.name;
    else _commandName = interaction.data.custom_id.split(' ')[0];
    switch (_commandName) {
    case 'help': return this._guildExecute(interaction);
    case 'setup': return this._setupExecute(interaction);
    case 'force_start': return this._guildExecute(interaction);
    case 'kick': return this._guildExecute(interaction);
    case 'competition': return this._guildExecute(interaction);
    case 'comp': return this._guildExecute(interaction);
    case 'join': return this._guildExecute(interaction);
    case 'pug': return this._guildExecute(interaction);
    case 'leave': return this._guildExecute(interaction);
    case 'unpug': return this._guildExecute(interaction);
    case 'ready': return this._guildExecute(interaction);
    case 'unready': return this._guildExecute(interaction);
    case 'get_role': return this._guildExecute(interaction);
    case 'shuffle': return this._guildExecute(interaction);
    case 'get_player_name': return this._guildExecute(interaction);
    case 'coin_flip': return this._guildExecute(interaction);
    case 'flip': return this._guildExecute(interaction);
    case 'coin': return this._guildExecute(interaction);
    case 'Kick player': return this._guildExecute(interaction);
    case 'Kick mentioned player': return this._guildExecute(interaction);
    }
    return this._onInteractionError(interaction, interaction.data);
  }

  async _onOpen() {
    console.log('I:Discord gateway opened.');
  }

  async _onReady(data) {
    console.log('I:Setting application commands.');;
    return await this.#rest.bulkOverwriteGlobalApplicationCommands(data.application.id, JSON.stringify(commands));
  }

  _onMessage(event) {
    var _data = JSON.parse(event.data);
    if (_data.op == null) return;
    switch (_data.op) {
    case 0:
      var _msg = `I:Received Opcode 0 from Discord:` + _data.t;
      if (_data.t == 'INTERACTION_CREATE') {
        var _interaction = _data.d.data;
        //console.log(`${_msg}:${_interaction.name}.`);
        this.executeInteraction(_data.d);
        return;
      }
      if (_data.t == 'READY') {
        this._onReady(_data.d);
        return;
      }
      console.log(`${_msg}.`);
      return;
    case 7:
      console.log('I:Received Opcode 7 Reconnect from Discord.');
      return;
    case 9:
      console.log('I:Received Opcode 9 Invalid Session from Discord.')
      return;
    case 10:
      console.log('I:Received Opcode 10 Hello from Discord.');
      return;
    case 11:
      //console.log('I:Received Opcode 11 Heartbeat ACK from Discord.');
      return;
    default:
      console.log(`W:Received unknown data from Discord:\n${JSON.stringify(_data)}`);
      return;
    }
  }

  _onClose(event) {
    var _msg = 'I:Discord gateway connection closed.';
    if (event.reason == '') {
      console.log(_msg);
      return;
    }
    console.log(`${_msg} Reason:${event.reason}.`);
  }

  _onError(event) {
    console.log(`E:Discord gateway connection closed abnormally:${event.error}.`);
  }

  _onHeartbeat(interval) {
    //console.log(`I:Sending Opcode 1 Heartbeat to Discord after ${interval}ms.`);
  }

  async start() {
    if (this.#isRunning) {
      throw { name: 'BotRunning', message: 'The bot is already running.' };
    }
    console.log('I:Starting bot.');
    this.#isRunning = true;
    if (!burstStacksStarted) startBurstStacks();
    console.log('I:Connecting to Discord gateway.');
    if (this.#gateway == null) {
      this.#gateway = new Gateway(
        (await this.#rest.getGatewayURL()).url,
        this.#botToken,
        0,
        'linux',
        'CompRetty',
        'CompRetty',
      );
      this.#gateway.onOpen = (event) => this._onOpen(event);
      this.#gateway.onMessage = (event) => this._onMessage(event);
      this.#gateway.onClose = (event) => this._onClose(event);
      this.#gateway.onError = (event) => this._onError(event);
      this.#gateway.onHeartbeat = (event) => this._onHeartbeat(event);
    }
    await this.#gateway.open();
  }

  stop() {
    console.log('I:Stopping.');
    this.#isRunning = false;
    console.log('I:Closing Discord gateway.');
    this.#gateway.close();
  }
}
