
import { Appbar } from '../components/Appbar';
import { BlogCard } from '../components/BlogCard';
import { BlogSkeleton } from '../components/BlogSkeleton';
import { useBlogs } from '../hooks/index';
export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if(loading) {
        return <div>
            <Appbar/>
            <div className='flex justify-center'>
            <div>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            </div>
            </div>
        </div>
    }
    return <div>
    <Appbar/>
    <div className='flex justify-center'>
    <div >
        {
            blogs.map((blog) => (
                <BlogCard
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    id={blog.id}
                    publishedDate='2023-10-01' 
                />
            ))

        }
        {/* <BlogCard
            authorName="John Doe"
            title="Understanding React Hooks"
            content="React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become a fundamental part of React development. Hooks allow you to manage state, side effects, context, and more in functional components, making your code cleaner and more reusable."
            publishedDate="2023-10-01"
            id={1}
        /> */}
    </div>
    </div>
    </div>
}