import { HttpContext } from '@adonisjs/core/http';
import { Logger } from '@adonisjs/core/logger';
import type { NextFn } from '@adonisjs/core/types/http';

/**
 * The container bindings middleware binds classes to their request
 * specific value using the container resolver.
 *
 * - We bind "HttpContext" class to the "ctx" object
 * - And bind "Logger" class to the "ctx.logger" object
 */
export default class ContainerBindingsMiddleware {
	handle(context: HttpContext, next: NextFn) {
		context.containerResolver.bindValue(HttpContext, context);
		context.containerResolver.bindValue(Logger, context.logger);

		return next() as unknown;
	}
}
