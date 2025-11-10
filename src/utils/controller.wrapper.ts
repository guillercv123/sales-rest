import {Request, Response, NextFunction, RequestHandler} from 'express';

export class ControllerWrapper {
    static wrap<T>(
        controller: T,
        method: keyof T
    ): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const fn = controller[method] as any;
                if (typeof fn === 'function') {
                    await fn.call(controller, req, res, next);
                }
            } catch (error) {
                next(error);
            }
        };
    }
}