const app = document.getElementById("albums");
const player = document.getElementById("player");
const albumList = document.getElementById("albumList");
const currentTittleText = document.getElementById("tittle-text");
const trackContainer = document.getElementById("track-container");
const trackScroller = document.getElementById("track-scroller");
const trackButton = document.getElementById("audio-list-button");
const audioProgress = document.getElementById("audio-progress");

const audioPausePlay = document.getElementById("audio-pause-play");
const audioNext = document.getElementById("audio-next");
const audioPrevious = document.getElementById("audio-previous");
const audioCurrentTimer = document.getElementById("current-timer");
const audioDurationTimer = document.getElementById("duration-timer");

const shuffleButton = document.getElementById("shuffle-button");
const loopButton = document.getElementById("loop-button");

var playList = [];
var isLooped = false;
var isRandom = false;
var currentId = -1;
var isPlayList = false;
var isRandom = false;
var albums = [];
var song_ids;
var isTrackOpen = false;
var trackById = {};

var trackLabels = [];

fetch("albums.json")
	.then(res => res.json())
	.then(albums => {
	
	fetch("song_id.json")
		.then(res => res.json())
		.then(song_id => {
			
			song_ids = song_id;
			
			const li = document.createElement("li");
			li.textContent = "All Music";
			albumList.appendChild(li);
			
			// Main albums
			const albumDiv = document.createElement("div");
			albumDiv.className = "album";
		
			
			const title = document.createElement("h2");
			title.className = "album-title";
			title.textContent = "All Music";
			albumDiv.appendChild(title);
			
			const buttonHolder = document.createElement("div");
			buttonHolder.className = "album-button-holder";
			title.appendChild(buttonHolder);
			
			const playAllButton = document.createElement("button");
			playAllButton.className = "album-button-play-all";
			playAllButton.textContent = "Play All";
			buttonHolder.appendChild(playAllButton);
			
			playAllButton.addEventListener("click", playAll);
			
			const trackContainer = document.createElement("div");
			trackContainer.className = "tracks";
			
			var _c = 0;
			
			song_ids.forEach(song => {
				const track = document.createElement("div");
				track.className = "track";
				track.value = _c;
				
				const t = document.createElement("span");
				t.className = "label-text";
				t.id = "audio-title-texttt";
				t.textContent = song.name + " by " + song.author;
				
				
				track.onclick = () => {
					play(track.value);
				};
				
		
				trackContainer.appendChild(track);
				track.appendChild(t);
				trackLabels.push(t);
				_c += 1;
			});
		
			albumDiv.appendChild(trackContainer);
			app.appendChild(albumDiv);
			
			
			albums.forEach(album => {
			// Sidebar list
				add_album(album);
			});
			
		});
	checkOverflow();
	});

trackButton.addEventListener("click", trackOpen);
audioProgress.addEventListener("input", audio_scroller_pressed);
audioNext.addEventListener("click", next);
audioPrevious.addEventListener("click", previous);
audioPausePlay.addEventListener("click", pause_play);
player.addEventListener("ended", finished);
shuffleButton.addEventListener("click", () => {
	isRandom = !isRandom;
	if (isRandom) {
		shuffleButton.className = "track-audio-button-pressed";
	} else {
		shuffleButton.className = "track-audio-button";
		
	}
});
loopButton.addEventListener("click", () => {
	isLooped = !isLooped;
	player.loop = isLooped;
	if (isLooped) {
		loopButton.className = "track-audio-button-pressed";
	} else {
		loopButton.className = "track-audio-button";
	}
});

function trackOpen() {
	if (!isTrackOpen) {
		trackContainer.className = "track-container-open";
		isTrackOpen = true;
	} else {
		trackContainer.className = "track-container";
		isTrackOpen = false;
	}
	
}	

function add_album(album) {
	const li = document.createElement("li");
	li.textContent = album.title;
	albumList.appendChild(li);
	
	// Main albums
	const albumDiv = document.createElement("div");
	albumDiv.className = "album";

	const title = document.createElement("h2");
	title.className = "album-title";
	title.textContent = album.title;
	albumDiv.appendChild(title);
	
	const buttonHolder = document.createElement("div");
	buttonHolder.className = "album-button-holder";
	title.appendChild(buttonHolder);
	
	const playAllButton = document.createElement("button");
	playAllButton.className = "album-button-play-all";
	playAllButton.textContent = "Play All";
	buttonHolder.appendChild(playAllButton);
	
	playAllButton.addEventListener("click", () => {
		playTrack(album.songs);
	});
	
	const trackContainer = document.createElement("div");
	trackContainer.className = "tracks";
	
	album.songs.forEach(song => {
		const track = document.createElement("div");
		track.className = "track";
		track.value = song;
		
		const t = document.createElement("span");
		t.className = "label-text";
		t.textContent = song_ids[song].name + " by " + song_ids[song].author;
		
		track.onclick = () => {
			play(track.value);
		};

		trackContainer.appendChild(track);
		track.appendChild(t);
		trackLabels.push(t);
	});

	albumDiv.appendChild(trackContainer);
	app.appendChild(albumDiv);
	checkOverflow();
}

