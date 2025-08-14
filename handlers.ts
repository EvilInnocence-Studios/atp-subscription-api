import { pipeTo } from "ts-functional";
import { getBody, getBodyParam, getParam } from "../core/express/extractors";
import { HandlerArgs } from "../core/express/types";
import { ISubscriptionPlan, NewSubscriptionPlan } from "../subscription-shared/types";
import { CheckPermissions } from "../uac/permission/util";
import { SubscriptionPlan } from "./services";
import { IUser } from "../uac-shared/user/types";

class SubscriptionHandlerClass {
    @CheckPermissions("subscription.create")
    public createSubscriptionPlan(...args: HandlerArgs<NewSubscriptionPlan>): Promise<ISubscriptionPlan> {
        return SubscriptionPlan.create(getBody(args));
    }

    @CheckPermissions("subscription.view")
    public getSubscriptionPlans(...args: HandlerArgs<undefined>): Promise<ISubscriptionPlan[]> {
        return SubscriptionPlan.search();
    }

    @CheckPermissions("subscription.view")
    public getSubscriptionPlan(...args: HandlerArgs<undefined>): Promise<ISubscriptionPlan> {
        return pipeTo(SubscriptionPlan.loadById, getParam("planId"))(args);
    }

    @CheckPermissions("subscription.update")
    public updateSubscriptionPlan(...args: HandlerArgs<Partial<ISubscriptionPlan>>): Promise<ISubscriptionPlan> {
        return pipeTo(SubscriptionPlan.update, getParam("planId"), getBody)(args);
    }

    @CheckPermissions("subscription.delete")
    public removeSubscriptionPlan(...args: HandlerArgs<undefined>): Promise<null> {
        return pipeTo(SubscriptionPlan.remove, getParam("planId"))(args);
    }

    @CheckPermissions("user.update")
    public subscribe (...args:HandlerArgs<Partial<IUser>>): Promise<any> {
        return pipeTo(SubscriptionPlan.subscribe, getParam("userId"), getBodyParam("subscriptionId"))(args);
    }

    @CheckPermissions("user.update")
    public unsubscribe (...args:HandlerArgs<undefined>): Promise<any> {
        return pipeTo(SubscriptionPlan.unsubscribe, getParam("userId"))(args);
    }
}

export const SubscriptionHandler = new SubscriptionHandlerClass();