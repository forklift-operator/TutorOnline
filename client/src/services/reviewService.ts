import type { ReviewDTO } from "../dtos/reviewDTO";
import type ApiClient from "./apiClient";

export default class ReviewService {
    private apiClient: ApiClient;
    constructor(apiClient: ApiClient) { this.apiClient = apiClient };

    async findAll(filter: { userId: string }): Promise<ReviewDTO[]> { // make the filter model with tags, limit, whatever
        return this.apiClient.findAll('review', filter);
    }

    async create(review: ReviewDTO): Promise<ReviewDTO> {
        return this.apiClient.create('review', review);
    }

    async update(review: ReviewDTO): Promise<ReviewDTO> {
        return this.apiClient.update('review', review);
    }

    async deleteById(id: string): Promise<ReviewDTO> {
        return this.apiClient.deleteById('review', id);
    }

}
