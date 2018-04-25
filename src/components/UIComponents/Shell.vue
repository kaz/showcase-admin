<template>
  <pre v-html="rendered"></pre>
</template>
<script>
  import Convert from 'ansi-to-html'
  const converter = new Convert({escapeXML: true})

  export default {
    props: {
      value: String
    },
    computed: {
      rendered () {
        return converter.toHtml(this.value)
      }
    }
  }
</script>

<style scoped>
  pre {
    background-color: #000;
    color: #FFF;
  }
</style>
