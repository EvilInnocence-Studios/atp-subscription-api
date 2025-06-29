import { IApiConfig } from "../core/endpoints";
import { get } from "../core/express/wrappers";
import { SubscriptionHandler } from "./handlers";

export const apiConfig:IApiConfig = {
    subscriptionPlans: {
        GET: get(SubscriptionHandler.getSubscriptionPlans),
        POST: get(SubscriptionHandler.createSubscriptionPlan),
        ":planId": {
            PATCH: get(SubscriptionHandler.updateSubscriptionPlan),
            DELETE: get(SubscriptionHandler.removeSubscriptionPlan),
        },
    }
}
