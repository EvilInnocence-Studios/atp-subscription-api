import { basicCrudService } from "../core/express/service/common";
import { ISubscriptionPlan } from "../subscription-shared/types";

export const SubscriptionPlan = {
    ...basicCrudService<ISubscriptionPlan>("subscriptionPlans")
}
