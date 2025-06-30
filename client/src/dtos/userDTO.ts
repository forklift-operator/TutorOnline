
export interface UserDTO {
    name: string;
    username: string;
    email: string;
    roles: string[];
    profile_pic: string;
    createdAt: Date;
}

export type UserCreateDTO = Omit<UserDTO, "_id"> & {
    password: string;
};