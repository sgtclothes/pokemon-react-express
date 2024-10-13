const auth = require("../../../controllers/action/auth");
const helper = require("../../../controllers/action/helper");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const baseModel = require("../../../controllers/base/model");
const baseLog = require("../../../controllers/base/log");
const baseToken = require("../../../controllers/base/token");
const moment = require("moment");
jest.mock("express-validator");
jest.mock("bcryptjs");
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
jest.mock("../../../controllers/base/log");
jest.mock("../../../controllers/base/token", () => {
    return {
        action: {
            createToken: jest.fn(),
            login: jest.fn(),
        },
    };
});

describe("controllers/action/auth", () => {
    let req, res, mockUser;
    mockUser = {
        us_username: "testuser",
        us_email: "testuser@example.com",
        us_password: expect.any(String),
        us_register: false,
        us_active: true,
        us_created_by: 1,
        us_created_on: expect.any(Date),
    };
    describe("action", () => {
        describe("register", () => {
            beforeEach(() => {
                req = {
                    body: {
                        us_username: "testuser",
                        us_email: "testuser@example.com",
                        us_password: "password123",
                        us_created_by: 1,
                    },
                };
                res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                    send: jest
                        .fn()
                        .mockReturnValue(
                            helper.response.createSuccessResponse("User was registered successfully!", mockUser)
                        ),
                };
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should return validation errors if validation fails", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(false),
                    array: jest.fn().mockReturnValue([{ msg: "Invalid email" }]),
                });
                await auth.action.register(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Invalid email" }] });
            });
            it("should store user and return success response 200", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "User was registered successfully!",
                    data: mockUser,
                });
                mockUser.us_id = 1;
                baseModel.models("User").store.mockResolvedValue(mockUser);
                await auth.action.register(req, res);
                expect(baseLog.action.register).toHaveBeenCalledWith(mockUser.us_id);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith(
                    "User was registered successfully!",
                    mockUser
                );
                expect(res.send).toHaveBeenCalledWith({
                    message: "User was registered successfully!",
                    data: mockUser,
                });
                delete mockUser["us_id"];
            });
            it("should return error response when no instance user", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Failed to create user",
                });
                baseModel.models("User").store.mockResolvedValue(undefined);
                await auth.action.register(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith("Failed to create user");
                expect(res.send).toHaveBeenCalledWith({
                    message: "Failed to create user",
                });
            });
            //     const mockRegisterUser = {
            //         log_type: "REGISTER",
            //         log_name: "Register New User (USER ID : 1)",
            //         log_description: "Register New User for Pokemon React Application",
            //         log_active: 1,
            //         log_created_on: "17/08/2024 19:39",
            //     };
            //     validationResult.mockReturnValue({
            //         isEmpty: jest.fn().mockReturnValue(true),
            //     });
            //     jest.spyOn(models.user, "store").mockResolvedValue(mockUser);
            //     jest.spyOn(models.log.action, "register").mockResolvedValue(mockRegisterUser);
            //     helper.response.createSuccessResponse.mockReturnValue({
            //         message: "User was registered successfully!",
            //         data: mockUser,
            //     });
            //     await auth.action.register(req, res);
            //     expect(console.log).toHaveBeenCalledWith(await models.log.action.register(mockUser.us_id));
            //     expect(res.status).toHaveBeenCalledWith(200);
            //     expect(helper.response.createSuccessResponse).toHaveBeenCalledWith(
            //         "User was registered successfully!",
            //         mockUser
            //     );
            //     expect(res.send).toHaveBeenCalledWith({
            //         message: "User was registered successfully!",
            //         data: mockUser,
            //     });
            // });
            it("should return error when occurs", async () => {
                const error = {
                    message: "Error validation",
                };
                validationResult.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                await auth.action.register(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
                expect(res.send).toHaveBeenCalledWith({
                    message: error.message,
                    status: "failed",
                });
            });
        });
        describe("login", () => {
            let mockToken, mockExpiresIn, mockOptions, mockLoginInfo;
            beforeEach(() => {
                mockToken = "token123";
                mockExpiresIn = 86400;
                mockOptions = {
                    path: "/",
                    sameSite: true,
                    maxAge: 1000 * mockExpiresIn /** would expire after 24 hours */,
                    httpOnly: false /** The cookie only accessible by the web server */,
                    secure: false,
                };
                mockLoginInfo = {
                    us_id: 1,
                    us_username: mockUser.us_username,
                    us_email: mockUser.us_email,
                    status: "success",
                    message: "user logged in",
                    path: "/",
                };
                req = {
                    body: {
                        us_email: "testuser@example.com",
                        us_password: "Phintraco123!",
                        remember_me: false,
                    },
                };
                res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                    cookie: jest.fn().mockReturnThis(),
                    send: jest
                        .fn()
                        .mockReturnValue(
                            helper.response.createSuccessResponse("User was registered successfully!", mockUser)
                        ),
                };
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should return validation errors if validation fails", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(false),
                    array: jest.fn().mockReturnValue([{ msg: "Invalid email" }]),
                });
                await auth.action.login(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Invalid email" }] });
            });
            it("should return 404 if no user found", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                baseModel.models("User").findOne.mockResolvedValue(undefined);
                helper.response.createFailedResponse.mockReturnValue({
                    message: "User not found",
                    status: "failed",
                });
                await auth.action.login(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith("User not found");
                expect(res.send).toHaveBeenCalledWith({
                    message: "User not found",
                    status: "failed",
                });
            });
            it("should return 401 if password invalid", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                mockUser.us_id = 1;
                baseModel.models("User").findOne.mockResolvedValue(mockUser);
                helper.response.createFailedResponse.mockReturnValue({
                    message: "Invalid Password!",
                    status: "failed",
                    detail: { accessToken: null },
                });
                bcrypt.compareSync.mockReturnValue(false);
                await auth.action.login(req, res);
                expect(res.status).toHaveBeenCalledWith(401);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith("Invalid Password!", {
                    accessToken: null,
                });
                expect(res.send).toHaveBeenCalledWith({
                    message: "Invalid Password!",
                    status: "failed",
                    detail: { accessToken: null },
                });
            });
            it("should store token with expires in a day to database when created", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                mockUser.us_id = 1;
                baseModel.models("User").findOne.mockResolvedValue(mockUser);
                bcrypt.compareSync.mockReturnValue(true);
                baseToken.action.createToken.mockReturnValue({
                    message: "Successfully create token",
                    status: "success",
                    data: mockToken,
                });
                await auth.action.login(req, res);
                expect(baseToken.action.login).toHaveBeenCalledWith(mockUser.us_id, mockToken, mockExpiresIn);
            });
            it("should store token with expires in a month to database when created", async () => {
                req.body.remember_me = true;
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                mockExpiresIn = mockExpiresIn * 30;
                mockUser.us_id = 1;
                baseModel.models("User").findOne.mockResolvedValue(mockUser);
                bcrypt.compareSync.mockReturnValue(true);
                baseToken.action.createToken.mockReturnValue({
                    message: "Successfully create token",
                    status: "success",
                    data: mockToken,
                });
                await auth.action.login(req, res);
                expect(baseToken.action.login).toHaveBeenCalledWith(mockUser.us_id, mockToken, mockExpiresIn);
            });
            it("should store login log to database when success", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                mockUser.us_id = 1;
                baseModel.models("User").findOne.mockResolvedValue(mockUser);
                bcrypt.compareSync.mockReturnValue(true);
                baseToken.action.createToken.mockReturnValue({
                    message: "Successfully create token",
                    status: "success",
                    data: mockToken,
                });
                await auth.action.login(req, res);
                expect(baseToken.action.login).toHaveBeenCalledWith(mockUser.us_id, mockToken, mockExpiresIn);
                expect(baseLog.action.login).toHaveBeenCalledWith(mockUser.us_id);
            });
            it("should set user-info and x-access-token to cookie when success", async () => {
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                mockUser.us_id = 1;
                baseModel.models("User").findOne.mockResolvedValue(mockUser);
                bcrypt.compareSync.mockReturnValue(true);
                baseToken.action.createToken.mockReturnValue({
                    message: "Successfully create token",
                    status: "success",
                    data: mockToken,
                });
                mockLoginInfo.token = mockToken;
                await auth.action.login(req, res);
                expect(baseToken.action.login).toHaveBeenCalledWith(mockUser.us_id, mockToken, mockExpiresIn);
                expect(baseLog.action.login).toHaveBeenCalledWith(mockUser.us_id);
                expect(res.cookie).toHaveBeenCalledWith("user-info", JSON.stringify(mockLoginInfo), mockOptions);
                expect(res.cookie).toHaveBeenCalledWith("x-access-token", mockToken, mockOptions);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.send).toHaveBeenCalledWith(mockLoginInfo);
            });
            it("should return error response when occurs", async () => {
                const error = {
                    message: "Error create token",
                };
                validationResult.mockReturnValue({
                    isEmpty: jest.fn().mockReturnValue(true),
                });
                mockUser.us_id = 1;
                baseModel.models("User").findOne.mockResolvedValue(mockUser);
                bcrypt.compareSync.mockReturnValue(true);
                baseToken.action.createToken.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                await auth.action.login(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
                expect(res.send).toHaveBeenCalledWith({
                    message: error.message,
                    status: "failed",
                });
            });
        });
        describe("logout", () => {
            let mockToken;
            beforeEach(() => {
                mockToken = "token123";
                req = {
                    body: {
                        us_email: "testuser@example.com",
                        us_password: "Phintraco123!",
                        remember_me: false,
                    },
                    cookies: {
                        "x-access-token": mockToken,
                    },
                };
                res = {
                    status: jest.fn().mockReturnThis(),
                    clearCookie: jest.fn(),
                    send: jest
                        .fn()
                        .mockReturnValue(
                            helper.response.createSuccessResponse("User was registered successfully!", mockUser)
                        ),
                };
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should return failed logout message when tkn_active undefined/null/failed", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: false });
                await auth.action.logout(req, res);
                expect(res.send).toHaveBeenCalledWith(helper.response.createFailedResponse("Failed to logout"));
            });
            it("should update tkn_active to false when tkn_active is valid", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: true });
                await auth.action.logout(req, res);
                expect(baseModel.models("Token").update).toHaveBeenCalledWith(
                    { tkn_active: false },
                    { where: { tkn_value: mockToken } }
                );
            });
            it("should clear cookies when tkn_active is valid", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: true });
                await auth.action.logout(req, res);
                expect(baseModel.models("Token").update).toHaveBeenCalledWith(
                    { tkn_active: false },
                    { where: { tkn_value: mockToken } }
                );
                expect(res.clearCookie).toHaveBeenCalledWith("x-access-token");
                expect(res.clearCookie).toHaveBeenCalledWith("user-info");
            });
            it("should return success response with 200", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: true });
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "Logout successfully",
                    status: "success",
                });
                await auth.action.logout(req, res);
                expect(baseModel.models("Token").update).toHaveBeenCalledWith(
                    { tkn_active: false },
                    { where: { tkn_value: mockToken } }
                );
                expect(res.clearCookie).toHaveBeenCalledWith("x-access-token");
                expect(res.clearCookie).toHaveBeenCalledWith("user-info");
                expect(res.status).toHaveBeenCalledWith(200);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("Logout successfully");
                expect(res.send).toHaveBeenCalledWith({
                    message: "Logout successfully",
                    status: "success",
                });
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create token",
                };
                baseModel.models("Token").findOne.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                await auth.action.logout(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(helper.response.createFailedResponse).toHaveBeenCalledWith(error.message);
                expect(res.send).toHaveBeenCalledWith({
                    message: error.message,
                    status: "failed",
                });
            });
        });
        describe("changePassword", () => {
            let mockToken;
            beforeEach(() => {
                mockToken = "token123";
                req = {
                    body: {
                        us_id: 1,
                        us_password: "Phintraco123!",
                        token: mockToken,
                    },
                };
                res = {
                    status: jest.fn().mockReturnThis(),
                    send: jest
                        .fn()
                        .mockReturnValue(
                            helper.response.createSuccessResponse("User was registered successfully!", mockUser)
                        ),
                };
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });
            it("should return failed change password message when tkn_active undefined/null/false", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: false });
                await auth.action.changePassword(req, res);
                expect(res.send).toHaveBeenCalledWith(helper.response.createFailedResponse("Failed to update user password"));
            });
            it("should update user password", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: true });
                bcrypt.hashSync.mockReturnValue("129349239472398");
                await auth.action.changePassword(req, res);
                expect(baseModel.models("User").update).toHaveBeenCalledWith( {
                    us_password: "129349239472398",
                    us_register: true,
                    us_updated_on: moment().format(),
                },
                { where: { us_id: 1 } });
            });
            it("should update token change password", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: true });
                bcrypt.hashSync.mockReturnValue("129349239472398");
                await auth.action.changePassword(req, res);
                expect(baseModel.models("User").update).toHaveBeenCalledWith( {
                    us_password: "129349239472398",
                    us_register: true,
                    us_updated_on: moment().format(),
                },
                { where: { us_id: 1 } });
                expect(baseModel.models("Token").update).toHaveBeenCalledWith( { tkn_active: false }, { where: { tkn_value: mockToken } });
            });
            it("should return change password success message with status 200", async () => {
                baseModel.models("Token").findOne.mockResolvedValue({ tkn_active: true });
                bcrypt.hashSync.mockReturnValue("129349239472398");
                helper.response.createSuccessResponse.mockReturnValue({
                    message: "User Password updated successfully!",
                    status: "success",
                })
                await auth.action.changePassword(req, res);
                expect(baseModel.models("User").update).toHaveBeenCalledWith( {
                    us_password: "129349239472398",
                    us_register: true,
                    us_updated_on: moment().format(),
                },
                { where: { us_id: 1 } });
                expect(baseModel.models("Token").update).toHaveBeenCalledWith( { tkn_active: false }, { where: { tkn_value: mockToken } });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(helper.response.createSuccessResponse).toHaveBeenCalledWith("User Password updated successfully!");
                expect(res.send).toHaveBeenCalledWith({
                    message: "User Password updated successfully!",
                    status: "success",
                });
            });
            it("should return errors when occurs", async () => {
                const error = {
                    message: "Error create token",
                };
                baseModel.models("Token").findOne.mockImplementation(() => {
                    throw new Error(error.message);
                });
                helper.response.createFailedResponse.mockReturnValue({
                    message: error.message,
                    status: "failed",
                });
                await auth.action.changePassword(req, res);
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
