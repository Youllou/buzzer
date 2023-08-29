<template>
	<div id="host">
		<div class="row">
			<h1 class="">Host</h1>
			<div class="col m6"></div>
			<div class="col m3 flex" id="Share">
				<div id="qr"></div>
				<br>
				<a id="link" class="btn-floating grey"><i class="material-icons" @click="share()">share</i></a>
			</div>
		</div>
		<div v-if="loading" class="loading">Loading...</div>
		<!-- the room code -->
		<h4>Room : {{id}}</h4>
		<!-- the player that buzzed -->
		<div class="row">
			<h4 class="col m3">Buzzed player</h4>
			<div class="col m3">Score</div>
			<div class="col m3">
				<a class="waves-effect waves-circle waves-light btn green">
					<i class="material-icons " @click="unbuzzAll()">refresh</i>
				</a>
			</div>
		</div>
		<hr>
		<div v-if="buzzed.length > 0">
			<ul>
				<li class="row" v-for="player in buzzed" >
					<div class="col m3">{{ player.name }}</div>
					<div class="col m3">
						<a class="waves-effect waves-circle waves-light btn grey" @click="score(player,1)">
							<i class="material-icons">add</i>
						</a>
						<a class="waves-effect waves-circle waves-light btn grey" @click="score(player,-1)">
							<i class="material-icons">remove</i>
						</a>
					</div>
					<div class="col m3">
						<a class="waves-effect waves-circle waves-light btn green" @click="unbuzz(player)">
							<i class="material-icons">refresh</i>
						</a>
					</div>
				</li>
			</ul>
		</div>
		<br>
		<br>
		<!-- the players in the room -->
		<div class="row">
			<h4 class="col m3">Players</h4>
			<div class="col m3">Score</div>
			<div class="col m3">
				<a class="waves-effect waves-circle btn yellow accent-4 black-text" @click="lockAll()">
					<i v-if="allLocked" class="material-icons">lock</i>
					<i v-else class="material-icons">lock_open</i>
				</a>
			</div>
			<div class="col m3">Ban</div>
		</div>
		<hr>
		<div v-if="players.length > 0">
			<ul>
				<li class="row" v-for="player in players">
					<div class="col m3 name">{{ player.name }}</div>
					<div class="col m3 score">{{ player.score }}</div>
					<div class="col m3">
						<a class="waves-effect waves-circle btn yellow accent-4 black-text" @click="lock(player)">
							<i v-if="player.locked" class="material-icons">lock</i>
							<i v-else class="material-icons">lock_open</i>
						</a>
					</div>
					<div class="col m3">
						<a class="waves-effect waves-circle btn red" @click="ban(player)">
							<i class="material-icons">exit_to_app</i>
						</a>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: "Host",
	computed: {
		id: function () {
			return this.$route.params.room;
		},
		buzzed: function () {
			return this.players.filter(player => player.buzzed);
		}
	},
	data() {
		return {
			loading: true,
			players: [],
			timerPlayers: null,
			allLocked: false,
			qrcode:{}
		}
	},
	mounted() {
		if (this.id == 0){
			this.createRoom();
		}else{
			this.loading = false;
			this.timerPlayers = setInterval(this.refreshPlayers, 1000);
		}
		this.$nextTick(() => {
			this.qrcode = new QRCode(document.getElementById("qr"), {
				text: "http://92.222.177.232/player/"+this.id,
				width: 128,
				height: 128,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.M
			});
		})
	},
	methods: {
		createRoom(){
			fetch('http://youllou.com:3000/buzzer/')
				.then(response => {
					response.json().then(result => {
						let id = result.id;
						this.$router.push({ name: 'host', params: { room:id } })
						this.loading = false;
						this.$watch('id', () => {
							console.log("id changed")
						})
						this.timerPlayers = setInterval(this.refreshPlayers, 200);
					})
				})
		},
		refreshPlayers() {
			fetch('http://youllou.com:3000/player/'+this.id)
				.then(response => response.json())
				.then(data => {
					this.players = data;
					if(this.players.filter(player => player.locked).length === this.players.length){
						this.allLocked = true;
					}
				})
		},
		score(player,score){
			fetch('http://youllou.com:3000/player/'+this.id+'/score', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: player.name,
					score: score
				}),
			})
				.then(response =>{
					response.json()
						.then(data => {
							console.log('Success:', data);
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				}).catch((error) => {
					console.error('Error:', error);
				});
		},
		lockAll(){
			this.allLocked = !this.allLocked;
			fetch('http://youllou.com:3000/player/'+this.id+'/lock', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					locked: this.allLocked
				}),
			})
				.then(response =>{
					response.json()
						.then(data => {
							console.log('Success:', data);
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				}).catch((error) => {
					console.error('Error:', error);
				});
		},
		lock(player){
			player.locked = !player.locked;
			fetch('http://youllou.com:3000/player/'+this.id+'/lock/'+player.name, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					locked: player.locked
				}),
			})
				.then(response =>{
					response.json()
						.then(data => {
							console.log('Success:', data);
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				}).catch((error) => {
					console.error('Error:', error);
				});
		},
		unbuzzAll(){
			fetch('http://youllou.com:3000/player/'+this.id+'/buzz', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(response =>{
					response.json()
						.then(data => {
							console.log('Success:', data);
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				}).catch((error) => {
					console.error('Error:', error);
				});
		},
		unbuzz(player){
			fetch('http://youllou.com:3000/player/'+this.id+'/buzz/'+player.name, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(response =>{
					response.json()
						.then(data => {
							console.log('Success:', data);
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				}).catch((error) => {
					console.error('Error:', error);
				});
		},
		ban(player){
			fetch('http://youllou.com:3000/player/'+this.id+'/'+player.name, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(response =>{
					console.log(response)
					response.json()
						.then(data => {
							console.log('Success:', data);
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				}).catch((error) => {
					console.error('Error:', error);
				});
		},
		share(){
			if (navigator.share) {
				navigator.share({
					title: 'Buzzer',
					text: 'Join my buzzer room',
					url: "http://92.222.177.232/player/"+this.id
				})
					.then(() => console.log('Successful share'))
					.catch((error) => console.log('Error sharing', error));
			}else{
				navigator.clipboard.writeText("http://92.222.177.232/player/"+this.id)
					.then(() => {
						console.log('Async: Copying to clipboard was successful!');
					})
					.catch(err => {
						console.error('Async: Could not copy text: ', err);
					});
			}
		}
	},
	unmounted() {
		clearInterval(this.timerPlayers);
	}


}

</script>

<style scoped>
.flex{
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	align-items: center;
}
.btn-floating>i{
	right: 1px;
}
</style>
