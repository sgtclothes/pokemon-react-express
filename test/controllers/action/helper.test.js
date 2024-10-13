const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const helper = require("../../../controllers/action/helper");
const fs = require("fs");
jest.mock("fs");

describe("controllers/action/helper", () => {
    describe("response", () => {
        let message;
        beforeEach(()=> {
            message = "Operation successful";
        })
        it("should create a success response without data", () => {
            const expectedResponse = { message: message, status: "success" };
            const result = helper.response.createSuccessResponse(message);
            expect(result).toEqual(expectedResponse);
        });
        it("should create a success response with data", () => {
            const message = "Operation successful";
            const data = { id: 1, name: "Pikachu" };
            const expectedResponse = {
                message: message,
                status: "success",
                data: data,
            };
            const result = helper.response.createSuccessResponse(message, data);
            expect(result).toEqual(expectedResponse);
        });
        it("should create a success response with empty message", () => {
            const data = { id: 1, name: "Pikachu" };
            const expectedResponse = {
                message: "",
                status: "success",
            };
            const result = helper.response.createSuccessResponse();
            expect(result).toEqual(expectedResponse);
        });
        it("should create a failed response without detail", () => {
            const message = "Operation failed";
            const expectedResponse = {
                message: message,
                status: "failed",
            };
            const result = helper.response.createFailedResponse(message);
            expect(result).toEqual(expectedResponse);
        });
        it("should create a failed response with detail", () => {
            const message = "Operation failed";
            const detail = { error: "Invalid ID" };
            const expectedResponse = {
                message: message,
                status: "failed",
                detail: detail,
            };
            const result = helper.response.createFailedResponse(message, detail);
            expect(result).toEqual(expectedResponse);
        });
        it("should create a failed response with empty message", () => {
            const detail = { error: "Invalid ID" };
            const expectedResponse = {
                message: "",
                status: "failed"
            };
            const result = helper.response.createFailedResponse();
            expect(result).toEqual(expectedResponse);
        });
    });
    describe("client", () => {
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
                const result = await helper.client.getClientIP();
                expect(result).toEqual(mockResponse);
            });
            it("should handle error", async () => {
                mock.onGet("https://api.ipify.org?format=json").reply(500);
                console.log = jest.fn();
                await helper.client.getClientIP();
                expect(console.log).toHaveBeenCalled();
            });
        });
    });
    describe("datetime", () => {
        describe("addSeconds", () => {
            it("should add seconds to the current date", () => {
                const currentDate = new Date();
                const result = helper.datetime.addSeconds(60, new Date(currentDate));
                const expectedDate = new Date(currentDate);
                expectedDate.setSeconds(expectedDate.getSeconds() + 60);
                expect(result).toEqual(expectedDate);
            });
            it("should add seconds to a specified date", () => {
                const initialDate = new Date("2024-01-01T00:00:00Z");
                const result = helper.datetime.addSeconds(3600, new Date(initialDate));
                const expectedDate = new Date("2024-01-01T01:00:00Z");
                expect(result).toEqual(expectedDate);
            });
            it("should handle negative seconds", () => {
                const initialDate = new Date("2024-01-01T00:00:00Z");
                const result = helper.datetime.addSeconds(-60, new Date(initialDate));
                const expectedDate = new Date("2023-12-31T23:59:00Z");
                expect(result).toEqual(expectedDate);
            });
            it("should default to current date if no date is provided", () => {
                const result = helper.datetime.addSeconds(60);
                const expectedDate = new Date();
                expectedDate.setSeconds(expectedDate.getSeconds() + 60);
                expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1);
            });
            it("should return any errors when happen", () => {
                const today = new Date();
                jest.spyOn(today, "setSeconds").mockImplementation(() => {
                    throw new Error("This is an Error");
                });
                const result = helper.datetime.addSeconds(60, today);
                expect(result).toEqual({
                    message: "Failed to add Seconds",
                    status: "failed",
                    detail: expect.any(String),
                });
            });
        });
    });
    describe("file", () => {
        describe("write", () => {
            const fileName = "test.txt";
            const data = "Hello World";
            const code = "utf8";
            afterEach(() => {
                jest.clearAllMocks();
            });
            it("should write the file successfully", () => {
                fs.writeFileSync.mockImplementation(() => {});
                fs.readFileSync.mockImplementation(() => data);
                const result = helper.file.write(fileName, data, code);
                expect(fs.writeFileSync).toHaveBeenCalledWith(fileName, data);
                expect(fs.readFileSync).toHaveBeenCalledWith(fileName, code);
                expect(result).toEqual({
                    message: "Write file Successfully",
                    status: "success",
                    data: data,
                });
            });
            it("should return an error if writing the file fails", () => {
                const errorMessage = "Permission denied";
                fs.writeFileSync.mockImplementation(() => {
                    throw new Error(errorMessage);
                });
                const result = helper.file.write(fileName, data, code);
                expect(fs.writeFileSync).toHaveBeenCalledWith(fileName, data);
                expect(result).toEqual({
                    message: "Failed to write file",
                    status: "failed",
                    detail: errorMessage,
                });
            });
        });
    });
    describe("string", () => {
        describe("camelCaseToSentence", () => {
            test("should convert camelCase into sentence split by space", () => {
                expect(helper.string.camelCaseToSentence("camelCaseToSentence")).toBe("Camel Case To Sentence");
                expect(helper.string.camelCaseToSentence("thisIsATest")).toBe("This Is A Test");
                expect(helper.string.camelCaseToSentence("convertThisString")).toBe("Convert This String");
                expect(helper.string.camelCaseToSentence("singleWord")).toBe("Single Word");
            });
            test("should return empty string if value is empty string", () => {
                expect(helper.string.camelCaseToSentence("")).toBe("");
            });
            test("should return a word if value is a word", () => {
                expect(helper.string.camelCaseToSentence("word")).toBe("Word");
            });
        });
        describe("checkNumberAfterDashAtEnd", () => {
            test("should return the number after the dash at the end", () => {
                expect(helper.string.checkNumberAfterDashAtEnd("abc-123")).toBe(123);
                expect(helper.string.checkNumberAfterDashAtEnd("example-456")).toBe(456);
                expect(helper.string.checkNumberAfterDashAtEnd("test-789")).toBe(789);
            });
            test("should return null if there is no number after a dash at the end", () => {
                expect(helper.string.checkNumberAfterDashAtEnd("abc")).toBeNull();
                expect(helper.string.checkNumberAfterDashAtEnd("example-")).toBeNull();
                expect(helper.string.checkNumberAfterDashAtEnd("test123")).toBeNull();
            });
            test("should return null if the string does not end with a number after a dash", () => {
                expect(helper.string.checkNumberAfterDashAtEnd("abc-123-text")).toBeNull();
                expect(helper.string.checkNumberAfterDashAtEnd("example-456-789")).toBe(789);
            });
        });
        describe("updateNumberInNameAtEnd", () => {
            test("should update the number at the end of the name", () => {
                const result = helper.string.updateNumberInNameAtEnd("Pikachu-25", 26);
                expect(result).toBe("Pikachu-26");
            });
            test("should add the number at the end of the name if not present", () => {
                const result = helper.string.updateNumberInNameAtEnd("Pikachu", 25);
                expect(result).toBe("Pikachu-25");
            });
            test("should replace the existing number with a new one", () => {
                const result = helper.string.updateNumberInNameAtEnd("Pikachu-1", 2);
                expect(result).toBe("Pikachu-2");
            });
            test("should work correctly with names that have no number", () => {
                const result = helper.string.updateNumberInNameAtEnd("Bulbasaur", 1);
                expect(result).toBe("Bulbasaur-1");
            });
            test("should replace the number correctly even if the number has multiple digits", () => {
                const result = helper.string.updateNumberInNameAtEnd("Charmander-123", 456);
                expect(result).toBe("Charmander-456");
            });
        });
        describe("removeNumberAtEnd", () => {
            test('should remove number in the end of name starts with "-"', () => {
                expect(helper.string.removeNumberAtEnd("Pikachu-123")).toBe("Pikachu");
            });
            test("should return real name if no number in the end", () => {
                expect(helper.string.removeNumberAtEnd("Bulbasaur")).toBe("Bulbasaur");
            });
            test('should return real name if "-" is not followed by number', () => {
                expect(helper.string.removeNumberAtEnd("Charmander-xyz")).toBe("Charmander-xyz");
            });
            test('should remove number in the end of name that has more than one "-"', () => {
                expect(helper.string.removeNumberAtEnd("Charizard-X-456")).toBe("Charizard-X");
            });
            test("should remove number from name that has number in center but none in the end", () => {
                expect(helper.string.removeNumberAtEnd("Mewtwo-42-X")).toBe("Mewtwo-42-X");
            });
        });
    });
    describe("folder", () => {
        describe("createIfNotExists", () => {
            const mockPath = "public/logs";

            afterEach(() => {
                jest.clearAllMocks();
            });

            test("should return true if path exists", () => {
                fs.existsSync.mockReturnValue(true);
                const result = helper.folder.createIfNotExists(mockPath);
                expect(result).toBe(true);
                expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
                expect(fs.mkdirSync).not.toHaveBeenCalled();
            });

            test("should create folder and return false if path does not exist", () => {
                fs.existsSync.mockReturnValue(false);
                const result = helper.folder.createIfNotExists(mockPath);
                expect(result).toBe(false);
                expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
                expect(fs.mkdirSync).toHaveBeenCalledWith(mockPath);
            });

            test("should return an error object if an exception occurs", () => {
                const errorMessage = "Something went wrong";
                fs.existsSync.mockImplementation(() => {
                    throw new Error(errorMessage);
                });
                const result = helper.folder.createIfNotExists(mockPath);
                expect(result).toEqual({
                    message: "Failed to create folder if not exists",
                    status: "failed",
                    detail: errorMessage,
                });
                expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
                expect(fs.mkdirSync).not.toHaveBeenCalled();
            });
        });
    });
    describe("number", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        beforeEach(() => {
            jest.clearAllMocks();
        });
        describe("generateRandomArbitraryNumber", () => {
            test("should generate a number within the specified range", () => {
                const min = 5;
                const max = 10;
                const result = helper.number.generateRandomArbitraryNumber(min, max);
                expect(result).toBeGreaterThanOrEqual(min);
                expect(result).toBeLessThanOrEqual(max);
            });
            test("should handle incorrect input types gracefully", () => {
                const result = helper.number.generateRandomArbitraryNumber("a", "b");
                expect(result).toEqual(0);
            });
            test("should handle min greater than max gracefully", () => {
                const min = 10;
                const max = 5;
                const result = helper.number.generateRandomArbitraryNumber(min, max);
                expect(result).toBeGreaterThanOrEqual(max);
                expect(result).toBeLessThanOrEqual(min);
            });
            it("should get any errors when happen", () => {
                jest.spyOn(Math, "ceil").mockImplementation(() => {
                    throw new Error("This is an error!");
                });
                const result = helper.number.generateRandomArbitraryNumber(1, 100);
                expect(result).toEqual({
                    message: "Failed to generate random arbitrary number",
                    status: "failed",
                    detail: expect.any(String),
                });
                Math.ceil.mockRestore();
            });
        });
        describe("pseudoNumber", () => {
            test("should return true when value is 1 in check function", () => {
                expect(helper.number.pseudoNumber.check(1)).toBe(true);
            });
            test("should return false when value is not 1 in check function", () => {
                expect(helper.number.pseudoNumber.check(0)).toBe(false);
            });
            test("should generate a random number between 0 and 1 in generate function", () => {
                const value = helper.number.pseudoNumber.generate();
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(1);
            });
            test("should execute random type and return object with number and check status", () => {
                const result = helper.number.pseudoNumber.execute("random");
                expect(result).toHaveProperty("number");
                expect(result).toHaveProperty("check");
                expect(result.number).toBeGreaterThanOrEqual(0);
                expect(result.number).toBeLessThanOrEqual(1);
            });
            test("should return 1 if previousData is 0 and option is 1 in row type", () => {
                const result = helper.number.pseudoNumber.execute("row", 0);
                expect(result).toBe(1);
            });
            test("should return 0 if previousData is 1 and option is 1 in row type", () => {
                const result = helper.number.pseudoNumber.execute("row", 1);
                expect(result).toBe(0);
            });
            test("should return 0 if previousData is neither 0 nor 1 in row type", () => {
                const result = helper.number.pseudoNumber.execute("row", 2);
                expect(result).toBe(0);
            });
        });
        describe("primeNumber", () => {
            test("should return false for numbers less than or equal to 1", () => {
                expect(helper.number.primeNumber.check(1)).toBe(false);
                expect(helper.number.primeNumber.check(0)).toBe(false);
                expect(helper.number.primeNumber.check(-1)).toBe(false);
            });
            test("should return true for prime numbers", () => {
                expect(helper.number.primeNumber.check(2)).toBe(true);
                expect(helper.number.primeNumber.check(3)).toBe(true);
                expect(helper.number.primeNumber.check(5)).toBe(true);
                expect(helper.number.primeNumber.check(11)).toBe(true);
            });
            test("should return false for non-prime numbers", () => {
                expect(helper.number.primeNumber.check(4)).toBe(false);
                expect(helper.number.primeNumber.check(6)).toBe(false);
                expect(helper.number.primeNumber.check(9)).toBe(false);
                expect(helper.number.primeNumber.check(15)).toBe(false);
            });
            test("should return a number between 0 and 100", () => {
                const value = helper.number.primeNumber.generate();
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
            test("should return a random number with check result when type is random", () => {
                const result = helper.number.primeNumber.execute("random");
                expect(result).toHaveProperty("number");
                expect(result).toHaveProperty("check");
            });
            test("should return the next prime number greater than previousData when type is row", () => {
                const previousData = 10;
                const result = helper.number.primeNumber.execute("row", previousData);
                expect(result).toBe(11);
            });
            it("should return the next prime number after the previous data", () => {
                jest.spyOn(helper.number.primeNumber, "check")
                    .mockReturnValueOnce(false)
                    .mockReturnValueOnce(false)
                    .mockReturnValue(true);
                const result = helper.number.primeNumber.execute("row", 2);
                expect(result).toBe(5);
            });
        });
        describe("fibonacciNumber", () => {
            test("check method should correctly identify Fibonacci numbers", () => {
                expect(helper.number.fibonacciNumber.check(0)).toBe(true);
                expect(helper.number.fibonacciNumber.check(1)).toBe(true);
                expect(helper.number.fibonacciNumber.check(2)).toBe(true);
                expect(helper.number.fibonacciNumber.check(3)).toBe(true);
                expect(helper.number.fibonacciNumber.check(4)).toBe(false);
                expect(helper.number.fibonacciNumber.check(5)).toBe(true);
                expect(helper.number.fibonacciNumber.check(6)).toBe(false);
                expect(helper.number.fibonacciNumber.check(13)).toBe(true);
                expect(helper.number.fibonacciNumber.check(21)).toBe(true);
                expect(helper.number.fibonacciNumber.check(22)).toBe(false);
            });
            test("generate method should return a random number", () => {
                const value = helper.number.fibonacciNumber.generate();
                expect(typeof value).toBe("number");
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
            test('execute method should handle "random" type correctly', () => {
                const result = helper.number.fibonacciNumber.execute("random");
                expect(typeof result.number).toBe("number");
                expect(result.number).toBeGreaterThanOrEqual(0);
                expect(result.number).toBeLessThanOrEqual(100);
                expect(typeof result.check).toBe("boolean");
            });
            test('execute method should handle "row" type correctly', () => {
                expect(helper.number.fibonacciNumber.execute("row", 0)).toBe(1);
                expect(helper.number.fibonacciNumber.execute("row", 1)).toBe(2);
                expect(helper.number.fibonacciNumber.execute("row", 2)).toBe(3);
                expect(helper.number.fibonacciNumber.execute("row", 3)).toBe(5);
                expect(helper.number.fibonacciNumber.execute("row", 5)).toBe(8);
                expect(helper.number.fibonacciNumber.execute("row", 8)).toBe(13);
                expect(helper.number.fibonacciNumber.execute("row", 13)).toBe(21);
                expect(helper.number.fibonacciNumber.execute("row", -1)).toBe(0);
            });
        });
    });
    describe("collection", () => {
        describe("updateValueAtPath", () => {
            it("should return error when path is not provided", () => {
                const result = helper.collection.updateValueAtPath({}, "", "value");
                expect(result).toEqual({
                    message: "Failed to update JSON file",
                    status: "failed",
                    detail: "path not found",
                });
            });
            it("should update value at a given path with replace action", () => {
                const obj = { a: { b: { c: 1 } } };
                helper.collection.updateValueAtPath(obj, "a.b.c", 2);
                expect(obj.a.b.c).toBe(2);
            });
            it("should create nested structure if path does not exist", () => {
                const obj = {};
                helper.collection.updateValueAtPath(obj, "a.b.c", 3);
                expect(obj).toEqual({ a: { b: { c: 3 } } });
            });
            it("should push value to array at a given path", () => {
                const obj = { a: { b: { c: [1, 2] } } };
                helper.collection.updateValueAtPath(obj, "a.b.c", 3, "push");
                expect(obj.a.b.c).toEqual([1, 2, 3]);
            });
            it("should convert non-array value to array and push new value", () => {
                const obj = { a: { b: { c: 1 } } };
                helper.collection.updateValueAtPath(obj, "a.b.c", 2, "push");
                expect(obj.a.b.c).toEqual([1, 2]);
            });
            it("should handle empty object and create an array", () => {
                const obj = {};
                helper.collection.updateValueAtPath(obj, "a.b.c", 4, "push");
                expect(obj.a.b.c).toEqual([4]);
            });
        });
        describe("getValueAtPath", () => {
            it("should return valid number for valid rules", () => {
                const obj = { a: { b: { c: 42 } } };
                const result = helper.collection.getValueAtPath(obj, "a.b.c");
                expect(result).toBe(42);
            });
            it("should return undefined for invalid rules", () => {
                const obj = { a: { b: { c: 42 } } };
                const result = helper.collection.getValueAtPath(obj, "a.b.d");
                expect(result).toBeUndefined();
            });
            it("should return undefined if object does not have valid property", () => {
                const obj = { a: { b: 42 } };
                const result = helper.collection.getValueAtPath(obj, "a.c");
                expect(result).toBeUndefined();
            });
            it("should return undefined if empty string", () => {
                const obj = { a: { b: 42 } };
                const result = helper.collection.getValueAtPath(obj, "");
                expect(result).toBeUndefined();
            });
            it("should return value for first level rules", () => {
                const obj = { a: 42 };
                const result = helper.collection.getValueAtPath(obj, "a");
                expect(result).toBe(42);
            });
        });
    });
    describe("json", () => {
        describe("read", () => {
            afterEach(() => {
                jest.restoreAllMocks();
                fs.existsSync.mockRestore();
                fs.readFileSync.mockRestore();
            });
            it("should return success when JSON file is successfully read without options", () => {
                const mockPath = "public/logs";
                const mockName = "testFile";
                const mockData = { key: "value" };
                jest.spyOn(fs, "existsSync").mockReturnValue(true);
                jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
                const result = helper.json.read(mockPath, mockName);
                expect(result).toEqual({
                    message: "Successfully read JSON file",
                    status: "success",
                    data: mockData,
                });
            });
            it("should return success when JSON file is successfully read with options", () => {
                const mockPath = "public/logs";
                const mockName = "testFile";
                const mockData = { data: { login: { user: "JohnDoe" } } };
                const mockOptions = { path: "data.login" };
                jest.spyOn(fs, "existsSync").mockReturnValue(true);
                jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
                jest.spyOn(helper.collection, "getValueAtPath").mockReturnValue(mockData.data.login);
                const result = helper.json.read(mockPath, mockName, mockOptions);
                expect(result).toEqual({
                    message: "Successfully read JSON file",
                    status: "success",
                    data: mockData.data.login,
                });
            });
            it("should return failed when JSON file does not exist", () => {
                const mockPath = "public/logs";
                const mockName = "nonExistentFile";
                jest.spyOn(fs, "existsSync").mockReturnValue(false);
                const result = helper.json.read(mockPath, mockName);
                expect(result).toEqual({
                    message: "Failed to read JSON file",
                    status: "failed",
                });
            });
            it("should return failed when an error occurs while reading the file", () => {
                const mockPath = "public/logs";
                const mockName = "testFile";
                jest.spyOn(fs, "existsSync").mockReturnValue(true);
                jest.spyOn(fs, "readFileSync").mockImplementation(() => {
                    throw new Error("Error reading file");
                });
                const result = helper.json.read(mockPath, mockName);
                expect(result).toEqual({
                    message: "Failed to read JSON file",
                    status: "failed",
                    detail: "Error reading file",
                });
            });
        });
        describe("create", () => {
            const mockPath = "public/logs";
            const mockFileName = "mock";
            const mockObject = { key: "value" };
            afterEach(() => {
                jest.restoreAllMocks();
                fs.existsSync.mockRestore();
                fs.readFileSync.mockRestore();
                fs.writeFile.mockRestore();
            });
            it("should return error message if the JSON file already exists", () => {
                fs.existsSync.mockReturnValue(true);
                const result = helper.json.create(mockPath, mockFileName, mockObject);
                expect(result).toEqual({
                    message: "Failed to create JSON file",
                    status: "failed",
                    detail: "JSON file already exists",
                });
            });
            it("should return data when success write file", () => {
                fs.existsSync.mockReturnValue(false);
                fs.readFileSync.mockReturnValue(JSON.stringify(mockObject));
                const result = helper.json.create(mockPath, mockFileName, mockObject);
                expect(result).toBe(JSON.stringify(mockObject));
            });
            it("should handle errors during file creation", () => {
                const invalidPath = "/invalidDir";
                const result = helper.json.create(invalidPath, mockFileName, mockObject);
                expect(result).toEqual({
                    message: "Failed to create JSON file",
                    status: "failed",
                    detail: "path not found",
                });
            });
            it("should handle catch any error", () => {
                const invalidPath = undefined;
                fs.writeFile.mockImplementation(() => {
                    throw new Error("This is an error!");
                });
                const result = helper.json.create(invalidPath, mockFileName, mockObject);
                expect(result).toEqual({
                    message: "Failed to create JSON file",
                    status: "failed",
                    detail: expect.any(String),
                });
            });
        });
        describe("update", () => {
            afterEach(() => {
                jest.restoreAllMocks();
                fs.existsSync.mockRestore();
                fs.readFileSync.mockRestore();
                fs.writeFile.mockRestore();
            });
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it("should return failed response when failed to read JSON file", () => {
                const testPath = "public/logs";
                const testName = "mock";
                const testNewValue = { key: "newValue", key2: { data: null } };
                const testAction = "update";
                const mockReadJSONResponseFailed = { status: "failed", message: "Failed to read JSON file" };
                jest.spyOn(helper.json, "read").mockReturnValue({
                    status: "failed",
                    message: "Failed to read JSON file",
                });
                const result = helper.json.update(testPath, testName, testNewValue, testAction);
                expect(result).toEqual(mockReadJSONResponseFailed);
            });
            it("should return updated JSON response include with target key", () => {
                const testPath = "public/logs";
                const testName = "data";
                const testReadJSON = { key: "newValue", key2: { data: null } };
                const testAction = "replace";
                jest.spyOn(helper.json, "read").mockReturnValue({
                    message: "Successfully read JSON file",
                    status: "success",
                    data: testReadJSON,
                });
                fs.writeFile.mockReturnValue(true);
                const result = helper.json.update(testPath, "key2.data", testName, { status: "success" }, testAction);
                expect(result).toEqual(JSON.stringify({ key: "newValue", key2: { data: { status: "success" } } }));
            });
            it("should return error when catch any error", () => {
                const testPath = "public/logs";
                const testName = "data";
                const testAction = "replace";
                jest.spyOn(helper.json, "read").mockImplementation(() => {
                    throw new Error("This is an error!");
                });
                const result = helper.json.update(testPath, "key2.data", testName, { status: "success" }, testAction);
                expect(result).toEqual({
                    message: "Failed to update JSON file",
                    status: "failed",
                    detail: expect.any(String),
                });
            });
        });
    });
    describe("validator", () => {
        describe("validateRequiredFields", () => {
            it("should return valid: true when all required fields are present and valid", () => {
                const reqBody = { name: "Pikachu", type: "Electric", level: 5 };
                const requiredFields = ["name", "type", "level"];
                const result = helper.validator.validateRequiredFields(reqBody, requiredFields);
                expect(result).toEqual({ valid: true });
            });
            it("should return valid: false and list missing fields when some required fields are missing", () => {
                const reqBody = { name: "Pikachu", type: "Electric" };
                const requiredFields = ["name", "type", "level"];
                const result = helper.validator.validateRequiredFields(reqBody, requiredFields);
                expect(result).toEqual({ valid: false, missingFields: ["level"] });
            });
            it("should return valid: false and list fields that are null", () => {
                const reqBody = { name: "Pikachu", type: null, level: 5 };
                const requiredFields = ["name", "type", "level"];
                const result = helper.validator.validateRequiredFields(reqBody, requiredFields);
                expect(result).toEqual({ valid: false, missingFields: ["type"] });
            });
            it("should return valid: false and list fields that are undefined", () => {
                const reqBody = { name: "Pikachu", level: 5 };
                const requiredFields = ["name", "type", "level"];
                const result = helper.validator.validateRequiredFields(reqBody, requiredFields);
                expect(result).toEqual({ valid: false, missingFields: ["type"] });
            });
            it("should return valid: false and list fields that are empty strings", () => {
                const reqBody = { name: "Pikachu", type: "", level: 5 };
                const requiredFields = ["name", "type", "level"];
                const result = helper.validator.validateRequiredFields(reqBody, requiredFields);
                expect(result).toEqual({ valid: false, missingFields: ["type"] });
            });
        });
    });
});
