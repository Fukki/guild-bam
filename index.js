const path = require('path');
const fs = require('fs');
const player = require('node-wav-player');
module.exports = function  guildBAM(mod) {
	const cmd = mod.command || mod.require.command;
	let config = getConfig();
	
	cmd.add('gb', {
		$none() {
			config.enabled = !config.enabled;
			msg(`Guild BAM: ${config.enabled ? '<font color="#56B4E9">[Enable]' : '<font color="#E69F00">[Disable]'}`);
			updateConfig();
		},
		playwav() {
			config.playWav = !config.playWav;
			msg(`Play wav file: ${config.playWav ? '<font color="#56B4E9">[Enable]' : '<font color="#E69F00">[Disable]'}`);
			updateConfig();
		},
		sound(id) {
			if (!isNaN(id)) {
				config.sound = Number(id);
				msg(`<font color="#56B4E9">Changed SoundID: </font> ${config.sound}`);
				updateConfig();
			}
		},
		testsound(id) {
			if (!isNaN(id)) {
				id = Number(id);
				msg(`<font color="#56B4E9">Testing SoundID:</font>: [${id}]`);
				mod.send('S_PLAY_SOUND', 1, {SoundID: id});
			}
		}
	})

	mod.hook('S_NOTIFY_GUILD_QUEST_URGENT', 1, e => {
		if (config.enabled && e.type === 0) {
			let s = '';
			switch (e.quest) {
				case '@GuildQuest:6001001':
					s = 'Anansha';
					break;
				case '@GuildQuest:6002001':
					s = 'Frygaras';
					break;
				case '@GuildQuest:6003001':
					s = 'Sabranak';
					break;
			}
			if (s != '') {
				if (config.sound > 0)
					mod.send('S_PLAY_SOUND', 1, {
						SoundID: config.sound}
					);
				if (config.playWav)
					setTimeout(function () {
						player.play({
							path: __dirname + '/wav/' + s + '.wav',
							sync: true
						}).catch((error) => {
							console.error(error);
						});
					}, config.delayWav);
				mod.send('S_CHAT', 2, {
					authorName: '',
					channel: 7,
					message: '<font color="#56B4E9">[' + timeFormat(new Date())] + 'Guild BAM</font> <font color="#3399FF">' + s + '</font> <font color="#56B4E9">was coming.'
				});
			}
		}
	});

	function getConfig() {
		let data = {};
		try {
			data = require('./config.json');
		} catch (e) {
			data = {
				enabled: true,
				playWav: true,
				delayWav: 2000,
				SoundId: 2001
			}
			jsonSave('config.json', data);
		}
		return data;
	}
	
	function timeFormat(t){
		return t.getHours().toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':' +
			t.getMinutes().toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':' + 
			t.getSeconds().toLocaleString(undefined, {minimumIntegerDigits: 2});
	}
	
	function msg(s) {cmd.message(s);}
	
	function updateConfig() {jsonSave('config.json', config);}
	
	function jsonSave(name,data) {fs.writeFile(path.join(__dirname, name), JSON.stringify(data, null, 4), err => {});}
}
