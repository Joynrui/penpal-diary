import Vue from "vue";
import VueRouter from "vue-router";
import NormalUserLayout from "../views/layout/NormalUserLayout";
import AdminUserLayout from "../views/layout/AdminUserLayout";
import DiaryEdit from "../views/diary-edit/DiaryEdit"
import DiaryList from "../views/diary-list/DiaryList"
import AccountInfo from "../views/account-info/AccountInfo"
import FeedBack from "../views/feedback/Feedback"
import SecretSpot from "../views/secretspot/SecretSpot"
import AdminAccountInfo from "../views/admin-account-info/AdminAccountInfo"
import FeedbackHandle from "../views/feedback-handle/FeedbackHandle"
import NormalUserManage from "../views/normal-user-manage/NormalUserManage"
import ContentInvestigate from "../views/content-investigate/ContentInvestigate"
import MonitorLog from "../views/monitor-log/MonitorLog"
import Match from "../views/match/Match"
import Start from "../views/start/Start"
Vue.use(VueRouter)

const routes = [
    // 添加重定向规则，将根路径重定向到 /start
    { path: "/", redirect: "/start" },
    // 添加 /start 路由
    { path: "/start", component: Start },
    // 普通用户路由
    {
        path: "/user",
        component: NormalUserLayout,
        redirect: "/diary-list",
        children: [
            { path: "/diary-edit", component: DiaryEdit },
            { path: "/diary-list", component: DiaryList },
            { path: "/account-info", component: AccountInfo },
            { path: "/feedback", component: FeedBack },
            { path: "/secretspot", component: SecretSpot },
            { path: "/match", component: Match },
        ]
    },
    // 管理员路由
    {
        path: "/admin",
        component: AdminUserLayout,
        children: [
            { path: "/admin-account-info", component: AdminAccountInfo },
            { path: "/feedback-handle", component: FeedbackHandle },
            { path: "/normal-user-manage", component: NormalUserManage },
            { path: "/content-investigate", component: ContentInvestigate },
            { path: "/monitor-log", component: MonitorLog },
        ]
    },



    {
        path: "/login",
        component: () => import("../views/login/Login")
    },
    // 添加 /register 路由
    {
        path: "/register",
        component: () => import("../views/register/Register")
    },

]

const router = new VueRouter({
    routes
})
export default router