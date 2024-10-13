const moment = require("moment");
const helper = require("../../../controllers/action/helper");
const baseModel = require("../../../controllers/base/model");
const baseLog = require("../../../controllers/base/log");
const configJSONApp = require("../../../config/json/app.json");
const dateFileName = moment().format("DD-MM-YYYY");
jest.mock("../../../controllers/action/helper");
jest.mock("../../../controllers/base/model", () => {
    return {
        models: jest.fn().mockReturnValue({
            store: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
        }),
    };
});

describe("controllers/base/log", () => {
    describe("action", () => {
        describe("register", () => {
            let mockId = 1, mockRequest;
            beforeEach(() => {
                mockRequest = configJSONApp.log.registerNewUser;
                mockRequest.log_name = mockRequest.log_name + " (USER ID : " + mockId + ")";
                mockRequest.log_active = 1;
                mockRequest.log_created_on = moment().format();
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create folder if not exists", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                await baseLog.action.register(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
            });
            it("should create object JSON for register", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                await baseLog.action.register(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { register: [] });
            });
            it("should update object JSON for register", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                await baseLog.action.register(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { register: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"register", dateFileName, mockRequest, "push");
            });
            it("should store log to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                await baseLog.action.register(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { register: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"register", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
            });
            it("should return success response after log stored to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create register log!",
                    data: mockRequest
                });
                await baseLog.action.register(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { register: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"register", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Successfully to create register log!", mockRequest);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create folder",
                };
                helper.folder.createIfNotExists.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create register log",
                    status: "failed",
                    detail: error.message
                })
                const response = await baseLog.action.register(mockId);
                expect(response).toEqual({
                    message: "Failed to create register log",
                    status: "failed",
                    detail: error.message
                });
            });
        });
        describe("login", () => {
            let mockId = 1, mockRequest;
            beforeEach(() => {
                mockRequest = configJSONApp.log.login;
                mockRequest.log_name = mockRequest.log_name + " (USER ID : " + mockId + ")";
                mockRequest.log_active = 1;
                mockRequest.log_created_on = moment().format();
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create folder if not exists", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                await baseLog.action.login(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
            });
            it("should create object JSON for login", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                await baseLog.action.login(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { login: [] });
            });
            it("should update object JSON for login", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                await baseLog.action.login(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { login: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"login", dateFileName, mockRequest, "push");
            });
            it("should store log to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                await baseLog.action.login(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { login: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"login", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
            });
            it("should return success response after log stored to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create login log!",
                    data: mockRequest
                });
                await baseLog.action.login(mockId);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { login: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"login", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Successfully to create login log!", mockRequest);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create folder",
                };
                helper.folder.createIfNotExists.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create login log",
                    status: "failed",
                    detail: error.message
                })
                const response = await baseLog.action.login(mockId);
                expect(response).toEqual({
                    message: "Failed to create login log",
                    status: "failed",
                    detail: error.message
                });
            });
        });
        describe("search", () => {
            let mockId = 1, mockRequest, mockKeyword = "MOCK";
            beforeEach(() => {
                mockRequest = configJSONApp.log.search;
                mockRequest.log_name = mockRequest.log_name + " (USER ID : " + mockId + ")";
                mockRequest.log_description = mockRequest.log_description+ " (KEYWORD : " + mockKeyword + ")";
                mockRequest.log_active = 1;
                mockRequest.log_created_on = moment().format();
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create folder if not exists", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                await baseLog.action.search(mockId, mockKeyword);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
            });
            it("should create object JSON for search", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                await baseLog.action.search(mockId, mockKeyword);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { search: [] });
            });
            it("should update object JSON for search", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                await baseLog.action.search(mockId, mockKeyword);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { search: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"search", dateFileName, mockRequest, "push");
            });
            it("should store log to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                await baseLog.action.search(mockId, mockKeyword);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { search: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"search", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
            });
            it("should return success response after log stored to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create search log!",
                    data: mockRequest
                });
                await baseLog.action.search(mockId, mockKeyword);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { search: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"search", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Successfully to create search log!", mockRequest);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create folder",
                };
                helper.folder.createIfNotExists.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create search log",
                    status: "failed",
                    detail: error.message
                })
                const response = await baseLog.action.search(mockId, mockKeyword);
                expect(response).toEqual({
                    message: "Failed to create search log",
                    status: "failed",
                    detail: error.message
                });
            });
        });
        describe("catchPokemon", () => {
            let mockId = 1, mockRequest, mockStatus = "catched", mockKeyword = "MOCK", mockPokemonId = 1, mockPokemonName = "Pikachu", mockPokemonNickName = "Mighty-Pikachu", mockLogic = "boolean", mockNumber= 10;
            beforeEach(() => {
                mockRequest = configJSONApp.log.catchPokemon;
                mockRequest.log_name = mockRequest.log_name + " (USER ID : " + mockId + ")";
                mockRequest.log_description = mockRequest.log_description + " (STATUS : " + mockStatus + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON ID : " + mockPokemonId + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON NAME : " + mockPokemonName + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON NICKNAME : " + mockPokemonNickName + ") ";
                mockRequest.log_description = mockRequest.log_description + " (USED LOGIC : " + mockLogic + ") ";
                mockRequest.log_description = mockRequest.log_description + " (GET NUMBER : " + mockNumber + ")";
                mockRequest.log_active = 1;
                mockRequest.log_created_on = moment().format();
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create folder if not exists", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                await baseLog.action.catchPokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
            });
            it("should create object JSON for catch pokemon", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                await baseLog.action.catchPokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { catchPokemon: [] });
            });
            it("should update object JSON for catch pokemon", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                await baseLog.action.catchPokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { catchPokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"catchPokemon", dateFileName, mockRequest, "push");
            });
            it("should store log to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                await baseLog.action.catchPokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { catchPokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"catchPokemon", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
            });
            it("should return success response after log stored to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create catch log!",
                    data: mockRequest
                });
                await baseLog.action.catchPokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { catchPokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"catchPokemon", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Successfully to create catch log!", mockRequest);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create folder",
                };
                helper.folder.createIfNotExists.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create catch log",
                    status: "failed",
                    detail: error.message
                })
                const response = await baseLog.action.catchPokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(response).toEqual({
                    message: "Failed to create catch log",
                    status: "failed",
                    detail: error.message
                });
            });
        });
        describe("releasePokemon", () => {
            let mockId = 1, mockRequest, mockStatus = "released", mockKeyword = "MOCK", mockPokemonId = 1, mockPokemonName = "Pikachu", mockPokemonNickName = "Mighty-Pikachu", mockLogic = "boolean", mockNumber= 10;
            beforeEach(() => {
                mockRequest = configJSONApp.log.releasePokemon;
                mockRequest.log_name = mockRequest.log_name + " (USER ID : " + mockId + ")";
                mockRequest.log_description = mockRequest.log_description + " (STATUS : " + mockStatus + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON ID : " + mockPokemonId + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON NAME : " + mockPokemonName + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON NICKNAME : " + mockPokemonNickName + ") ";
                mockRequest.log_description = mockRequest.log_description + " (USED LOGIC : " + mockLogic + ") ";
                mockRequest.log_description = mockRequest.log_description + " (GET NUMBER : " + mockNumber + ")";
                mockRequest.log_active = 1;
                mockRequest.log_created_on = moment().format();
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create folder if not exists", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                await baseLog.action.releasePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
            });
            it("should create object JSON for release pokemon", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                await baseLog.action.releasePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { releasePokemon: [] });
            });
            it("should update object JSON for release pokemon", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                await baseLog.action.releasePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { releasePokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"releasePokemon", dateFileName, mockRequest, "push");
            });
            it("should store log to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                await baseLog.action.releasePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { releasePokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"releasePokemon", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
            });
            it("should return success response after log stored to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create release log!",
                    data: mockRequest
                });
                await baseLog.action.releasePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { releasePokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"releasePokemon", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Successfully to create release log!", mockRequest);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create folder",
                };
                helper.folder.createIfNotExists.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create release log",
                    status: "failed",
                    detail: error.message
                })
                const response = await baseLog.action.releasePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickName, mockLogic, mockNumber);
                expect(response).toEqual({
                    message: "Failed to create release log",
                    status: "failed",
                    detail: error.message
                });
            });
        });
        describe("renamePokemon", () => {
            let mockId = 1, mockRequest, mockStatus = "released", mockKeyword = "MOCK", mockPokemonId = 1, mockPokemonName = "Pikachu", mockPokemonNickNames = {previous: "Mighty-Pikachu", new: "New-Pikachu"}, mockLogic = "boolean", mockNumber= 10;
            beforeEach(() => {
                mockRequest = configJSONApp.log.renamePokemon;
                mockRequest.log_name = mockRequest.log_name + " (USER ID : " + mockId + ")";
                mockRequest.log_description = mockRequest.log_description + " (STATUS : " + mockStatus + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON ID : " + mockPokemonId + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON NAME : " + mockPokemonName + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON PREVIOUS NICKNAME : " + mockPokemonNickNames.previous + ") ";
                mockRequest.log_description = mockRequest.log_description + " (POKEMON NEW NICKNAME : " + mockPokemonNickNames.new + ") ";
                mockRequest.log_description = mockRequest.log_description + " (USED LOGIC : " + mockLogic + ") ";
                mockRequest.log_description = mockRequest.log_description + " (GET NUMBER : " + mockNumber + ")";
                mockRequest.log_active = 1;
                mockRequest.log_created_on = moment().format();
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create folder if not exists", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                await baseLog.action.renamePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickNames, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
            });
            it("should create object JSON for rename pokemon", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                await baseLog.action.renamePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickNames, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { renamePokemon: [] });
            });
            it("should update object JSON for rename pokemon", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                await baseLog.action.renamePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickNames, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { renamePokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"renamePokemon", dateFileName, mockRequest, "push");
            });
            it("should store log to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                await baseLog.action.renamePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickNames, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { renamePokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"renamePokemon", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
            });
            it("should return success response after log stored to database", async () => {
                helper.folder.createIfNotExists.mockReturnValue();
                helper.json.create.mockReturnValue();
                helper.json.update.mockReturnValue();
                baseModel.models("Log").store.mockResolvedValue(mockRequest);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create rename log!",
                    data: mockRequest
                });
                await baseLog.action.renamePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickNames, mockLogic, mockNumber);
                expect(helper.folder.createIfNotExists).toHaveBeenCalledWith(configJSONApp.paths.log);
                expect(helper.json.create).toHaveBeenCalledWith(configJSONApp.paths.log, dateFileName, { renamePokemon: [] });
                expect(helper.json.update).toHaveBeenCalledWith(configJSONApp.paths.log,"renamePokemon", dateFileName, mockRequest, "push");
                expect(baseModel.models("Log").store).toHaveBeenCalledWith(mockRequest);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Successfully to create rename log!", mockRequest);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create folder",
                };
                helper.folder.createIfNotExists.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create rename log",
                    status: "failed",
                    detail: error.message
                })
                const response = await baseLog.action.renamePokemon(mockId, mockStatus, mockPokemonId, mockPokemonName, mockPokemonNickNames, mockLogic, mockNumber);
                expect(response).toEqual({
                    message: "Failed to create rename log",
                    status: "failed",
                    detail: error.message
                });
            });
        });
    });
});
