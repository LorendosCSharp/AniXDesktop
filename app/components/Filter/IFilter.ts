export interface IFilters {
    country: string | null;
    category: string | null;
    genres: string[];
    bookmarks: string[];
    studio: string | null;
    source: string | null;
    season: string | null;
    episode: string | null;
    status: string | null;
    episodeDuration: string | null;
    ageRating: string[];
    sort: string | null;
    fromYear: number | null;
    toYear: number | null;
    excludeGenres: boolean | false;
}
