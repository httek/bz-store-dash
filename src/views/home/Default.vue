<template>
  <h1>Default Home</h1>
</template>

<script lang="ts">

import http from "../../utils/http";

http.get('https://httpbin.org/ip').then(res => console.log(res))

</script>
