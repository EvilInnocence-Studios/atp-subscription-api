import { insertPermissions, insertRoles } from "../../../uac/migrations/util";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";

const db = database();

export const init:IMigration = {
    name: "init",
    module: "subscription",
    description: "Install the subscription module",
    order: 0,
    down: () => db.schema
        .dropTableIfExists("subscriptionPlans")
        .alterTable("users", (table) => {
            table.dropColumn("subscriptionId");
        }),
    up: () => db.schema
        .createTable("subscriptionPlans", (table) => {
            table.bigIncrements();
            table.string("name").unique();
            table.string("planId").unique();
            table.string("description").notNullable().defaultTo("");
            table.string("renews").notNullable().defaultTo("monthly");
            table.integer("period").notNullable().defaultTo(1);
            table.float("price").notNullable().defaultTo(0);
        })
        .alterTable("users", (table) => {
            table.string("subscriptionId", 255).unique();
        }),
    initData: () => Promise.all([
        insertPermissions(db, [
            { name: "subscription.view", description: "View subscription plans" },
            { name: "subscription.create", description: "Create subscription plans" },
            { name: "subscription.update", description: "Update subscription plans" },
            { name: "subscription.delete", description: "Delete subscription plans" },
        ]),
        insertRoles(db, [
            { name: "Subscriber", description: "Users who are members of the subscription" },
        ])
    ]),
};
