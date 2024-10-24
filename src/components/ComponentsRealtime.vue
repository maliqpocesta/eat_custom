<template>
  <div style="display:none;"></div>
</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { loadScript, unloadScript } from 'vue-plugin-load-script'

export default {
  name: 'ComponentsRealtime',
  props: ['getevent'],
  mounted () {
    this.getRealtime()
  },
  data () {
    return {
      data: [],
      pusher: undefined,
      channel: undefined
    }
  },
  methods: {
    getRealtime () {
      APIinterface.getRealtime(this.getevent)
        .then(data => {
          this.data = data.details
          this.initProvider()
        })
        // eslint-disable-next-line
        .catch(error => {
          // APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          //
        })
    },
    initProvider () {
      switch (this.data.realtime_provider) {
        case 'pusher':
          loadScript('https://js.pusher.com/7.0/pusher.min.js')
            .then(() => {
              this.initPusher()
            })
            .catch(() => {
              console.debug('failed loading realtime script')
            })
          break
      }
    },
    initPusher () {
      /* eslint-disable */
      Pusher.logToConsole = false
      /* eslint-disable */
      this.pusher = new Pusher(this.data.pusher_key, {
        cluster: this.data.pusher_cluster
      })
      this.channel = this.pusher.subscribe( this.data.channel  );
      this.channel.bind( this.data.event , (data)=> {
          this.$emit('afterReceive', data )
      });
    }
  }
}
</script>
