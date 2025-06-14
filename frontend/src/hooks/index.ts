import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export interface Blog {
  content: string;
  title: string;
  id: number;
  author: {
    name?: string;
  };
}

export const useBlog = ({id}:{id:string}) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null);
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
        })
        .then(response=>{
            setBlog(response.data.blog);
            setLoading(false);
        })
    })
    return {
        loading,
        blog,
    }
    
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get("https://backend.lizagarg5.workers.dev/api/v1/blog/bulk", {
        headers: {
          Authorization: localStorage.getItem('token')|| '',
        },
      })
      .then((response) => {
        console.log('✅ API Response:', response.data);
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ API Request Error:', error);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};
