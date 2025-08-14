import { Setting } from "../common/setting/service";
import { database } from "../core/database";
import { subscription } from "../core/paypal";
import { render } from "../core/render";
import { sendEmail } from "../core/sendEmail";
import { User } from "../uac/user/service";
import { basicCrudService } from "../core/express/service/common";
import { ISubscriptionPlan } from "../subscription-shared/types";
import { CancelSubscription } from "./components/cancelSubscription";

const db = database();

export const SubscriptionPlan = {
    ...basicCrudService<ISubscriptionPlan>("subscriptionPlans"),

    subscribe: async (userId:string, subscriptionId:string):Promise<any> => {
        await db("users")
            .update({subscriptionId})
            .where({id: userId});

        const roleId = await Setting.get("subscriptionRole");

        await User.roles.add(userId, roleId);
    },

    unsubscribe: async (userId:string):Promise<any> => {
        // Get the subscription ID from the database
        const subscriptionId = await User.loadById(userId).then(user => user.subscriptionId);
        if(subscriptionId) {
            // Cancel the subscription with PayPal
            await subscription.cancel(subscriptionId);
        } else {
            const html = render(CancelSubscription, {user: await User.loadById(userId)});
            const supportEmail = await Setting.get("supportEmail");
            sendEmail("Subscription Cancelled", html, [supportEmail]);
        }
        
        
        // Remove the subscription ID from the database
        await db("users")
            .update({subscriptionId: null})
            .where({id: userId});

        // Remove the subscription role from the user
        const roleId = await Setting.get("subscriptionRole");
        await User.roles.remove(userId, roleId);
    },
}
