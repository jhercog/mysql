<template>
  <q-page class="q-pa-sm">

    <!-- <q-btn label="Home" to="/" outline rounded color="green-5" />
    <br>
    <div class="row bg-yellow q-pa-sm">BLAGDANI</div> -->
<div class="row justify-center q-pa-sm">
  <q-select outlined v-model="odabranaGodina"
  :options="godine"
  label="Godina"
  style="width: 150px; "/>

</div>


    <div class="q-pa-md" style="">
      <q-list
        v-for="(praznik, key) in getPraznici"
        :key="key"
        bordered class="rounded-borders, text-red">
        <q-item>
          <q-item-section top>
            <q-item-label><strong>{{ praznik.naziv }}</strong></q-item-label>
          </q-item-section>
          <q-item-section side top>
            <!-- <q-badge color="red" :label="getPraznik(key, odabranaGodina)" /> -->
            <!-- <q-item-label><strong>{{ getPraznik(key, odabranaGodina) }}</strong></q-item-label> -->
            <!-- <q-item-label><strong>{{ getPraznik(key, odabranaGodina).dan }}</strong></q-item-label> -->
            <q-item-label><strong>{{ getPraznik(key, odabranaGodina).datum }}.</strong></q-item-label>
            <q-item-label><strong>{{ getPraznik(key, odabranaGodina).dan }}</strong></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

  </q-page>
