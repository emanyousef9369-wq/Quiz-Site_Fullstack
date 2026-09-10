import { authService } from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const signup = catchAsync(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  res.status(201).json({ data: { user, token } });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.status(200).json({ data: { user, token } });
});
