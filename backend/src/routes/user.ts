import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from 'hono/jwt'
import { signupInput, signinInput } from "@lizagarg/echoverse";
export const userRouter= new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

userRouter.post('/signup', async(c) => {
  const body= await c.req.json();
  const {success}= signupInput.safeParse(body);
  if(!success) {
    c.status(400);
    return c.json({
      message: "Invalid input"
    })
    }

  const prisma= new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
        try{

    const user= await prisma.user.create({
      data:{
        username: body.username,
        password: body.password,
        name: body.name
      }
    })
    const jwt= await sign({
      id:user.id
    },c.env.JWT_SECRET)

    return c.text(jwt);
  } catch(e) {
    c.status(411);
    return c.text('User already exists with this email');
  }
  }
  catch(e) {
    c.status(500);
    return c.text('Database connection error');
  }

  
})


userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) { 
        c.status(400);
        return c.json({
            message: "Invalid input"
        });
    }
	const user = await prisma.user.findUnique({
		where: {
			username: body.username,
      password: body.password,
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})
