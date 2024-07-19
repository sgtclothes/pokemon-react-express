const request = require("supertest");
const base = require("../../../controllers/base");
const { getConfiguration } = require("../../../controllers").action.configuration;
const app = require("../../app");

jest.mock("../../../controllers/base");

describe("controllers/action/configuration", () => {
    describe("getConfiguration", () => {
        beforeEach(() => {
            base.configuration.methods = jest.fn().mockReturnValue({
                findOne: jest.fn(),
            });
        });
        it("should return 404 if configuration not found", async () => {
            const response = await request(app).post("/configuration").send({ type: "logic" });
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                status: "failed",
                message: "Configuration not found",
            });
        });
        // it("should return configuration when found", async () => {
        //     const mockConfig = { id: 1, config_type: "logic", value: { catchPokemon: "pseudoNumber" } };
        //     const response = await request(app).post("/configuration").send({ type: "logic" });
        //     expect(response.status).toBe(200);
        //     expect(response.body).toEqual({
        //         status: "success",
        //         message: "Get Configuration Successfully",
        //         data: mockConfig,
        //     });
        // });
    });
});
