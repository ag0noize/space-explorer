<template>
    <div class="planet_title">
        <span>planet</span>
        <div class="planet_name">

            <transition name="planet_name" mode="out-in"> 
                <span :key="currentPlanet">{{normalizedPlanetTitle}}</span>
            </transition>

        </div>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'currentPlanet',
            ]),

            normalizedPlanetTitle(){
                return this.currentPlanet.split('_').join(' ');
            }
        }
    }
</script>
