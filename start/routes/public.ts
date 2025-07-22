import router from '@adonisjs/core/services/router';

router.on('/').renderInertia('public/home').as('home');
router.on('/events').renderInertia('public/events').as('events');
router.on('/event/:id').renderInertia('public/event', { id: ':id' }).as('event');
