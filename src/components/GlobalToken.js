import Cookies from 'js-cookie'
import router from '../router'
/**
 * global befored token验证导航守卫：检测请求地址和本地Cookie是否包含token
 */
export function checkToken() {
    try {
        router.beforeEach((to, from, next) => {
            // 忽略根路径与start路径
            if (to.path === '/' || to.path === '/start' || to.path === '/register') {
                next();
            } else {
                // 获取本地cookie中的token字段
                const token = Cookies.get('token')
                //考虑两种情况：“token存在且合法”和“请求地址”
                // token不存在，未登录，跳转登录
                if (!token && to.path !== '/login') {
                    window.alert("登录信息失效，请重新登录");
                    console.warn("登录信息失效，请重新登录");
                    next({ path: '/login' })
                } else if (token && to.path === '/login') {
                    // token存在，说明已登陆，跳转主页
                    // runtime exception:导航守卫中重定向

                     // 已登录且访问登录页，直接跳转到用户首页或管理员首页
                    const userType = Cookies.get('userType');
                    if (userType === 'admin') {
                        next({ path: '/admin' });
                    } else {
                        next({ path: '/user' });
                    }
                } else {
                    // 其他正常跳转
                    next()
                }
            }
        })
    } catch (e) {
        console.error(e)
    }
}