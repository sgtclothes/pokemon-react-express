const jwt = require("jsonwebtoken");
const { Navigator } = require("node-navigator");
const moment = require("moment");
const baseModel = require("../../../controllers/base/model");
const baseToken = require("../../../controllers/base/token");
const helper = require("../../../controllers/action/helper");
const configJSAuth = require("../../../config/javascript/auth");
const configJSONApp = require("../../../config/json/app.json");

jest.mock("jsonwebtoken");
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

describe("controllers/base/token", () => {
    describe("action", () => {
        describe("login", () => {
            let mockId, mockToken, mockExpiresIn, mockIp, mockTokenResponse, mockExpiredDate;
            beforeEach(() => {
                mockId = 1;
                mockExpiresIn = 86400;
                mockExpiredDate = moment().add(mockExpiresIn, "seconds").format();
                mockIp = "192.168.1.1";
                mockToken = "token123";
                mockTokenResponse = {
                    tkn_type: configJSONApp.token.login.tkn_type,
                    tkn_description: configJSONApp.token.login.tkn_description,
                    tkn_value: mockToken,
                    tkn_client_agent: new Navigator().userAgent,
                    tkn_client_ip: mockIp,
                    tkn_us_id: mockId,
                    tkn_expired_on: mockExpiredDate,
                    tkn_active: true,
                    tkn_created_by: mockId,
                    tkn_created_on: moment().format(),
                };
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should get client IP", async () => {
                helper.client.getClientIP.mockResolvedValue({
                    ip: "192.168.1.1",
                });
                await baseToken.action.login(mockId, mockToken, mockExpiresIn);
                expect(helper.client.getClientIP).toHaveBeenCalled();
            });
            it("should return success when successfully create token", async () => {
                helper.client.getClientIP.mockResolvedValue({
                    ip: "192.168.1.1",
                });
                baseModel.models("Token").store.mockResolvedValue(mockTokenResponse);
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully to create token login!",
                    data: mockTokenResponse,
                });
                await baseToken.action.login(mockId, mockToken, mockExpiresIn);
                expect(helper.client.getClientIP).toHaveBeenCalled();
                expect(baseModel.models("Token").store).toHaveBeenCalledWith(mockTokenResponse);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith(
                    "Successfully to create token login!",
                    mockTokenResponse
                );
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error store token",
                };
                baseModel.models("Token").store.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.client.getClientIP.mockResolvedValue({
                    ip: "192.168.1.1",
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                await baseToken.action.login(mockId, mockToken, mockExpiresIn);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
            });
        });
        describe("createToken", () => {
            let mockData, mockSecret, mockConfig, res, mockToken;
            beforeEach(() => {
                mockData = {
                    us_id: 1,
                    us_username: "testuser",
                    us_email: "testuser@example.com",
                    status: "success",
                    message: "user logged in",
                    path: "/",
                };
                mockSecret = configJSAuth.secret;
                mockConfig = { expiresIn: 86400 };
                res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                    send: jest.fn(),
                };
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should create token", async () => {
                jwt.sign.mockReturnValue(mockToken);
                baseToken.action.createToken(mockData, mockSecret, mockConfig, res);
                expect(jwt.sign).toHaveBeenCalledWith(mockData, mockSecret, mockConfig);
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error generates token",
                };
                jwt.sign.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                baseToken.action.createToken(mockData, mockSecret, mockConfig, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
                expect(res.send).toHaveBeenCalledWith({
                    message: error.message,
                    status: "failed",
                });
            });
        });
        describe("verifyToken", () => {
            let mockData, mockSecret, mockConfig, res, mockToken;
            beforeEach(() => {
                mockData = {
                    us_id: 1,
                    us_username: "testuser",
                    us_email: "testuser@example.com",
                    status: "success",
                    message: "user logged in",
                    path: "/",
                };
                mockSecret = configJSAuth.secret;
                mockConfig = { expiresIn: 86400 };
                res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                    send: jest.fn(),
                };
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should return 401 Unauthorized if error verify token", () => {
                const errorMessage = "Unauthorized!";
                jwt.verify.mockImplementation((token, secret, callback) => {
                    callback(new Error("Error verify token"), null);
                });
                helper.response.createFailedResponse.mockReturnValue({ message: errorMessage });
                baseToken.action.verifyToken(mockToken, mockSecret, res);
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith(helper.response.createFailedResponse(errorMessage));
            });
            it("should return decoded if no error at verify token", () => {
                mockData.status = "success";
                jwt.verify.mockImplementation((token, secret, callback) => {
                    callback(false, mockData);
                    return mockData;
                });
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Successfully Verify Token",
                    data: mockData,
                });
                baseToken.action.verifyToken(mockToken, mockSecret, res);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith(
                    "Successfully Verify Token",
                    mockData
                );
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error verify token",
                };
                jwt.verify.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                baseToken.action.verifyToken(mockToken, mockSecret, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
                expect(res.send).toHaveBeenCalledWith({
                    message: error.message,
                    status: "failed",
                });
            });
        });
        describe("verifyTokenChangePassword", () => {
            let mockData, mockSecret, mockConfig, req, res, mockToken;
            beforeEach(() => {
                mockToken = "token123"
                mockData = {
                    us_id: 1,
                    us_username: "testuser",
                    us_email: "testuser@example.com",
                    status: "success",
                    message: "user logged in",
                    path: "/",
                };
                mockSecret = configJSAuth.secret;
                mockConfig = { expiresIn: 86400 };
                req = {
                    body: {
                        token: mockToken,
                    },
                };
                res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                    send: jest.fn(),
                };
                jest.clearAllMocks();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should verify token first", async () => {
                baseToken.action.verifyToken = jest.fn().mockReturnValue(mockData);
                await baseToken.action.verifyTokenChangePassword(req, res);
                expect(baseToken.action.verifyToken).toHaveBeenCalledWith(mockToken, configJSAuth.changePassword, res);
            });
            it("should set response status to failed if tkn_active undefined/null/false", async () => {
                const error = {
                    message: "Failed to Verify Token Change Password"
                }
                baseToken.action.verifyToken = jest.fn().mockReturnValue(mockData);
                baseModel.models("Token").findOne.mockResolvedValue({tkn_active: false});
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                    detail: mockData
                });
                await baseToken.action.verifyTokenChangePassword(req, res);
                expect(baseToken.action.verifyToken).toHaveBeenCalledWith(mockToken, configJSAuth.changePassword, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message, mockData);
                expect(res.send).toHaveBeenCalledWith(helper.response.createFailedResponse("Failed to Verify Token Change Password", mockData));
            });
            it("should set response status to success if tkn_active is defined", async () => {
                const message = "Successfully Verify Token Change Password";
                baseToken.action.verifyToken = jest.fn().mockReturnValue(mockData);
                baseModel.models("Token").findOne.mockResolvedValue({tkn_active: true});
                helper.response.createSuccessResponse.mockReturnValue({
                    message: message,
                    status: "success",
                    data: mockData
                });
                await baseToken.action.verifyTokenChangePassword(req, res);
                expect(baseToken.action.verifyToken).toHaveBeenCalledWith(mockToken, configJSAuth.changePassword, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith(message, mockData);
                expect(res.send).toHaveBeenCalledWith(helper.response.createSuccessResponse(message, mockData));
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error verify token change password",
                };
                baseToken.action.verifyToken = jest.fn().mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                await baseToken.action.verifyTokenChangePassword(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
                expect(res.send).toHaveBeenCalledWith({
                    message: error.message,
                    status: "failed",
                });
            });
        });
    });
});
