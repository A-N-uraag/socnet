import Comment from "./comment"

interface post{
    pid: number;
    author: number;
    createdDate: Date;
    content: string;
    likes: number;
    reposts: number;
    noOfReports?: number;
    comments?: Comment[];
}

export default post;