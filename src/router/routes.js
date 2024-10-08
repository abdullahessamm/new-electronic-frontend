import { useAuthStore } from '../stores/auth';

export default [
    // home
    {
        path: '/',
        name: 'home',
        component: () => import('../pages/HomePage.vue'),
    }, // end of home
    // statistics
    {
        path: '/statistics',
        name: 'statistics',
        component: () => import('../pages/StatisticsPage.vue')
    }, // end of statistics
    // users
    {
        path: '/users',
        name: 'users',
        component: () => import('../pages/users/UsersIndexPage.vue'),
        children: [
            {
                path: 'show/:id',
                name: 'users.userShow',
                component: () => import('../pages/users/UserShowPage.vue')
            },
            {
                path: 'add',
                name: 'users.add',
                component: () => import('../pages/users/UserAddPage.vue')
            },
        ],
    }, // end of users
    // Spare parts permits
    {
        path: '/sparePartsPermits',
        name: 'sparePartsPermits',
        component: () => import('../pages/SparePartsPermitsPage.vue')
    }, // end of Spare parts permits
    // imports
    {
        path: '/imports',
        name: 'imports',
        component: () => import('../pages/ImportsPage.vue')
    }, // end of imports
    // exports
    {
        path: '/exports',
        name: 'exports',
        component: () => import('../pages/ExportsPage.vue')
    }, // end of exports
    // employees
    {
        path: '/employees',
        name: 'employees.index',
        component: () => import('../pages/employees/IndexPage.vue'),
        children: [
            {
                path: 'add',
                name: 'employees.add',
                component: () => import('../pages/employees/AddPage.vue')
            },
            {
                path: ':id',
                name: 'employees.show',
                component: () => import('../pages/employees/EmpPage.vue')
            },
        ]
    },
    // end of employees
    // Monthly Reporting Incentive
    {
        path: '/monthly-reporting-incentive',
        name: 'monthlyReportingIncentives',
        component: () => import('../pages/MonthlyReportingIncentivePage.vue'),
    },
    // End of Monthly Reporting Incentive
    // settings
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../pages/SettingsPage.vue')
    }, // end of settings
];