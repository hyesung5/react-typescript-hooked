import React, { useEffect, useReducer } from 'react';
import '../App.css';
import Header from './Header/Header';
import Movie from './Movie/Movie';
import Search from './Search/Search';

type HNResponse = {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
};

type State = {
    loading: boolean;
    movies: HNResponse[];
    errorMessage: string;
};

type Action =
    | { type: 'SEARCH_MOVIES_REQUEST' }
    | { type: 'SEARCH_MOVIES_SUCCESS'; result: HNResponse[] }
    | { type: 'SEARCH_MOVIES_FAILURE'; errorMessage: string };

const MOVIE_API_URL = 'https://www.omdbapi.com/?s=man&apikey=4a3b711b'; // you should replace this with yours
const initialState = {
    loading: true,
    movies: [],
    errorMessage: '',
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SEARCH_MOVIES_REQUEST':
            return {
                ...state,
                loading: true,
                errorMessage: '',
            };
        case 'SEARCH_MOVIES_SUCCESS':
            return {
                ...state,
                loading: false,
                movies: action.result,
            };
        case 'SEARCH_MOVIES_FAILURE':
            return {
                ...state,
                loading: false,
                errorMessage: action.errorMessage,
            };
        default:
            return state;
    }
};

const App: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchData();
    }, []);

    //영화 목록 출력 함수
    const fetchData = async () => {
        dispatch({ type: 'SEARCH_MOVIES_REQUEST' });
        const response = await fetch(MOVIE_API_URL);
        const data = await response.json();
        if (data.Response === 'True') {
            dispatch({
                type: 'SEARCH_MOVIES_SUCCESS',
                result: data.Search,
            });
        } else {
            dispatch({
                type: 'SEARCH_MOVIES_FAILURE',
                errorMessage: data.Error,
            });
        }
    };

    //영화 검색 함수
    const search = async (searchValue: string) => {
        dispatch({
            type: 'SEARCH_MOVIES_REQUEST',
        });

        const response = await await fetch(`http://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`);
        const search_data = await response.json();

        if (search_data.Response === 'True') {
            dispatch({
                type: 'SEARCH_MOVIES_SUCCESS',
                result: search_data.Search,
            });
        } else {
            dispatch({
                type: 'SEARCH_MOVIES_FAILURE',
                errorMessage: search_data.Error,
            });
        }
    };

    const { movies, errorMessage, loading } = state;
    return (
        <div>
            <Header text="HOOKED" />
            <Search search={search} />
            <p className="App-intro">Sharing a few of our favourite movies</p>
            <div className="movies">
                {loading && !errorMessage ? (
                    <span>loading...</span>
                ) : errorMessage ? (
                    <div className="errorMessage">{errorMessage} </div>
                ) : (
                    movies.map((movie: any, index: number) => (
                        <Movie key={`${index}-${movie.Title}`} Title={movie.Title} Poster={movie.Poster} Year={movie.Year} />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
