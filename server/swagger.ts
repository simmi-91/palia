import swaggerJsdoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Palia Wiki API",
            version: "1.0.0",
            description: "Backend API for the Palia mini-wiki",
        },
        servers: [{ url: "/palia" }],
        components: {
            schemas: {
                EntityLink: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                        category: { type: "string", nullable: true },
                    },
                },
                Item: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        category: { type: "string" },
                        name: { type: "string" },
                        image: { type: "string", nullable: true },
                        url: { type: "string", nullable: true },
                        rarity: { type: "integer", nullable: true },
                        description: { type: "string", nullable: true },
                        time: { type: "string", nullable: true },
                        baseValue: { type: "integer", nullable: true },
                        behavior: { type: "string", nullable: true },
                        bait: { type: "string", nullable: true },
                        family: { type: "string", nullable: true },
                        location: { type: "array", items: { $ref: "#/components/schemas/EntityLink" } },
                        neededFor: { type: "array", items: { $ref: "#/components/schemas/EntityLink" } },
                        howToObtain: { type: "array", items: { $ref: "#/components/schemas/EntityLink" } },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        display_name: { type: "string" },
                        is_visible: { type: "boolean" },
                        is_tradeable: { type: "boolean" },
                        is_favoritable: { type: "boolean" },
                    },
                },
                InventoryItem: {
                    type: "object",
                    properties: {
                        category: { type: "string" },
                        itemId: { type: "integer" },
                        amount: { type: "integer" },
                    },
                },
                FavoriteItem: {
                    type: "object",
                    properties: {
                        favoriteId: { type: "integer" },
                        userId: { type: "string" },
                        itemId: { type: "integer" },
                        category: { type: "string" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                    },
                },
            },
        },
    },
    apis: ["./routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
