/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

import './routes/auth.js';
import './routes/admin.js';

router.on('/').renderInertia('home').as('home');
