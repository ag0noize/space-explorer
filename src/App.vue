<template>

    <div id="app" class="app">

        <div class="loadscreen" id="loadscreen">
            <div class="mobile_notification">Sorry, but current version of the site is not working on mobile devices, try to explore from desktop.</div>

            <div class="loadscreen_title" id="loadscreen_title">Space Explorer</div>

            <div class="preloader" id="preloader">
                <div class="preloader_icon" id="preloader_icon"></div>
                <div class="preloader_text" id="preloader_text">0</div>
            </div>

            <div class="current_system" id="current_system">Object: Solar System</div>

            <button class="start_btn" id="start_btn">
                <span>Explore</span>
            </button>
        </div>

        <header>
          <div class="system_name">
            <span class="subtitle">Explore</span>
            Solar System <span class="system_icon"></span>
          </div>
        </header>

        <seMenu></seMenu>

        <div class="content">

            <planetTitles></planetTitles> 
            <planetFeatures></planetFeatures> 

            <div class="read_more_wrap">
                <div class="read_more"  @click="showSidebar">Read more</div>
            </div>
            
        </div>

        <seSidebar></seSidebar>

        <footer>
            <div class="footer_links">
                <a href="/" @click="showPatchNotes">v. {{appVersion}}</a>
                <span>|</span>
                <a href="/" @click="showAbout">about</a>
            </div>

            <p class="webmastering">designed and developed by <a href="http://max-kazakov.ru" target="_blank">Max Kazakov</a></p>
        </footer>

        <seModals></seModals>
        
    </div>

</template>


<script>
    import seMenu from './components/Menu';
    import planetTitles from './components/PlanetTitles';
    import planetFeatures from './components/PlanetFeatures';
    import seSidebar from './components/Sidebar';
    import seModals from './components/Modals';
    
    export default {
        name: 'app',
        components: {
            seMenu,
            planetTitles,
            planetFeatures,
            seSidebar,
            seModals
        },

        methods: {
            showAbout(e){
                e.preventDefault();
                this.$store.commit('showAbout');
            },

            showPatchNotes(e){
                e.preventDefault();
                this.$store.commit('showPatchNotes');
            },

            showSidebar(){
                this.$store.commit('showSidebar');
            }
        },

        computed: {
            appVersion(){
                return this.$store.getters.appVersion;
            }
        },

        created(){
            this.$store.dispatch('loadPlanetsCnt');

            // let three.js know initial planet

            window.initialPlanet = this.$store.getters.currentPlanet;
        },


    }
</script>
