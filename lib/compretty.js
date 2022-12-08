import { REST, Gateway } from './gleamcord.js';
import * as Fs from 'fs';
import * as Path from 'path';

const helpDesc = 'Show a list of available commands';
const setupDesc = 'Summon the setup wizard';
const channelDesc = 'Channel administration commands';
const channelClearPlayersDesc  = 'Clear competition players';
const competitionDesc = 'Show the competition';

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
    name: 'channel',
    dm_permission: false,
    description: channelDesc,
    type: 1,
    default_member_permissions: '0',
    default_permission: false,
    options: [
      {
        name: 'clear_players',
        dm_permission: false,
        description: channelClearPlayersDesc,
        type: 1,
        default_member_permissions: '0',
        default_permission: false,
      },
    ],
  },
  {
    name: 'competition',
    dm_permission: false,
    description: competitionDesc,
    type: 1,
  },
];

const embedColor = 16546406;
const logoURL = 'https://raw.github.com/GleammerRay/CompRetty/master/assets/logo.png';
const embedAuthor = {
  name: 'CompRetty',
  url: 'https://raw.github.com/GleammerRay/CompRetty/master/assets/logo.png',
  icon_url: logoURL,
};
const embedFooter = {
  icon_url: 'https://cdn.discordapp.com/attachments/1005272489380827199/1005581705035399198/gleam.jpg',
  text: 'Made by Gleammer (nice)',
};

const adminHelpField = '{"name":"Admin commands :crown:","value":"' +
`\`/setup\` - ${setupDesc}\\n` +
`\`/channel clear_players\` - ${channelClearPlayersDesc}` +
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

function ranInt(start, end) {
  return start + Math.round((Math.random() * (end - start)));
}

function generateTeamName() {
  var _word1 = defaultTeamFirstWords[ranInt(0, 4)];
  var _word2 = defaulTeamSecondWords[ranInt(0, 4)];
  return `${_word1} ${_word2}`;
}

function formatRole(id) {
  var _role = null;
  if (id != null) {
    _role = `<@&${id}>`;
  }
  return _role;
}

function getHelpMsg(isAdmin = false) {
  var _adminHelpField = '';
  if (isAdmin) _adminHelpField = adminHelpField;
  return (`{"type":4,"data":{"flags":${1 << 6},"embeds":[{` +
    '"title":"Command list",' +
    `"footer":${JSON.stringify(embedFooter)},` +
    `"thumbnail":{"url":"${logoURL}"},` +
    `"author":${JSON.stringify(embedAuthor)},` +
    '"description":"' +
    `\`/help\` - ${helpDesc}\\n` +
    `\`/competition\` - ${competitionDesc}` +
    '",' +
    `"fields":[${_adminHelpField}]` +
    '}]}}');
}

function getInteractionResponse(data, type = 4) {
  return `{"type":${type},"data":${JSON.stringify(data)}}`;
}

function getEphemeralResponse(content) {
  return getInteractionResponse({flags: 1 << 6, content: content});
}

function getSimpleModal(title, customID, component) {
  return {
    title: title,
    custom_id: customID,
    components: [{
      type: 1,
      components: [component]
    }]
  };
}

