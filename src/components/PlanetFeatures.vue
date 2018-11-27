<template>

    <div class="planet_features" 
         :class="[featureBlockSize, showFeatures]" 
         id="planet_features" 
         v-if="dataReady">

        <div class="pf_side pf_left">
            <div class="planet_feature">
                <p class="pf_val">
                    <span id="density">{{animatedDensity}}</span> 
                    <span class="pf_units">g/cm<sup>3</sup></span>
                </p>
                <p class="pf_name">Density</p>
            </div>

            <div class="planet_feature">
                <p class="pf_val">
                    <span id="mass">{{animatedMass}}</span> 
                    <span class="pf_units">Earth mass</span>
                </p>
                <p class="pf_name">Mass</p>
            </div>

            <div class="planet_feature">
                <p class="pf_val">
                    <span id="type">{{type}}</span> 
                </p>
                <p class="pf_name">Type</p>
            </div>
        </div>
        

        <div class="pf_side pf_right">
            <div class="planet_feature">
                <p class="pf_val">
                    <span id="day">{{animatedDay}}</span> 
                    <span class="pf_units">Earth <span id="day_units">days</span></span>
                </p>
                <p class="pf_name">Day</p>
            </div>

            <div class="planet_feature">
                <p class="pf_val">
                    <span id="year">{{animatedYear}}</span> 
                    <span class="pf_units">Earth <span id="year_units">days</span></span>
                </p>
                <p class="pf_name">Year</p>
            </div>

            <div class="planet_feature">
                <p class="pf_val">
                    <span id="radius">{{animatedRadius}}</span> 
                    <span class="pf_units">km</span>
                </p>
                <p class="pf_name">Radius</p>
            </div>
        </div>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex';
    import {TweenMax, Power1} from 'gsap/TweenMax';

    function beautifyNumber(val, float){
        return parseFloat(val.toFixed(float));
    }

    export default {
        updated(){
            let features = this.$store.getters.planetFeatures;

            this.density = features.density;
            this.mass = features.mass;
            this.type = features.type;
            this.day = features.day;
            this.year = features.year;
            this.radius = features.radius;  
        }, 
        
        data(){
            return {
                density: 0,
                mass: 0,
                type: '',
                day: 0,
                year: 0,
                radius: 0,
                
                aDensity: 0,
                aMass: 0,
                aDay: 0,
                aYear: 0,
                aRadius: 0
            }
        },

        computed: {
            ...mapGetters([
                'dataReady',
                'currentPlanet',
                'featuresStatus'
            ]),

            animatedDensity(){
                return beautifyNumber(this.aDensity, 1);
            },

            animatedMass(){
                return beautifyNumber(this.aMass, 3);
            },

            animatedDay(){
                return beautifyNumber(this.aDay, 1);
            },

            animatedYear(){
                return beautifyNumber(this.aYear, 1);
            },

            animatedRadius(){
                return beautifyNumber(this.aRadius, 0);
            },

            showFeatures(){
                return this.featuresStatus ? 'visible' : '';
            },

            featureBlockSize(){
                let cp = this.currentPlanet;

                if (cp == 'mercury' || cp == 'pluto'){
                    return 'small';
                } else if (cp == 'venus' || cp == 'earth' || cp == 'mars'){
                    return 'medium';
                } else {
                   return 'large';
                }
            }
        },

        watch: {
            density(newVal, oldVal) {
                TweenMax.to(this.$data, 0.5, {aDensity: newVal});
            },
            mass(newVal, oldVal) {
                TweenMax.to(this.$data, 0.5, {aMass: newVal});
            },
            day(newVal, oldVal) {
                TweenMax.to(this.$data, 0.5, {aDay: newVal});
            },
            year(newVal, oldVal) {
                TweenMax.to(this.$data, 0.5, {aYear: newVal});
            },
            radius(newVal, oldVal) {
                TweenMax.to(this.$data, 0.5, {aRadius: newVal});
            }
        }
    }
</script>