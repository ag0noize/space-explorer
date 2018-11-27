<template>
    <div>
        <div class="menu_btn">
            <div class="menu_btn_area" id="menu_btn_area" @click="handleMenu">
                <span class="menu_btn_piece"></span>
                <span class="menu_btn_piece"></span>
                <span class="menu_btn_piece"></span>
            </div>

            <span class="menu_btn_txt">Menu</span>
        </div>

        <transition name="modal" 
                    mode="out-in" 
                    @enter="enter" 
                    @leave="leave" 
                    :css="false">

            <div class="modal_overlay" 
                 v-if="menuShown" 
                 @click="handleMenu" 
                 ref="modal_overlay">
                
                <div class="modal_window menu_modal" ref="modal_window">
                    <div class="mw_header">
                        <div class="mw_title">Choose the planet</div>
                        <p>and discover a new world</p>
                    </div>
            
                    <div class="mw_body">
                        <ul class="planets_list">
                            <li v-for="planet in planets" 
                                class="planets_list_item" 
                                :class="[planet.name, planetActiveClass(planet.name)]" 
                                @click="handlePlanetClick(planet.name)">
                    
                                <div class="pli_icon"></div>
                                <div class="pli_title">
                                    <div class="pli_name">{{normalizePlanetTitle(planet.name)}}</div>
                                    <div class="pli_distance">{{planet.features.distance}} AU</div>
                                </div>
                                <span class="pli_bg"></span>
                            </li>
                        </ul>
                        
                        <div class="mw_lines mw_lines_left"></div>
                        <div class="mw_lines mw_lines_right"></div>
                    </div>
            
                    <div class="mw_footer">
                        <p>Astronomical unit (AU) - an average distance between Earth and the Sun</p>
                        
                        <div class="pf_switcher" 
                             :class="featuresActiveClass"  
                             @click="handlePlanetFeatures">
                            
                            <span class="pf_switcher_cb"></span> 
                            show planetary facts
                        </div>
                    </div>
                </div>

            </div>

        </transition>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {TweenMax, Power1} from 'gsap/TweenMax';

    let menuClickDelay = false,
        planetClickDelay = false;

    export default {
        updated(){
            this.activeModel = this.currentPlanet;
        }, 

        data(){
            return {
                menuShown: false,
                activeModel: '',
            }
        },

        computed: {
            ...mapGetters([
                'planets',
                'currentPlanet',
                'featuresStatus'
            ]),

            featuresActiveClass(){
                return this.featuresStatus ? 'active' : '';
            }
        },

        methods: {
            switchMenu(){
                this.menuShown = !this.menuShown;
            },

            normalizePlanetTitle(name){
                return name.split('_').join(' ');
            },

            planetActiveClass(name){
                return this.currentPlanet == name ? 'active' : '';
            },

            handlePlanetClick(name){
                if (!planetClickDelay){

                    planetClickDelay = true;

                    this.$store.commit('setActivePlanet', name);
                    this.changePFUnits();

                    setTimeout(()=>{
                        this.closeMenu();
                    }, 300);

                    setTimeout(()=>{
                        planetClickDelay = false;
                    }, 800);

                }
            },

            handleMenu(e){
                if (e.target.classList.contains('modal_overlay') || e.target.classList.contains('menu_btn_area')){
                    if (!menuClickDelay){
                        menuClickDelay = true;
    
                        let menuBtn = document.getElementById('menu_btn_area');
                        
                        this.switchMenu();
    
                        menuBtn.classList.toggle('active')
                        menuBtn.parentElement.classList.toggle('is_open');
    
                        if (!menuBtn.classList.contains('active')){
                            menuBtn.classList.add('closing');
                        } 
    
                        setTimeout(() => {
                            menuBtn.classList.remove('closing');
                            menuClickDelay = false;
                        }, 500);
                    }
                }
            },
            
            closeMenu(){
                let menuBtn = document.getElementById('menu_btn_area');
                
                this.switchMenu();
    
                menuBtn.classList.remove('active')
                menuBtn.parentElement.classList.remove('is_open');
                menuBtn.classList.add('closing');

                setTimeout(() => {
                    menuBtn.classList.remove('closing');
                }, 500);
            },

            handlePlanetFeatures(){
                this.$store.commit('switchPlanetFeatures');
            },

            changePFUnits(){
                let planetFeatures = document.getElementById('planet_features'),
                    currPlanet = this.$store.getters.currentPlanet;

                if (currPlanet == 'mercury' || currPlanet == 'venus'){
                    document.getElementById('day_units').textContent ='days';
                } else {
                    document.getElementById('day_units').textContent ='hours';
                }

                if (currPlanet == 'mercury' || currPlanet == 'venus' || currPlanet == 'earth' || currPlanet == 'mars'){
                    document.getElementById('year_units').textContent ='days';
                } else {
                    document.getElementById('year_units').textContent ='years';
                }
            },

            enter(el, done) {
                TweenMax.to(this.$refs['modal_overlay'], 0.2, {autoAlpha: 1, ease: Power1.easeOut});
                TweenMax.to(this.$refs['modal_window'], 0.2, {delay: 0.2, top: '0px', autoAlpha: 1, ease: Power1.easeOut});
                done();
            },

            leave(el, done){
                TweenMax.to(this.$refs['modal_window'], 0.2, {top: '-50px', autoAlpha: 0, ease: Power1.easeOut});
                TweenMax.to(this.$refs['modal_overlay'], 0.2, {delay: 0.2, autoAlpha: 0, ease: Power1.easeOut});
                
                setTimeout(()=>{
                    done();
                }, 600);
            }
        },

        watch: {
            activeModel(nevVal, oldVal){
                if (oldVal){          
                    window[oldVal].children.forEach(function(child){
                        if (child.type == 'Group'){
                            child.children.forEach(function(subchild){
                                TweenMax.to(subchild.material, 0.3, {opacity: 0, ease: Power1.easeOut});
                                TweenMax.set(subchild, {delay: 0.6, visible: false});
                            });
                        } else {
                            TweenMax.to(child.material, 0.3, {opacity: 0, ease: Power1.easeOut});
                            TweenMax.set(child, {delay: 0.6, visible: false});
                        }
                    });
                }

                window[nevVal].children.forEach(function(child){
                    if (child.type == 'Group'){
                        child.children.forEach(function(subchild){
                            TweenMax.to(subchild.material, 0.3, {delay: 0.6, opacity: 1, ease: Power1.easeOut});
                            TweenMax.set(subchild, {delay: 0.6, visible: true});
                        });
                    } else {
                        TweenMax.to(child.material, 0.3, {delay: 0.6, opacity: 1, ease: Power1.easeOut});
                        TweenMax.set(child, {delay: 0.6, visible: true});
                    }
                });
            }
        }
    }
</script>