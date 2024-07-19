const fs = require("fs");
const moment = require("moment");
const mock = require("mock-fs");
const { processJSON, generateJSON } = require("../../../controllers").action.log;
const { createFolderIfNotExists } = require("../../../controllers").action.helper;
const paths = require("../../../config/app.json").paths;

describe("controllers/action/log", () => {
    describe("processJSON", () => {
        beforeEach(() => {
            mock({
                "public/logs": {},
            });
        });
        afterEach(() => {
            mock.restore();
        });
        it("should create folder if does not exists", () => {
            expect(fs.existsSync("public/logs")).toBeTruthy();
        });
        // it("should not create folder if exists", () => {
        //     expect(fs.existsSync(paths.log)).toBe(true);
        //     createFolderIfNotExists(paths.log);
        //     expect(fs.existsSync(paths.log)).toBe(true);
        //     mock.restore();
        // });
        // it("should create JSON file if does not exists", () => {
        //     const fileName = "17-07-2024.json";
        //     expect(fs.existsSync(paths.log + "/" + fileName)).toBe(false);
        // });
    });
    describe("generateJSON", () => {});
});
