import { insertPermissions } from "../../../uac/migrations/util";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/database.d";

const db = database();

export const init:IMigration = {
    down: () => db.schema
        .dropTableIfExists("subscriptionPlans"),
    up: () => db.schema
        .createTable("subscriptionPlans", (table) => {
            table.bigIncrements();
            table.string("name").unique();
            table.string("planId").unique();
            table.string("description").notNullable().defaultTo("");
            table.string("renews").notNullable().defaultTo("monthly");
            table.integer("period").notNullable().defaultTo(1);
            table.float("price").notNullable().defaultTo(0);
        }),
    priority: 0,
    initData: () => insertPermissions(db, [
        { name: "subscription.view", description: "View subscription plans" },
        { name: "subscription.create", description: "Create subscription plans" },
        { name: "subscription.update", description: "Update subscription plans" },
        { name: "subscription.delete", description: "Delete subscription plans" },
    ]),
};
