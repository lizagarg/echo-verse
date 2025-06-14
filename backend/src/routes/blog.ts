import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@lizagarg/echoverse";

export const blogRouter= new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*",async(c,next)=>{
    //extract user id and pass
    const authHeader= c.req.header("authorization") || "";
    const user= await verify(authHeader,c.env.JWT_SECRET);
    if(user) {
        c.set("userId", String(user.id));
        await next();
    } else {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
})

blogRouter.post('/', async(c) => {
  const body= await c.req.json();
  const {success}= createBlogInput.safeParse(body);
  if(!success) {
    c.status(400);
    return c.json({
      message: "Invalid input"
    })
  }

  const authorId= c.get("userId")
  const prisma= new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog= await prisma.blog.create({
    data:{
        title: body.title,
        content: body.content,
        authorId: Number(authorId)
    }
  })
  return c.json({id:blog.id})
})

blogRouter.put('/', async(c) => {
  const body= await c.req.json();
  const {success}= updateBlogInput.safeParse(body);
  if(!success) {
    c.status(400);
    return c.json({
      message: "Invalid input"
    })
  }

  const prisma= new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog= await prisma.blog.update({
    where:{
        id:body.id
    },
    data:{
        title: body.title,
        content: body.content,
    }
  })
  return c.json({id:blog.id})
})

blogRouter.get('/bulk',async (c) => {
  const prisma= new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    const blogs= await prisma.blog.findMany({
        select:{
            content: true,
            title: true,
            id: true,
            author: {
                select:{
                    name: true,
                }
            }
        }
    });
    return c.json({blogs})
  } catch(e) {
    c.status(411);
    return c.json({message: "error while fetching blog posts"});
  }
})

blogRouter.get('/:id', async(c) => {
  const id= await c.req.param("id");
  const prisma= new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    const blog= await prisma.blog.findFirst({
        where:{
            id:Number(id)
        },
        select:{
            id: true,
            content: true,
            title: true,
            author: {
                select:{
                    name: true,
                }
            }
        }
    });
    return c.json({blog})
  } catch(e) {
    c.status(411);
    return c.json({message: "error while fetching blog post"});
  }
})


