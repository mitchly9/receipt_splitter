import axios from "axios";

export const axiosGet = (url) => {
  return axios
    .get(`https://groceryapp-5e433-default-rtdb.firebaseio.com/${url}.json`)
    .catch((error) => {
      console.log(error);
    });
};

export const axiosPut = (url, data) => {
  return axios
    .put(
      `https://groceryapp-5e433-default-rtdb.firebaseio.com/${url}.json`,
      data
    )
    .catch((error) => {
      console.log(error);
    });
};

export const axiosPatch = (url, data) => {
  return axios
    .patch(
      `https://groceryapp-5e433-default-rtdb.firebaseio.com/${url}.json`,
      data
    )
    .catch((error) => {
      console.log(error);
    });
};

export const deleteBranch = (deleteFromURL) => {
  return axiosGet(deleteFromURL).then((returnedData) => {
    let keys = Object.keys(returnedData.data);
    let copiedDataNull = returnedData.data;
    for (let i = 0; i < keys.length; i++) {
      copiedDataNull[keys[i]] = null;
    }
    axiosPut(deleteFromURL, copiedDataNull);
  });
};

export const moveBranch = (deleteFromURL, moveToURL) => {
  return axiosGet(deleteFromURL).then((returnedData) => {
    let keys = Object.keys(returnedData.data);
    let copiedDataNull = { ...returnedData.data };
    for (let i = 0; i < keys.length; i++) {
      copiedDataNull[keys[i]] = null;
    }
    axiosPut(deleteFromURL, copiedDataNull);
    axiosPut(moveToURL, returnedData.data).catch((error) => console.log(error));
  });
};

export const deleteEntry = (deleteFromURL, entryToDelete) => {
  let deleteEntry = {};
  deleteEntry[entryToDelete] = null;
  return axiosPatch(deleteFromURL, deleteEntry);
};

export const addOrEditSingleEntry = (url, entry, value) => {
  let entryToAdd = {};
  entryToAdd[entry] = value;
  return axiosPatch(url, entryToAdd);
};
