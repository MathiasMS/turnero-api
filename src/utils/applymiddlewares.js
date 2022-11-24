export const applyMiddleware = (app, middlewareWrappers) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(app);
    }
};
