import { pipeTo } from "ts-functional";
import { getBody, getParam } from "../core/express/extractors";
import { HandlerArgs } from "../core/express/types";
import { ISubscriptionPlan, NewSubscriptionPlan } from "../subscription-shared/types";
import { CheckPermissions } from "../uac/permission/util";
import { SubscriptionPlan } from "./services";

class SubscriptionHandlerClass {
    @CheckPermissions("subscription.create")
    public createSubscriptionPlan(...args: HandlerArgs<NewSubscriptionPlan>): Promise<ISubscriptionPlan> {
        return SubscriptionPlan.create(getBody(args));
    }

    @CheckPermissions("subscription.view")
    public getSubscriptionPlans(...args: HandlerArgs<undefined>): Promise<ISubscriptionPlan[]> {
        return SubscriptionPlan.search();
    }

    @CheckPermissions("subscription.update")
    public updateSubscriptionPlan(...args: HandlerArgs<Partial<ISubscriptionPlan>>): Promise<ISubscriptionPlan> {
        return pipeTo(SubscriptionPlan.update, getParam("planId"), getBody)(args);
    }

    @CheckPermissions("subscription.delete")
    public removeSubscriptionPlan(...args: HandlerArgs<undefined>): Promise<null> {
        return pipeTo(SubscriptionPlan.remove, getParam("planId"))(args);
    }
}

export const SubscriptionHandler = new SubscriptionHandlerClass();