import { Response, Request } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    
    const data = req.body;
    const createUserSerivce = new CreateUserService();

    const user = await createUserSerivce.execute(data);
    res.status(201).json(user);
  }
}

export { CreateUserController };
