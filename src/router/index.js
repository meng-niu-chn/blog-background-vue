import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/articlepub',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Articlepub',
        component: () => import('@/views/article/articlepub'),
        meta: { title: '文章发布', icon: 'form' }
      }
    ]
  },

  {
    path: '/articleedit',
    component: Layout,
    children: [
      {
        path: ':id',
        name: 'Articleedit',
        component: () => import('@/views/article/articlepub'),
        hidden: true,
        meta: { title: '文章发布', icon: 'form' }
      }
    ]
  },

  {
    path: '/articlemng',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Articlemng',
        component: () => import('@/views/article/articlemng'),
        meta: { title: '文章管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Category',
        component: () => import('@/views/category/category'),
        meta: { title: '菜单管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/links',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Links',
        component: () => import('@/views/link/links'),
        meta: { title: '友链管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/user'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/setting/setting'),
        meta: { title: '全局设置', icon: 'form',roles: ['admin'], }
      }
    ]
  },

  {
    path: '/authority',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Authority',
        component: () => import('@/views/authority/authority'),
        meta: { title: '权限管理', icon: 'form',roles: ['admin'], }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
