export declare global {

    type appConfType = {
        PROJECT_LIST: {
            front: string[],
            service: string[],
        };
    };

    interface Window {
        APP_CONF: appConfType;
    }
}
