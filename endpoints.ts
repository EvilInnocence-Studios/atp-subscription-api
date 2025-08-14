import { IApiConfig } from "../core/endpoints";
import { del, get, patch, post } from "../core/express/wrappers";
import { SubscriptionHandler } from "./handlers";

export const apiConfig:IApiConfig = {
    subscriptionPlans: {
        GET: get(SubscriptionHandler.getSubscriptionPlans),
        POST: post(SubscriptionHandler.createSubscriptionPlan),
        ":planId": {
            GET: get(SubscriptionHandler.getSubscriptionPlan),
            PATCH: patch(SubscriptionHandler.updateSubscriptionPlan),
            DELETE: del(SubscriptionHandler.removeSubscriptionPlan),
        },
    },
    user: {
        ":userId": {
            subscription: {
                POST: post(SubscriptionHandler.subscribe),
                DELETE: del(SubscriptionHandler.unsubscribe),
            }
        }
    },
}
