import router from '@adonisjs/core/services/router';

import { middleware } from '../kernel.js';

const DashboardController = () => import('#controllers/admin/dashboard-controller');

router
	.group(() => {
		router
			.get('/', [DashboardController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.dashboard.view' }))
			.as('dashboard.render');
	})
	.prefix('admin')
	.as('admin')
	.middleware(middleware.auth());
