import router from '@adonisjs/core/services/router';

const EventsController = () => import('#controllers/public/events_controller');
const ArtistsController = () => import('#controllers/public/artists_controller');

router.on('/').renderInertia('public/home').as('home');
router.get('/events', [EventsController, 'index']).as('events');
router.on('/event/:id').renderInertia('public/event', { id: ':id' }).as('event');
router.get('/artists', [ArtistsController, 'index']).as('artists');
