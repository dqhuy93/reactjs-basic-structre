import { fetchApi } from '../utils/apiCaller';
import { user } from '../constants/actions';

export const fetchUserSuccess = (payload) => {
  return {
    type: user.FETCH_USER_SUCCESS,
    payload,
  };
};

export const actGetUser = () => {
  return async (dispatch) => {
    return fetchApi('https://jsonplaceholder.typicode.com/users', 'GET').then(
      (response) => {
        dispatch(fetchUserSuccess(response.data));
      },
      (error) => {
        console.log(error);
      }
    );
  };
};

/**
 *
 * @param {string} value : value input typing
 * fake api delay 4s
 * http://slowwly.robertomurray.co.uk/delay/3000/url/https://jsonplaceholder.typicode.com/posts/1
 */
export const mockApiDelay = async (value, tokenCancel) => {
  // value : chứa giá trị của input

  // randomId để call mock api, chỉ để test cho dễ hiểu
  const randomId = Math.floor(Math.random() * 100) + 1;

  return fetchApi(
    'http://slowwly.robertomurray.co.uk/delay/4000/url/https://jsonplaceholder.typicode.com/posts/' +
      randomId,
    'GET',
    null,
    null,
    tokenCancel
  );
};
