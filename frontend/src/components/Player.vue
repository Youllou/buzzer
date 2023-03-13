<template>
	<div id="player">
		<h1>Player</h1>


		<form v-if="this.name ===''" onsubmit="return false">
			<!-- the player's name -->
			<div class="input-field col s6">
				<i class="material-icons prefix">account_circle</i>
				<input type="text" id="playerName" v-model="nameform" />
				<label for="playerName">Name</label>
			</div>
			<br>
			<br>
			<!-- the room code -->
			<div class="input-field col s6">
				<i class="material-icons prefix">home</i>
				<input type="text" id="roomCode" v-model="roomform" />
				<label for="roomCode">Room Code</label>
			</div>
			<br>
			<br>
			<!-- the submit button -->
			<button class="waves-effect waves-light btn" @click="setNameAndRoom()">LETSGO</button>
		</form>

		<div v-if = "this.name!== ''">
			<!-- the player's name -->
			<h4>Name : {{name}}</h4>
			<!-- the room code -->
			<h4>Room : {{room}}</h4>
			<!-- the buzz button -->
			<button id="buzz" :class="{ buzzed:buzzed, locked:locked}" :disabled="buzzed" @click="buzz">{{BuzzerText}}</button>

			<!-- list of all buzzed players -->
			<div class="row">
				<h4 class="col m3">Buzzed players</h4>
				<div class="col m3">Score</div>
			</div>
			<hr>
			<div>
				<ul>
					<li class="row" v-for="player in buzzedPlayers" :key="player.id">
						<div class="col m3 player-div">
							<div v-if="player.name === this.name">
								[You]&nbsp;
							</div>
							{{player.name}}
						</div>
						<div class="col m3">{{ player.score }}</div>
					</li>
				</ul>
			</div>
		</div>
	</div>


	<vue-basic-alert
		:duration="300"
		:closeIn="3000"
		ref="alert" />
</template>

<script>
import VueBasicAlert from 'vue-basic-alert'
export default {
	components:{
		VueBasicAlert
	},
	name: "Player",
	data() {
		return {
			nameform: "",
			roomform: "",
			name: "",
			room: 0,
			buzzed: false,
			locked: false,
			timer: null,
			buzzedPlayers: []
		}
	},
	mounted() {
		console.log(this.$route.params.room)
		if(this.$route.params.room !== '0'){
			this.roomform = this.$route.params.room;
		}
	},
	methods:{
		setNameAndRoom(){
			fetch('http://92.222.177.232:3000/player/'+this.roomform, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.nameform
				})
			})
				.then(response => {
					if (!response.ok) {
						//show an alert saying that the room doesn't exist or that the room is full
						this.$refs.alert.showAlert("Error","The room doesn't exist or is full\nTry changing the room code or your name");
					}
					else{
						response.json()
							.then(data => {
								console.log(data)
								this.name = data.name;
								this.room = data.roomID;
								this.$router.push("./player/" + this.room)
								this.timer = setInterval(this.refreshPlayers, 1000);
							});
					}
				});
		},
		buzz(){
			fetch('http://92.222.177.232:3000/player/'+this.room+'/buzz', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.name,
					room: this.room
				})
			})
				.then(response => {
					if (!response.ok) {
						//show an alert saying that there was an error
						this.$refs.alert.showAlert('Error','There was an error');
					}
					else{
						response.json()
							.then(data => {
								this.timer = setInterval(this.refreshBuzzed, 1000);
							});
					}
				});
		},
		refreshPlayers()  {
			fetch('http://92.222.177.232:3000/player/'+this.room)
				.then(response => {
					if (response.status === 404) {
						//show an alert saying that the room doesn't exist or that the room is full
						this.$refs.alert.showAlert('Error','The room doesn\'t exist or is full');
					}
					else {
						response.json()
							.then(data => {
								this.buzzedPlayers = data.filter(person => person.buzzed);
								for (let person of data) {
									if (person.name === this.name){
										this.buzzed=person.buzzed;
										this.locked=person.locked;
										this.BuzzerText = "Buzz";
										if (this.buzzed){
											this.BuzzerText = "Buzzed";
										}
										if (this.locked){
											this.BuzzerText = "Locked";
										}
									}
								}
							})
					}
				})
		}
	}

}

</script>

<style scoped>
.buzzed{
	background-color: #f44336 !important;
	cursor: not-allowed !important;
}
.locked{
	background-color: #c89f18 !important;
	cursor: not-allowed !important;
}

#buzz{
	background-color: #4CAF50;
	border: none;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	margin: 4px 2px;
	cursor: pointer;
}
.player-div{
	display: flex;
	align-items: center;
}

</style>