const fs = require("fs");
const moment = require("moment");
const { processJSON, generateJSON } = require("../../../controllers").action.log;

jest.mock("fs");

describe("processJSON", () => {
    const paths = { log: "./log" };
    const dateFileName = "2024-07-16";
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should create directory if not exists", () => {
        fs.existsSync.mockReturnValueOnce(false);
        fs.mkdirSync.mockImplementation(() => {});
        processJSON("login", {});
        expect(fs.existsSync).toHaveBeenCalledWith(paths.log);
        expect(fs.mkdirSync).toHaveBeenCalledWith(paths.log);
    });
    test("should create JSON file if not exists", () => {
        fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
        const generateJSON = jest.spyOn(exports, "generateJSON").mockImplementation(() => {});
        processJSON("login", {});
        expect(generateJSON).toHaveBeenCalledWith({});
    });
    test("should update JSON when type is login", () => {
        fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
        const updateJSONWhenLogin = jest.spyOn(exports, "updateJSONWhenLogin").mockImplementation(() => {});
        processJSON("login", {});
        expect(updateJSONWhenLogin).toHaveBeenCalledWith({});
    });

    test("should update JSON when type is search", () => {
        fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
        const updateJSONWhenSearch = jest.spyOn(exports, "updateJSONWhenSearch").mockImplementation(() => {});
        processJSON("search", {});
        expect(updateJSONWhenSearch).toHaveBeenCalledWith({});
    });

    test("should log error message if error occurs", () => {
        const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
        fs.existsSync.mockImplementation(() => {
            throw new Error("Test error");
        });
        processJSON("login", {});
        expect(consoleLog).toHaveBeenCalledWith({ message: "Test error" });
    });
});
