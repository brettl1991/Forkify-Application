import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js ';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//get data
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    console.log('res', res);

    const data = await res.json();
    console.log('data:', data);
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //result value of the promise
  } catch (err) {
    throw err;
  }
};
