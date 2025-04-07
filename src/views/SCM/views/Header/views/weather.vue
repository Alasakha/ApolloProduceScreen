<script setup>
import { ref, reactive, computed, watch } from 'vue';


var xhr = new XMLHttpRequest;
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					console.log(xhr.responseText)
				}
			}
			xhr.open('get','https://devapi.qweather.com/v7/weather/now?location=101210906&key=ddd82c98b5e94ee08c1e66363d9ce332',true)
			xhr.send()

 
</script>

<template>
<div class="text-white">weather</div>
</template>

<style scoped>

</style>