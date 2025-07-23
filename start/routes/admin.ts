import router from '@adonisjs/core/services/router';

import { middleware } from '../kernel.js';

const AdminDashboardController = () => import('#controllers/admin/dashboard-controller');
const AdminArtistsController = () => import('#controllers/admin/artists-controller');
const AdminEmployeesController = () => import('#controllers/admin/employees-controller');
const AdminRoomsController = () => import('#controllers/admin/rooms-controller');
const AdminTicketsController = () => import('#controllers/admin/tickets-controller');
const AdminBookingsController = () => import('#controllers/admin/bookings-controller');
const AdminInvoicesController = () => import('#controllers/admin/invoices-controller');
const AdminEventsController = () => import('#controllers/admin/events-controller');

router
	.group(() => {
		router
			.get('/', [AdminDashboardController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.dashboard.view' }))
			.as('dashboard.render');

		router
			.group(() => {
				router
					.get('/', [AdminArtistsController, 'render'])
					.middleware(middleware.acl({ permission: 'admin.artists.view' }))
					.as('render');
				router
					.put('/', [AdminArtistsController, 'create'])
					.middleware(middleware.acl({ permission: 'admin.artists.create' }))
					.as('create');
				router
					.patch('/:id', [AdminArtistsController, 'update'])
					.middleware(middleware.acl({ permission: 'admin.artists.update' }))
					.as('update');
				router
					.delete('/:id', [AdminArtistsController, 'delete'])
					.middleware(middleware.acl({ permission: 'admin.artists.delete' }))
					.as('delete');
			})
			.prefix('artists')
			.as('artists');

		router
			.group(() => {
				router
					.get('/', [AdminEventsController, 'render'])
					.middleware(middleware.acl({ permission: 'admin.events.view' }))
					.as('render');
				router
					.put('/', [AdminEventsController, 'create'])
					.middleware(middleware.acl({ permission: 'admin.events.create' }))
					.as('create');
				router
					.patch('/:id', [AdminEventsController, 'update'])
					.middleware(middleware.acl({ permission: 'admin.events.update' }))
					.as('update');
				router
					.delete('/:id', [AdminEventsController, 'delete'])
					.middleware(middleware.acl({ permission: 'admin.events.delete' }))
					.as('delete');
			})
			.prefix('events')
			.as('events');

		router
			.group(() => {
				router
					.get('/', [AdminEmployeesController, 'render'])
					.middleware(middleware.acl({ permission: 'admin.employees.view' }))
					.as('render');
				router
					.put('/', [AdminEmployeesController, 'create'])
					.middleware(middleware.acl({ permission: 'admin.employees.create' }))
					.as('create');
				router
					.patch('/:id', [AdminEmployeesController, 'update'])
					.middleware(middleware.acl({ permission: 'admin.employees.update' }))
					.as('update');
			})
			.prefix('employees')
			.as('employees');

		router
			.group(() => {
				router
					.get('/', [AdminRoomsController, 'render'])
					.middleware(middleware.acl({ permission: 'admin.rooms.view' }))
					.as('render');
				router
					.put('/', [AdminRoomsController, 'create'])
					.middleware(middleware.acl({ permission: 'admin.rooms.create' }))
					.as('create');
				router
					.patch('/:id', [AdminRoomsController, 'update'])
					.middleware(middleware.acl({ permission: 'admin.rooms.update' }))
					.as('update');
				router
					.delete('/:id', [AdminRoomsController, 'delete'])
					.middleware(middleware.acl({ permission: 'admin.rooms.delete' }))
					.as('delete');
			})
			.prefix('rooms')
			.as('rooms');

		router
			.get('/tickets', [AdminTicketsController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.tickets.view' }))
			.as('tickets.render');
		router
			.get('/bookings', [AdminBookingsController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.bookings.view' }))
			.as('bookings.render');
		router
			.get('/invoices', [AdminInvoicesController, 'render'])
			.middleware(middleware.acl({ permission: 'admin.invoices.view' }))
			.as('invoices.render');
	})
	.prefix('admin')
	.as('admin')
	.middleware(middleware.auth());
