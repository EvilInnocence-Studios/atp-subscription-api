import { database } from "../../../core/database";
import { IMigration } from "../../../core/database.d";

const db = database();

export const init:IMigration = {
    down: () => db.schema
        .dropTableIfExists("subscription-plans"),
    up: () => db.schema
        .createTable("subscription-plans", (table) => {
            table.bigIncrements();
            table.string("name").notNullable().unique();
            table.string("planId").notNullable().unique();
            table.string("description").notNullable().defaultTo("");
            table.string("renews").notNullable().defaultTo("monthly");
            table.integer("period").notNullable().defaultTo(1);
            table.float("price").notNullable().defaultTo(0);
        }),
    priority: 0,
    initData: () => Promise.resolve(true),
};
