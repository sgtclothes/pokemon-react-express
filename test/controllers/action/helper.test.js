const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { getClientIP, addSeconds } = require("../../../controllers/action/helper");

describe("controllers/action/helper", () => {
    describe("getClientIP", () => {
        let mock;
        beforeAll(() => {
            mock = new MockAdapter(axios);
        });
        afterEach(() => {
            mock.reset();
        });
        afterAll(() => {
            mock.restore();
        });
        it("should return IP address on successful API call", async () => {
            const mockResponse = { ip: "123.456.789.0" };
            mock.onGet("https://api.ipify.org?format=json").reply(200, mockResponse);
            const result = await getClientIP();
            expect(result).toEqual(mockResponse);
        });
        it("should handle error", async () => {
            mock.onGet("https://api.ipify.org?format=json").reply(500);
            console.log = jest.fn();
            await getClientIP();
            expect(console.log).toHaveBeenCalled();
        });
    });
    describe("addSeconds", () => {
        it("should add seconds to the current date", () => {
            const currentDate = new Date();
            const result = addSeconds(60, new Date(currentDate));
            const expectedDate = new Date(currentDate);
            expectedDate.setSeconds(expectedDate.getSeconds() + 60);
            expect(result).toEqual(expectedDate);
        });
        it("should add seconds to a specified date", () => {
            const initialDate = new Date("2024-01-01T00:00:00Z");
            const result = addSeconds(3600, new Date(initialDate));
            const expectedDate = new Date("2024-01-01T01:00:00Z");
            expect(result).toEqual(expectedDate);
        });
        it("should handle negative seconds", () => {
            const initialDate = new Date("2024-01-01T00:00:00Z");
            const result = addSeconds(-60, new Date(initialDate));
            const expectedDate = new Date("2023-12-31T23:59:00Z");
            expect(result).toEqual(expectedDate);
        });
        it("should default to current date if no date is provided", () => {
            const result = addSeconds(60);
            const expectedDate = new Date();
            expectedDate.setSeconds(expectedDate.getSeconds() + 60);
            expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1);
        });
    });
});
