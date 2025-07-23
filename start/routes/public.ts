import router from '@adonisjs/core/services/router';

const PublicEventsController = () => import('#controllers/public/events-controller');
const PublicArtistsController = () => import('#controllers/public/artists-controller');

router.on('/').renderInertia('public/home').as('home');
router.get('/events', [PublicEventsController, 'render']).as('events');
router.on('/event/:id').renderInertia('public/event', { id: ':id' }).as('event');
router.get('/artists', [PublicArtistsController, 'render']).as('artists');
