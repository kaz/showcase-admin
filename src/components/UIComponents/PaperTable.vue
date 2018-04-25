<template>
  <div>
    <div class="header">
      <slot name="header">
        <h4 class="title">{{title}}</h4>
        <p class="category">{{subTitle}}</p>
      </slot>
    </div>
    <div class="content table-responsive table-full-width">
      <table class="table table-striped">
        <thead>
          <th v-for="column in columns">{{column}}</th>
        </thead>
        <tbody>
          <tr v-for="row in data">
            <td v-for="item in row">
              <router-link v-if="item.routerLink" :to="item.routerLink" class="btn btn-primary" tag="button">
                <span v-if="item.icon" :class="item.icon"></span>
                {{item.value}}
              </router-link>
              <a v-else-if="item.link" :href="item.link" target="_blank">
                <span v-if="item.icon" :class="item.icon"></span>
                {{item.value}}
              </a>
              <span v-else :class="item.badge ? ['badge', item.badge] : ''">
                <span v-if="item.icon" :class="item.icon"></span>
                {{item.value}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      columns: Array,
      data: Array,
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''

      }
    }
  }

</script>
<style scoped>
  .btn {
    padding: 2px 1em;
  }
</style>
