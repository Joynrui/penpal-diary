import Vue from "vue";
import VueRouter from "vue-router";
import MainUserLayout from "../views/layout/MainUserLayout"
import Diary from "../views/diary/Diary"
import Match from "../views/match/Match"
import SecretSpot from "../views/secretspot/SecretSpot"
import Start from "../views/start/Start"
Vue.use(VueRouter)

const routes = [
    {
        path: "/Main",
        component: MainUserLayout,
        redirect: "/diary",
        children: [
            { path: "/diary", component: Diary },
            { path: "/match", component: Match },
            { path: "/secretspot", component: SecretSpot },
        ]
    },
    // 添加重定向规则，将根路径重定向到 /start
    { path: "/", redirect: "/start" },
    // 添加 /start 路由
    { path: "/start", component: Start },
]

const router = new VueRouter({
    routes
})
export default router