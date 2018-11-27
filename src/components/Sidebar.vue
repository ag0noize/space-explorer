<template>
    <div class="sidebar_wrap" :class="sidebarActiveClass" v-if="dataReady">

        <div class="sidebar_overlay" @click="closeSidebar"></div>
        
        <div class="sidebar">
            <div class="sidebar_head">
                <div class="sidebar_bg" :style="{backgroundImage: 'url(' + planetHeadBg + ')'}"></div>
                
                <div class="sidebar_close_btn" @click="closeSidebar">
                    <span>close</span>
                </div>

                <div class="sidebar_title">{{planetName}}</div>
            </div>
        
            <simplebar class="sidebar_body" data-simplebar-auto-hide="false">
                <div class="sidebar_body_cnt" v-html="planetCnt"></div>
            </simplebar>
        </div>

    </div>
</template>


<script>
    import {mapGetters} from 'vuex';
    import simplebar from 'simplebar-vue';
    import 'simplebar/dist/simplebar.min.css';

    export default {
        components: {
          simplebar
        },
        computed: {
            ...mapGetters([
                'dataReady',
                'planetName',
                'planetContent',
                'sidebarStatus'
            ]),

            planetHeadBg(){
                return this.planetContent.headbg;
            },

            planetCnt(){
                return this.planetContent.description;
            },

            sidebarActiveClass(){
                return this.sidebarStatus ? 'opened' : '';
            }
        },

        methods: {
            closeSidebar(){
                this.$store.commit('closeSidebar');
            }
        }
    }
</script>