function playAll() {
	var _current = 0;
	var _ids = [];
	
	song_ids.forEach(song => {
		_ids.push(_current);
		_current += 1;
	});
	
	playTrack(_ids);
	
}

function playTrack(ids) {
	trackById = {};
	trackScroller.innerText = "";
	playList = ids;
	if (ids.length > 0) {
		currentId = ids[0];
		
		ids.forEach(id => {
			
			const track = document.createElement("button");
			track.className = "track2";
			track.value = id;
			
			const t = document.createElement("span");
			t.className = "label-text";
			t.textContent = song_ids[id].name + " by " + song_ids[id].author;
			
			
			track.onclick = () => {
				play(track.value);
			};
			
			trackById[id] = track;
			track.appendChild(t);
			trackLabels.push(t);
			trackScroller.appendChild(track);
			trackScroller.appendChild(document.createElement("br"));
			//alert(id);
			
			
		});
		play(ids[0]);
	}
	checkOverflow();
}

function play(id) {
	if (currentId in trackById) {
		trackById[currentId].className = "track2";
	}
	currentId = id;
	if (currentId in trackById) {
		trackById[currentId].className = "track-playing";
	}
	
	player.src = song_ids[id].file;
	player.loop = false;
	player.play();
	audioPausePlay.children[0].src = "png/pause.png";
	
	audioProgress.disabled = false;
	
	currentTittleText.textContent = song_ids[id].name + " - " + song_ids[id].author;
}

function finished() {
	if (isLooped) {
		playee.currentTime = 0;
		player.play();
	} else  {
		if (isRandom && playList.length > 0) {
			var indx = randomInt(0, playList.length - 1);
			play(playList[indx]);
			
		} else {
			next();
		}
	}
}

function next() {
	var idx = get_index_from_track(currentId);
	//alert(idx);
	if (idx != -1 & playList.length > -1) {
		if (idx < playList.length - 1) {
			play(playList[idx + 1]);
		} else {
			play(playList[0]);
		}
	}
}

function previous() {
	var idx = get_index_from_track(currentId);
	//alert(idx);
	if (idx != -1 && playList.length > -1) {
		if (idx > 0) {
			play(playList[idx - 1]);
		} else {
			play(playList[playList.length - 1]);
		}
	}
}

function pause_play() {
	
	if (player.src != "") {
		if (player.paused) {
			player.play();
			audioPausePlay.children[0].src = "png/pause.png";
		} else {
			player.pause();
			audioPausePlay.children[0].src = "png/play-button.png";
		}
	}
}

function get_index_from_track(id) {
	var _c = 0;
	var found = -1;
	playList.forEach(cid => {
		//alert(cid);
		if (cid == id) {
			found = _c;
		}
		_c += 1;
	})
	return found;
}

function update_scroller() {
	audioProgress.value = player.currentTime;
	audioProgress.max = player.duration;
	
	var c = Math.floor(player.currentTime);
	var d = player.duration;
	var cm = (Math.floor(c / 60));
	var cs = (c - (Math.floor(c / 60) * 60));
	var scs = cs;
	if (cs < 10) {
		scs = "0" + cs;
	}
	audioCurrentTimer.textContent = cm + ":" + scs;
	
	var c = Math.floor(player.duration);
	if (Number.isNaN(c)) {
		c = 0;
	}
	var d = player.duration;
	var cm = (Math.floor(c / 60));
	var cs = (c - (Math.floor(c / 60) * 60));
	var scs = cs;
	if (cs < 10) {
		scs = "0" + cs;
	}
	audioDurationTimer.textContent = cm + ":" + scs;
	
}

function audio_scroller_pressed(event) {
	player.currentTime = event.target.value;
}

const appSecondLoop = setInterval(() => {
	update_scroller();
	//checkOverflow();
}, 100);

checkOverflow();
window.addEventListener('resize', checkOverflow);

function checkOverflow() {
	
	//alert("Checking for Overflows");
	
	trackLabels.forEach(clabel => {
		//alert(clabel);
		const container = clabel.parentElement;
		
		//alert(container);
		
		if (clabel.offsetWidth > container.offsetWidth) {
			//alert("C");
			clabel.classList.add("scroll");
		} else {
			clabel.classList.remove("scroll");
		}
	})
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}