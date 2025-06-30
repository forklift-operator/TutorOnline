import type { IUser } from "../../../server/src/db/model/userModel";

export type Credentials = {
    username: string;
    password: string;
}

export type HTTPResponse = {
    status: number,
    message: string,
    access_token?: string,
    new_access_token?: string,
    user?: IUser
}

export type Message = {
    sender: {id: string, username: string},
    content: string,
    createdAt: Date,
}

export const defaultUserImg = "https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg";
export const defaultCourseImg = "https://img.freepik.com/premium-vector/school-vector-seamless-pattern-blue-line-art-stationery-doodle-education-background-study_193606-578.jpg";
