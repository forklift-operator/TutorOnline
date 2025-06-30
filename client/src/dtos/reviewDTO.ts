
export interface ReviewDTO {
    userId: string;
    fromUser: string;
    content: string;
    rating: number;
    createdAt: Date;
}