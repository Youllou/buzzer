<template>
<!-- a page with two buttons one to host a room the other to join a room-->
  <div id="entry">
    <a class="btn" @click="changePage('host')">Host</a>
	  <br>
    <a class="btn" @click="changePage('player')">Join</a>
  </div>
</template>

<script>
export default {
	name: "Entry",
	methods: {
		changePage(page) {
			this.$router.push({ name: page , params: { room: 0 } });
		}
	}
}
</script>


<style scoped>
.btn{
	margin:3%;
}
</style>