<template>
  <q-page class="q-pa-sm">
    <q-avatar
      :color="getIsOnline ? 'green' : 'red-5'"
      text-color="primary"
      size="sm"
      rounded
      :icon="getIsOnline ? 'signal_wifi_4_bar' : 'signal_wifi_off'"
    >
      <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
        {{ 'Harvey is ' + (getIsOnline ? 'online' : 'offline') }}
      </q-tooltip>
    </q-avatar>

    <div class="row bg-yellow">
      KALENDAR
    </div>
    <div v-for="(mjesec, index) in mjeseci" :key="'id_' + index">
            {{ index }}. mjesec
            <div v-for="dan in mjesec" :key="dan.id">
                    {{ dan.d }} {{ dan.sveci }}
            </div>
    </div>
  </q-page>
</template>
<script>
import { groupBy } from 'lodash'
import axios from 'axios'
// import offline from 'v-offline';
import { mapGetters } from 'vuex'

 export default {
   data () {
     return {
        mjeseci: null,
        // onlineStatus: null,
        // onlineSlot: 'online',
        // offlineSlot: 'offline'
}
   },
   mounted () {
     // this.fetchKalendar()
   },
   computed: {
     ...mapGetters('main', ['getIsOnline'])
   },
   // components: {
   //   offline
   // },
   methods: {
     amIOnline (e) {
       this.onlineStatus = e
       this.$store.commit('main/setOnlineStatus', e)
     },
     fetchKalendar () {

       console.log(this.$store.isOnline);
       var qry = "SELECT * FROM KatKalendar"
       var formdata = new FormData();
       formdata.append ('upit', 'kalendar');
       this.$axios.post('http://vitkadesign.com/katkalTest.php', formdata)
         .then((response) => {
           this.$q.localStorage.set("kalendar", response.data)
           let value = this.$q.localStorage.getItem('kalendar')
           this.mjeseci = groupBy(response.data, dan => dan.m)
           console.log(this.mjeseci);
         })
         .catch(error => {
            console.error(error)
          })
     },
     fetchKalendarOffline () {
          this.mjeseci = groupBy(this.$q.localStorage.getItem('kalendar'), dan => dan.m)
          console.log('...........OFFLINE');
     },
     fetchKalendarOfflineX () {
          this.mjeseci = groupBy(this.$q.localStorage.getItem('kalendar'), dan => dan.m)
          console.log('...........ONLINE');
     },
     amIOnline(status) {
       this.onlineStatus = status
       this.$store.commit('main/setOnlineStatus', status)
       if(status){
         // fetchKalendarONLINE
         console.log('------tu saaam--ONLINE--');
       }else{
         // this.fetchKalendarOffline()
         console.log('------tu saaam---OFFLINE-');
       }
        console.log('NET status: ',status);
      }
   }
 }
</script>
