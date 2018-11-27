<template>
    <transition name="modal" 
                mode="out-in" 
                @enter="enter" 
                @leave="leave" 
                :css="false">

        <div class="modal_overlay"  
             v-if="aboutStatus || patchNotesStatus" 
             @click="closeModal" 
             ref="modal_overlay">

            <div class="modal_window content_modal" ref="modal_window">
                <div class="mw_header">
                    <div class="mw_close" @click="closeModal">
                        <span class="mw_close_text">close</span>
                    </div>
                    
                    <div class="mw_title" v-if="aboutStatus">About this site</div>
                    <div class="mw_title" v-if="patchNotesStatus">What's new?</div>
                </div>
        
                <div class="mw_body" v-if="aboutStatus">
                    <p>Thank you for visiting the very first version of <strong>Space Explorer!</strong></p>

                    <p><strong>Space Explorer</strong> is the result of space enthusiast's small idea to combine and practice some modern web technologies. Hope that this site will also be useful to other people who share my love to space and uncharted worlds beyound our own planet.</p>
                
                    <p>This site has been designed and built by me from the ground up and based on <a href="https://www.nasa.gov" target="_blank">NASA</a> data. It's handled through <strong>Vue.js, Three.js</strong> and animated with <strong>CSS</strong> and <strong>GreenSock Animation Platform.</strong> Colors and shades of the textures are tuned according  to true-color photos.</p>
                
                    <p>In the future I'll constantly update and expand <strong>Space Explorer</strong> data and functionality, so if you have any idea or suggestion how to make it better - please let me know what you think by sending me a message via my personal website.</p>
                
                    <p>Special thanks to:</p>

                    <p><a href="https://twitter.com/jamiecoulter89" target="_blank">Jamie Coulter</a> - for inspiration and some text content.</p>
                    <p><a href="https://www.deviantart.com/alpha-element" target="_blank">Alpha-Element</a> - for amazing planet pictures.</p>
                </div>


                <div class="mw_body" v-if="patchNotesStatus">
                    <p>Added in version 1.1:</p>
                    <ul>
                        <li>9 planets with actual axis and relative rotation speed and direction;</li>
                        <li>Planet description with images and videos (information was taken from <a href="https://solarsystem.nasa.gov/planets/overview/" target="_blank">NASA</a> website with some changes and additions);</li>
                    </ul>

                    <p>Will be added in future releases:</p>
                    <ul>
                        <li>The Sun and asteroid belt;</li>
                        <li>Common information about Solar System;</li>
                        <li>Major moons of Solar System planets;</li>
                        <li>Trappist-1 system and its planets;</li>
                        <li>Version for mobile devices;</li>
                    </ul>
                </div>
        
                <div class="mw_footer"></div>
            </div>
        </div>

    </transition>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {TweenMax, Power1} from 'gsap/TweenMax';

    export default {
        computed: {
            ...mapGetters([
                'aboutStatus',
                'patchNotesStatus'
            ])
        },

        methods: {
            closeModal(e){
                if (e.target.classList.contains('modal_overlay') || e.target.classList.contains('mw_close')){
                    this.$store.commit('closeModals');
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
        }
    }
</script>