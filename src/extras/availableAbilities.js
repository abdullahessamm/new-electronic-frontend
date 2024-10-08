export default {
    users: {
        index: 'users:index',
        create: 'users:create',
        update: 'users:update',
        delete: 'users:delete',
    }, //end of users

    imports: {
        index: 'imports:index',
        fullIndex: 'imports:index:full',
        create: 'imports:create',
        update: 'imports:update',
        delete: 'imports:delete',
    }, //end of imports

    exports: {
        index: 'exports:index',
        fullIndex: 'exports:index:full',
        create: 'exports:create',
        update: 'exports:update',
        delete: 'exports:delete',
    }, // end of exports

    sparePartsPermits: {
        index: 'sparePartsPermits:index',
        fullIndex: 'sparePartsPermits:index:full',
        create: 'sparePartsPermits:create',
        update: 'sparePartsPermits:update',
        delete: 'sparePartsPermits:delete',
    },

    // employees
    employees: {
        index: 'employees:index',
        create: 'employees:create',
        update: 'employees:update',
        delete: 'employees:delete',
    },

    // monthly reporting incentives
    monthlyReportingIncentives: {
        index: 'MonthlyReportingIncentives:index',
        create: 'MonthlyReportingIncentives:create',
        update: 'MonthlyReportingIncentives:update',
        delete: 'MonthlyReportingIncentives:delete',
    },

    statistics: {
        show: 'statistics:show'
    }, // end of statistics
}