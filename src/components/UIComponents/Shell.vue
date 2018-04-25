<template>
  <pre v-html="rendered"></pre>
</template>
<script>
  import Convert from 'ansi-to-html'
  import DOMPurify from 'dompurify'

  const converter = new Convert()

  export default {
    props: {
      value: String
    },
    computed: {
      rendered () {
        return DOMPurify.sanitize(converter.toHtml(this.value))
      }
    }
  }
</script>