</template>
<style media="screen">
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }
</style>
<script>
import { date } from 'quasar'
import { groupBy } from 'lodash'
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'

 export default {
   data () {
     return {
       kategorije: null,
       kategorija: '',
       kat_index: null,
        molitvenik: null,
        value: null,
        showMolitva: false,
        molitvaID: null,
        datumUskrsa:'',
        odabranaGodina: 2020,
        godine: [
        '2020', '2021', '2022', '2023', '2024','2025', '2026', '2027', '2028', '2029'
      ]

      }
    },

   mounted () {
     // this.fetchMolitvenik()
   },
   computed: {
     ...mapGetters('main', ['getPraznici']),
   },
   created () {
       },
   methods: {


      getPraznik2 (val) {
          return this.getPraznici[val].datum
      },

      getPraznik (val1, val2) {
        let dat
        switch(val1) {
          case 'novaGodina':
            dat = this.getPraznici.novaGodina.datum
            break;
          case 'uskrs':
            dat = this.getUskrs(val2)
            break;
          case 'uskrsniPon':
            dat = date.formatDate(date.addToDate(this.datumUskrsa, { days: 1 }), 'D.M.')
            break;
          case 'tijelovo':
            dat = this.getTijelovo (val2)
            break;
          default:
            dat = this.getPraznici[val1].datum
      }


        const datum = dat.split('.');
        let d = datum[0]
        let m = datum[1]
        return {
          datum: dat + val2,
          dan: this.dayOfWeek(val2, m-1, d)
        }
        // return dat + val2 + ', ' + this.dayOfWeek(val2, m-1, d)
      },

      dayOfWeek(g, m, d){
        let newDate = new Date(g, m, d)
        let dan = date.getDayOfWeek(newDate) // `day` is 4
        let day
        // switch (new Date().getDay()) {
          switch (dan) {
           case 1:
             day = "ponedjeljak";
             break;
           case 2:
             day = "utorak";
             break;
           case 3:
              day = "srijeda";
             break;
           case 4:
             day = "četvrtak";
             break;
           case 5:
             day = "petak";
             break;
           case 6:
             day = "subota";
             break;
           case 7:
             day = "nedjelja";
         }
        return day
        // console.log('>>>>> dan datuma: ', day);
      },

      getUskrs (yr_v){
      //
      let dtm //As Long
      let a,b,c,d,e,f,m,X,Y
      // 'Godina za koju računamo datum Uskrsa podijelimo sa 19. Ostatak ove operacije nazovemo ‚A‘. Nakon toga podijelimo ovaj broj sa 4.
      // 'Ostatku damo ime ‚B‘. Na kraju podijelimo ovaj isti broj sa 7 i ostatku damo ime ‚C‘.
      // 'Za račun tačnog datuma moramo koristiti dvije konstante. Nazvaćemo ih ‚X‘ i ‚Y‘.
      // 'Njihova vrijednost je: Za godine između 1582. i 1699.: X=22 i Y=2 Za godine između 1699. i 1799.: X=23 i Y=3 Za godine između 1799. i 1899.: X=23 i Y=4
      // 'Za godine između 1899. i 2099.:
      X=24;
      Y=5;
      // 'Sada pomnožimo A sa 19, dodamo X i rezultat podijelimo sa 30. Ostatku ovog puta damo ime ‚D‘.
      // 'Na kraju računamo 2•B + 4•C + 6•D + Y i rezultat podijelimo sa 7. Ostatak nazovemo ‚E‘.
      // 'datum Uskrsa je sada:
      // '
      // '    (22 + D + E). mart ukoliko rezultat ne prelazi 31 ili
      // '    (D + E - 9). aprila uvijek kada je rezultat pozitivan.
      // '
      // 'Primjer:
      // '
      // 'datum Uskrsa za 2007. godinu računamo po sljedećem principu:
      // '
      // '    2007 / 19 = 105 i ostatak 12 (A)
      // a = yr_v Mod 19;
      a = yr_v % 19;
      // '    2007 / 4 = 501 i ostatak 3 (B)
      // b = yr_v Mod 4;
      b = yr_v % 4;
      // '    2007 / 7 = 286 i ostatak 5 (C)
      // c = yr_v Mod 7;
      c = yr_v % 7;
      // '
      // '    (19•12 + 24) / 30 = 8 i ostatak 12 (D)
      d = (a*19 + X) % 30;
      // '    (2•3 + 4•5 + 6•12 + 5) / 7 = 14 i ostatak 5 (E)
      e = (2*b + 4*c + 6*d + Y) % 7;
      f = 22+d+e;
      if (f > 31){
         	f = d+e-9
      		m=4
        }	else {
          m=3
        }

        dtm = f + "." + m + "."+ yr_v + "."

        let dtum = new Date(yr_v, m-1, f);
        this.datumUskrsa = yr_v +','+ m + ',' + f
        // console.log(dtm);
        // return dtm
        return date.formatDate(dtum, 'D.M.')


      // '
      // '    (22 + 12 + 5) = 39 (više od 31)
      // '
      // 'Znači, datum Uskrsa 2007. godine je:
      // '
      // '(12 + 5 - 9) = 8. april 2007. godine
      //
      //
      // End Sub

      },

      getDuhovi (yr_v) {
        // 49 dana nakon Uskrsa (50 uključujući dan Uskrsa)
        let duhovi = date.addToDate(this.datumUskrsa, { days: 49 })
        duhovi = date.formatDate(duhovi, 'D.M.YYYY.')
        return duhovi
      },

      getTrojstvo (yr_v) {
        // prva nedjelja nakon Duhova
        // let x,y
        // let danNakonDuhova = date.addToDate(this.datumUskrsa, { days: 50 })
        let duhovi = date.addToDate(this.datumUskrsa, { days: 49 })
        // console.log('duhovi: ', duhovi);
        let trojstvo = date.addToDate(duhovi, { days: 7 })
    // console.log('duhovi+1: ', danNakonDuhova);
        // let day
        trojstvo = date.formatDate(trojstvo, 'D.M.YYYY.')
        return trojstvo

      },

      getTijelovo (yr_v) {
        // 49 dana nakon Uskrsa (50 uključujući dan Uskrsa)
        let duhovi = date.addToDate(this.datumUskrsa, { days: 49 })
        // Trojstvo - prva nedjelja nakon Duhova
        let trojstvo = date.addToDate(duhovi, { days: 7 })
        // Tijelovo - prvi četvrtak nakon Trojstva
        let tijelovo = date.addToDate(trojstvo, { days: 4 })
        // console.log('Tijelovo: ', tijelovo);
        tijelovo = date.formatDate(tijelovo, 'D.M.')

        return tijelovo

        // prvi četvrtak nakon Trojstva
      //   // Dim tijelovo As Long
      //
      //   let tijelovo = DateTime.Add(getTrojstvo(yr_v),0,0,4)
      //   return tijelovo
      },
    },
 }
 </script>
