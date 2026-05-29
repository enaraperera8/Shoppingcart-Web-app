import * as authService from "../services/authService.js";

export async function register(request, response) {
  const session = await authService.register(request.body);
  response.status(201).json(session);
}

export async function login(request, response) {
  const session = await authService.login(request.body);
  response.json(session);
}

export async function adminLogin(request, response) {
  const session = await authService.adminLogin(request.body);
  response.json(session);
}

export async function adminRegister(request, response) {
  const session = await authService.adminRegister(request.body);
  response.status(201).json(session);
}

export async function googleLogin(request, response) {
  const session = await authService.googleLogin(request.body);
  response.json(session);
}

export async function facebookLogin(request, response) {
  const session = await authService.facebookLogin(request.body);
  response.json(session);
}

export async function passkeyRegisterOptions(request, response) {
  const options = await authService.passkeyRegisterOptions(request.user);
  response.json(options);
}

export async function passkeyRegisterVerify(request, response) {
  const result = await authService.passkeyRegisterVerify(request.user, request.body);
  response.status(201).json(result);
}

export async function passkeyLoginOptions(request, response) {
  const options = await authService.passkeyLoginOptions(request.body);
  response.json(options);
}

export async function passkeyLoginVerify(request, response) {
  const session = await authService.passkeyLoginVerify(request.body);
  response.json(session);
}