function isAdmin(member) {
  return (member.permissions & (1 << 3)) == (1 << 3);
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

  static fromJSON(json, rest) {
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

  _getTeamInfoMessage() {
    var _description = '';
    if (this.#description != '') _description = `${this.#description}\n\n`;
    _description += ':hugging: **Players:**\n';
    Object.keys(this.#players).forEach((userID) => _description += `<@${userID}> `);
    var _image;
    var _imageURL = this.#imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: this.#imageURL };
    return {
      embeds: [{
        title: `:shield: ${this.#name}`,
        description: _description,
        color: embedColor,
        timestamp: '2022-12-04T16:49:38.545Z',
        footer: embedFooter,
        thumbnail: {
          url: logoURL,
        },
        image: _image,
        author: embedAuthor,
      }],
    }
  }

  sendTeamInfo(channelID) {
    return this.#rest.createMessage(
      channelID,
      JSON.stringify(this._getTeamInfoMessage()),
    );
  }

  async ghostPing(channelID) {
    var _userIDs = Object.keys(this.#players);
    if (_userIDs.length == 0) return;
    var _message = `<@${_userIDs[0]}>`
    async function _ghostPing(rest) {
      _message = await rest.createMessage(channelID, `{"content":"${_message}"}`);
      if (_message != null) if (_message.id != null) await rest.deleteMessage(channelID, _message.id);
    }
    for (let i = 1; i < _userIDs.length; i++) {
      // Maximum of 95 mentions per ping
      if ((i % 95) == 0) {
        await _ghostPing(this.#rest);
        _message = '';
      }
      _message += `<@${_userIDs[i]}>`;
    }
    await _ghostPing(this.#rest);
  }
}

export class CompRettyTeams {
  #onSave;
  #onAllReady;
  #rest;
  #teams;
  #playerTeams;

  constructor(teams = {}) {
    this.#teams = teams;
    this.#playerTeams = {};
    Object.values(teams).forEach((team) => Object.values(team.players).forEach((player) => this.#playerTeams[player.id] = team));
  }

  static withREST(rest, teams = {}) {
    var _teams = new CompRettyTeams(teams);
    _teams.#rest = rest;
    return _teams;
  }

  static fromJSON(json, rest) {
    var _teams = {};
    Object.values(json).forEach((team) => _teams[team.name] = CompRettyTeam.fromJSON(team, rest));
    return CompRettyTeams.withREST(rest, _teams);
  }

  toJSON() {
    var _teamsJSON = [];
    Object.values(this.#teams).forEach((team) => _teamsJSON.push(team.toJSON()))
    return _teamsJSON;
  }

  set onSave(value) {
    this.#onSave = value;
  }

  set onAllReady(value) {
    this.#onAllReady = value;
  }

  get values() {
    return Object.values(this.#teams);
  }

  get length() {
    return Object.keys(this.#teams).length;
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

  getTeam(name) {
    return this.#teams[name];
  }

  removeTeam(name) {
    Object.keys(this.#teams[name].players).forEach((id) => delete this.#playerTeams[id]);
    delete this.#teams[name];
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
    Object.keys(this.#playerTeams).forEach((id) => this.removePlayer(id));
  }

  setPlayerReady(id, value) {
    var _team = this.#playerTeams[id];
    if (_team == null) return;
    _team.setPlayerReady(id, value);
  }

  async sendTeamsInfo(channelID) {
    var _teams = Object.values(this.#teams);
    for (let i = 0; i < _teams.length; i++) await _teams[i].sendTeamInfo(channelID);
  }

  async setupWizard(interaction, updateMessage = false, teamIndex = 0) {
    if (teamIndex == 'new_team') {
      teamIndex = Object.keys(this.#teams).length;
      if (teamIndex != 15) {
        this.createTeam(generateTeamName());
        if (this.#onSave != null) this.#onSave();
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
          timestamp: '2022-12-04T16:49:38.545Z',
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          image: _image,
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

  setup(interaction) {    
    var _command =  interaction.data.custom_id.split(' ');
    var _arg2 = _command[2];
    if (_arg2 == null) return this.setupWizard(interaction);
    var _team;
    var _val;
    if (_arg2 != 'get') {
      var _teamName =  interaction.data.custom_id.split('"')[1];
      _team = this.getTeam(_teamName);
      if (_team == null) return this.setupWizard(interaction, true);
      var _components = interaction.data.components;
      if (_components != null) _val = _components[0].components[0].value;
    }
    switch (_arg2) {
    case 'get':
      var _value = interaction.data.values['0'];
      if (_value != 'new_team') _value = Number.parseInt(_value);
      return this.setupWizard(interaction, true, _value);
    case 'name':
      if (_val == null) return this._teamNameModal(interaction, _team.name);
      _val = _val.slice(0, 50);
      if (this.getTeam(_val) != null) return this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`A team with name ${_val} already exists. :exploding_head:`));
      this.renameTeam(_team.name, _val);
      if (this.#onSave != null) this.#onSave();
      return this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    case 'description':
      if (_val == null) return this._teamDescriptionModal(interaction, _team.name);
      _val = _val.slice(0, 100);
      _team.description = _val;
      if (this.#onSave != null) this.#onSave();
      return this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    case 'image_url':
      if (_val == null) return this._teamImageModal(interaction, _team.name);
      _val = _val.slice(0, 256);
      _team.imageURL = _val;
      if (this.#onSave != null) this.#onSave();
      return this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    case 'remove':
      this.removeTeam(_team.name);
      if (this.#onSave != null) this.#onSave();
      return this.setupWizard(interaction, true, Object.keys(this.#teams).indexOf(_team.name));
    }
  }

  teamsWizard(interaction, updateMessage = false, teamName) {
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
    if (_team == null) {
      var _playerTeam = this.getPlayerTeam(_playerID);
      if (_playerTeam == null) {
        teamName = _options[0].label;
        _team = this.getTeam(teamName);
        if (_team == null) return this.teamsWizard(interaction, updateMessage, teamName);
      } else {
        teamName = _playerTeam.name;
        _team = _playerTeam;
      }
    }
    var _description;
    if (_team.description == '') _description = 'No description';
    else _description = _team.description;
    var _playerIDs = Object.keys(_team.players);
    if (_playerIDs.length != 0) {
      if (_description == null) _description = '\n\n:hugging: **Players:**\n';
      else _description += '\n\n:hugging: **Players:**\n';
      _playerIDs.forEach((playerID) => {
        _description += `<@${playerID}> `;
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
        custom_id: `competition teams join "${teamName}"`,
        label: 'Join',
        style: 1,
      });      
    } else {
      _buttons.push({
        type: 2,
        custom_id: 'competition teams leave',
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
    _buttons.push(
      {
        type: 2,
        custom_id: `competition teams refresh "${teamName}"`,
        label: 'Refresh',
        style: 2,
        emoji: {
          id: null,
          name: '🔄',
        },
      },
    );
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _image;
    var _imageURL = _team.imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: _team.imageURL };
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: [{
          title: teamName,
          description: _description,
          color: embedColor,
          timestamp: '2022-12-04T16:49:38.545Z',
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          image: _image,
          author: embedAuthor,
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'competition teams',
                options: _options,
                placeholder: teamName,
              },
            ],
          },
          {
            type: 1,
            components: _buttons,
          },
        ],
      },
      _type,
    ));
  }

  async onTeams(interaction) {
    var _playerID = interaction.member.user.id;
    var _command =  interaction.data.custom_id.split(' ');
    var _teamName =  interaction.data.custom_id.split('"')[1];
    var _arg2 = _command[2];
    var _arg3 = _command[3];
    switch (_arg2) {
      case 'refresh':
        return await this.teamsWizard(interaction, true, _teamName);
      case 'join':
        var _team = this.getTeam(_teamName);
        if (_team == null) return await this.teamsWizard(interaction, true);
        var _playerCount = Object.keys(_team.players).length;
        if (_playerCount >= _team.maxPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Team ${_teamName} is full - ${_playerCount}/${_team.maxPlayers} players :no_entry:`));
        this.setPlayerTeam(_playerID, _teamName);
        if (this.#onSave != null) this.#onSave();
        return await this.teamsWizard(interaction, true, _teamName);
      case 'ready':
        var _team = this.getPlayerTeam(_playerID);
        if (_team == null) return await this.teamsWizard(interaction, true);
        if (Object.keys(_team.players).length < _team.minPlayers) return await this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Your team needs at least ${_team.minPlayers} players to start. :busts_in_silhouette:`));
        _teamName = _team.name;
        this.setPlayerReady(_playerID, JSON.parse(_arg3));
        if (this.#onSave != null) this.#onSave();
        if (this.#onAllReady != null) if (this.allReady) return await this.#onAllReady(interaction);
        return await this.teamsWizard(interaction, true, _teamName);
      case 'leave':
        var _team = this.removePlayer(_playerID);
        if (this.#onSave != null) this.#onSave();
        if (_team == null) _teamName = '';
        else _teamName = _team.name;
        return await this.teamsWizard(interaction, true, _teamName);
    }
    if (interaction.data.values == null) return await this.teamsWizard(interaction);
    return await this.teamsWizard(interaction, true, interaction.data.values[0]);
  }

  async ghostPingAll(channelID) {
    var _teams = this.values;
    for (let i = 0; i < _teams.length; i++) await _teams[i].ghostPing(channelID);
  }
}

export class CompRettyCompetition {
  #dbPath;
  #jsonPath;
  #rest;
  #enabled;
  #name;
  #description;
  #imageURL;
  #shuffleEnabled;
  #teams;

  constructor(name, description = '', imageURL = '', shuffleEnabled = true, teams = null) {
    if (teams == null) teams = new CompRettyTeams();
    teams.onSave = () => this.saveSync();
    teams.onAllReady = async (interaction) => {
      await this.#rest.createInteractionResponse(interaction, getInteractionResponse({content: 'All teams are ready, the competition is starting. :crossed_swords:', embeds: [], components: []}, 7));
      await this._onAllTeamsReady(interaction);
    };
    this.#enabled = true;
    this.#name = name;
    this.#description = description;
    this.#imageURL = imageURL;
    this.#shuffleEnabled = shuffleEnabled;
    this.#teams = teams;
  }

  static withREST(rest, name, description = '', imageURL = '', shuffleEnabled = true, teams = null) {
    if (teams == null) teams = CompRettyTeams.withREST(rest);
    var _competition = new CompRettyCompetition(name, description, imageURL, shuffleEnabled, teams);
    _competition.#rest = rest;
    return _competition;
  }

  static fromDB(path, rest) {
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

  static fromJSON(json, rest) {
    var _teams = CompRettyTeams.fromJSON(json.teams, rest);
    return CompRettyCompetition.withREST(rest, json.name, json.description, json.imageURL, json.shuffleEnabled, _teams);
  }

  toJSON() {    
    return {
      enabled: this.#enabled,
      name: this.#name,
      description: this.#description,
      imageURL: this.#imageURL,
      shuffleEnabled: this.#shuffleEnabled,
      teams: this.#teams.toJSON(),
    };
  }

  saveSync() {
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
  }

  execute(interaction) {
    if (!this.#enabled) return this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Competition is currently disabled. :no_entry_sign:`));
    if (this.#teams.length == 0) return this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`There are no teams set up for this competition. :empty_nest:`));
    var _customID = interaction.data.custom_id;     
    if (_customID == null) return this.sendCompetition(interaction);
    var _command = interaction.data.custom_id.split(' ');
    var _arg0 = _command[0];
    if (_arg0 == 'setup') return this.setup(interaction);
    var _arg1 = _command[1];
    if (_arg1 == 'teams') this.#teams.onTeams(interaction);
  }

  clearPlayers() {
    this.#teams.clearPlayers();
    this.saveSync();
  }

  setupWizard(interaction, updateMessage = false) {
    var _type;
    if (updateMessage) _type = 7;
    else _type = 4;
    var _image;
    var _imageURL = this.#imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: this.#imageURL };
    var _description;
    if (this.#description == '') _description = 'No description';
    else _description = this.#description;
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      {
        flags: 1 << 6,
        embeds: [{
          title: 'Setup Competition',
          color: embedColor,
          timestamp: '2022-12-04T16:49:38.545Z',
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          image: _image,
          author: embedAuthor,
          fields: [
            {
              name: this.#name,
              value: _description,
            }
          ]
        }],
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

  setup(interaction) {
    var _command =  interaction.data.custom_id.split(' ');
    var _arg1 = _command[1];
    var _components = interaction.data.components;
    if (_arg1 == 'competition') {
      var _arg2 = _command[2];
      if (_arg2 == null) return this.setupWizard(interaction);
      switch (_arg2) {
      case 'name':
        if (_components == null) return this._nameModal(interaction);
        var _val = _components[0].components[0].value;
        this.#name = _val.slice(0, 100);
        this.saveSync();
        return this.setupWizard(interaction, true);
      case 'description':
        if (_components == null) return this._descriptionModal(interaction);
        var _val = _components[0].components[0].value;
        this.#description = _val.slice(0, 100);
        this.saveSync();
        return this.setupWizard(interaction, true);
      case 'image_url':
        if (_components == null) return this._imageModal(interaction);
        var _val = _components[0].components[0].value;
        this.#imageURL = _val.slice(0, 256);
        this.saveSync();
        return this.setupWizard(interaction, true);
      }
      return this.setupWizard(interaction);
    }
    return this.#teams.setup(interaction);
  }

  _getCompetitionMessage(_hasControls = true) {
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
    if (this.#description != '') _description = `${this.#description}\n\n`;
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
              label: 'View/join teams',
              style: 1,
            },
          ],
        },
      ];
    }
    var _image;
    var _imageURL = this.#imageURL.split('://');
    if (_imageURL.length == 2 && (_imageURL[0] == 'http' || _imageURL[0] == 'https')) _image = { url: this.#imageURL };
    return {
      embeds: [{
        title: this.#name,
        description: _description,
        color: embedColor,
        timestamp: '2022-12-04T16:49:38.545Z',
        footer: embedFooter,
        thumbnail: {
          url: logoURL,
        },
        image: _image,
        author: embedAuthor,
        fields: _fields,
      }],
      components: _components,
    };
  }

  sendCompetition(interaction) {
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse(
      this._getCompetitionMessage(),
    ));
  }

  async _onAllTeamsReady(interaction) {
    this.#enabled = false;
    this.saveSync();
    await this.#rest.createMessage(interaction.channel_id, JSON.stringify(this._getCompetitionMessage(false)));
    await this.#teams.sendTeamsInfo(interaction.channel_id);
    await this.#teams.ghostPingAll(interaction.channel_id);
    this.#teams.clearPlayers();
    this.#enabled = true;
    this.saveSync();
  }
}

export class CompRettyChannel {  
  #dbPath;
  #jsonPath;
  #rest;
  #id;  
  #enabled;
  #adminRole;
  #competition;

  constructor(id, enabled = false, adminRole = null, competition = undefined) {
    if (competition === undefined) competition = new CompRettyCompetition('Competition', 'Working together wins games.');
    this.#id = id;
    this.#enabled = enabled;
    this.#adminRole = adminRole;
    this.#competition = competition;
  }

  static withREST(rest, id, enabled = false, adminRole = null, competition = undefined) {
    if (competition == null) competition = CompRettyCompetition.withREST(rest, 'Competition', 'Working together wins games.');
    var _channel = new CompRettyChannel(id, enabled, adminRole, competition);
    _channel.#rest = rest;
    return _channel;
  }

  static fromDB(path, rest) {
    var _id;
    {
      var _pathSplit = path.split(Path.sep);
      _id = _pathSplit[_pathSplit.length - 1];
    }
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _jsonPath =  Path.join(path, 'channel.json');
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
    return _channel;
  }

  static fromJSON(json, rest) {
    var _competition;
    if (json.competition == null) _competition = undefined;
    else _competition = CompRettyCompetition.fromJSON(json.competition, rest);
    return CompRettyChannel.withREST(rest, json.id, json.enabled, json.adminRole, _competition);
  }

  toJSON() {
    var _competition;
    if ((this.#dbPath == null) && (this.#competition != null)) _competition = this.#competition.toJSON();
    else _competition = null;
    return {
      id: this.#id,
      enabled: this.#enabled,
      competition: _competition,
      adminRole: this.#adminRole,
    };
  }

  saveSync() {
    if (this.#dbPath != null) Fs.writeFileSync(this.#jsonPath, JSON.stringify(this.toJSON()));
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

  _clearPlayersExecute(interaction, skipAdminCheck = false) {
    if (!skipAdminCheck) if (!this.isAdmin(interaction.member)) return this.sendPermissionDenied(interaction);
    this.#competition.clearPlayers();
    return this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Removed all players from competition :wind_blowing_face:`));
  }

  _competitionExecute(interaction) {
    if (!this.#enabled) return this.#rest.createInteractionResponse(interaction, getEphemeralResponse(`Competition commands are currently disabled for this channel. :no_entry_sign:`));
    var _response = this.#competition.execute(interaction);
    return _response;
  }

  execute(interaction, skipAdminCheck = false) {
    var _commandName;
    if (interaction.data.custom_id == null) _commandName = interaction.data.name;
    else _commandName = interaction.data.custom_id.split(' ')[0];
    switch (_commandName) {
      case 'setup': return this.setup(interaction, skipAdminCheck);
      case 'competition': return this._competitionExecute(interaction);
    }
    var _arg1;
    if (interaction.data.options != null) {
      var _option = interaction.data.options[0];
      if (_option != null) {
        _arg1 = _option.name;
      }
    }
    switch (_arg1) {
      case 'clear_players': return this._clearPlayersExecute(interaction, skipAdminCheck);
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
          timestamp: '2022-12-04T16:49:38.545Z',
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
                custom_id: 'setup channel set enabled',
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

  setup(interaction, skipAdminCheck = false) {
    if (!skipAdminCheck) if (!this.isAdmin(interaction.member)) return this.sendPermissionDenied(interaction);
    var _command =  interaction.data.custom_id.split(' ');
    var _arg1 = _command[1];
    if (_arg1 == 'channel') {
      var _arg2 = _command[2];
      if (_arg2 == null) return this.setupWizard(interaction);
      var _arg3 = _command[3];
      switch (_arg2) {
      case 'set':
        switch (_arg3) {
        case 'enabled':
          this.enabled = JSON.parse(interaction.data.values[0]);
          this.saveSync();
          return this.setupWizard(interaction, true);
        }
        return;
      }
    }
    return this.#competition.execute(interaction);
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

  static fromDB(path, rest) {
    var _id;
    {
      var _pathSplit = path.split(Path.sep);
      _id = _pathSplit[_pathSplit.length - 1];
    }
    if (!Fs.existsSync(path)) {
      Fs.mkdirSync(path, { recursive: true });
    }
    var _jsonPath =  Path.join(path, 'guild.json');
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
    return _guild;
  }

  static fromJSON(json, rest) {
    var _channels = {};
    Object.values(json.channels).forEach((channel) => _channels[channel.id] = CompRettyChannel.fromJSON(channel, rest));
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
      return CompRettyChannel.fromDB(Path.join(this.#dbPath, 'channels', id), this.#rest);
    }
    var _channel = this.#channels[id];
    if (_channel == null) {
      _channel = CompRettyChannel.withREST(this.#rest, id);
      this.#channels[id] = _channel;
    }    
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
    case 'channel': return this._channelExecute(interaction, _isAdmin);
    case 'competition': return this._channelExecute(interaction, _isAdmin);
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
          timestamp: '2022-12-04T16:49:38.545Z',
          footer: embedFooter,
          thumbnail: {
            url: logoURL,
          },
          author: embedAuthor,
          fields: [
            {
              name: ':crown: Admin role',
              value: `${formatRole(this.#adminRole)}`,
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
                placeholder: '👑 Select a different admin role',
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
                label: 'Reset Admin role',
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

  static fromDB(path, rest) {
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

  static fromJSON(json, rest) {
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
  #userCommands;
  #componentCommands;
  #adminComponentCommands;

  _setupExecute(interaction) {
    if (interaction.data.custom_id != null) return this._guildExecute(interaction);
    return this.#rest.createInteractionResponse(interaction, getInteractionResponse({
      flags: 1 << 6,
      embeds: [{
        title: 'Setup',
        description: 'Hi! I am Retty, here to help you and your server create and enjoy exciting competitions.\n\n▶️ In this menu, I will walk you through setting up team names, descriptions and images of your competition teams for this channel. \n\n▶️ You can set up many competitions at once in separate channels.\n\n▶️ Once a competition is set up and enabled, simply use `/competition` to start playing.',
        color: embedColor,
        timestamp: '2022-12-04T16:49:38.545Z',
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

    this.#userCommands = {
      help: (interaction) => this._guildExecute(interaction),
      setup: (interaction) => this._setupExecute(interaction),
      competition: (interaction) => this._guildExecute(interaction),
      channel: (interaction) => this._guildExecute(interaction),
    };
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
    var _command = this.#userCommands[_commandName];
    if (_command == null) return this._onInteractionError(interaction, interaction.data);
    return _command(interaction);
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
        console.log(`${_msg}:${_interaction.name}.`);
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
    console.log('I:Connecting to Discord gateway.');
    if (this.#gateway == null) {
      this.#gateway = new Gateway(
        (await this.#rest.getGatewayURL()).url,
        this.#botToken,
        512,
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