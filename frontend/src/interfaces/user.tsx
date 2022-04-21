import Profile from "./profile"

interface User{
    uid: number;
    email: string;
    profile: Profile;
    posts: number[];
    followers: number[];
    followees: number[];
}

export default User;