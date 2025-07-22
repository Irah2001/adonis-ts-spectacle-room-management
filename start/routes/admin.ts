import router from '@adonisjs/core/services/router';

import { middleware } from '../kernel.js';

const DashboardController = () => import('#controllers/admin/dashboard-controller');
const ArtistsController = () => import('#controllers/admin/artists-controller');
const EmployeesController = () => import('#controllers/admin/employees-controller');
const RoomsController = () => import('#controllers/admin/rooms-controller');
const TicketsController = () => import('#controllers/admin/tickets-controller');
const BookingsController = () => import('#controllers/admin/bookings-controller');
const InvoicesController = () => import('#controllers/admin/invoices-controller');

router
	.group(() => {
		router
			.get('/', [DashboardController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.dashboard.view' }))
			.as('dashboard.render');
		router
			.get('/artists', [ArtistsController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.artists.view' }))
			.as('artists.render');
		router
			.put('/artists', [ArtistsController, 'create'])
			.middleware(middleware.acl({ permission: 'admin.artists.create' }))
			.as('artists.create');
		router
			.patch('/artists/:id', [ArtistsController, 'update'])
			.middleware(middleware.acl({ permission: 'admin.artists.update' }))
			.as('artists.update');
		router
			.delete('/artists/:id', [ArtistsController, 'delete'])
			.middleware(middleware.acl({ permission: 'admin.artists.delete' }))
			.as('artists.delete');

		router
			.group(() => {
				router
					.get('/', [EmployeesController, 'render'])
					.middleware(middleware.acl({ permission: 'admin.employees.view' }))
					.as('render');
				router
					.put('/', [EmployeesController, 'create'])
					.middleware(middleware.acl({ permission: 'admin.employees.create' }))
					.as('create');
				router
					.patch('/:id', [EmployeesController, 'update'])
					.middleware(middleware.acl({ permission: 'admin.employees.update' }))
					.as('update');
			})
			.prefix('employees')
			.as('employees');

		router
			.group(() => {
				router
					.get('/', [RoomsController, 'render'])
					.middleware(middleware.acl({ permission: 'admin.rooms.view' }))
					.as('render');
				router
					.put('/', [RoomsController, 'create'])
					.middleware(middleware.acl({ permission: 'admin.rooms.create' }))
					.as('create');
				router
					.patch('/:id', [RoomsController, 'update'])
					.middleware(middleware.acl({ permission: 'admin.rooms.update' }))
					.as('update');
				router
					.delete('/:id', [RoomsController, 'delete'])
					.middleware(middleware.acl({ permission: 'admin.rooms.delete' }))
					.as('delete');
			})
			.prefix('rooms')
			.as('rooms');

		router
			.get('/tickets', [TicketsController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.tickets.view' }))
			.as('tickets.render');
		router
			.get('/bookings', [BookingsController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.bookings.view' }))
			.as('bookings.render');
		router
			.get('/invoices', [InvoicesController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.invoices.view' }))
			.as('invoices.render');
	})
	.prefix('admin')
	.as('admin')
	.middleware(middleware.auth());
