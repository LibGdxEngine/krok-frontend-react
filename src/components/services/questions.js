import axiosInstance from "../axiosInstance";
import queryString from "query-string";

export const getLanguages = async (token) => {
  try {
    const response = await axiosInstance.get("/v1/questions/languages/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getSpecificities = async (token) => {
  try {
    const response = await axiosInstance.get("/v1/questions/specificities/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getLevels = async (token) => {
  try {
    const response = await axiosInstance.get("/v1/questions/levels/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getYears = async (token, state) => {
  try {
    const response = await axiosInstance.get(
      `/v1/questions/years/?language=${state.language}&specificity=${state.specificity}&level=${state.level}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting years:", error);
    throw error;
  }
};

export const getSubjects = async (token, state) => {
  try {
    const response = await axiosInstance.get(
      `/v1/questions/subjects/?language=${state.language}&specificity=${state.specificity}&level=${state.level}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting years:", error);
    throw error;
  }
};

export const getSystems = async (token, state) => {
  try {
    const response = await axiosInstance.get(
      `/v1/questions/systems/?language=${state.language}&specificity=${state.specificity}&level=${state.level}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting years:", error);
    throw error;
  }
};

export const getTopics = async (token, state) => {
  try {
    const response = await axiosInstance.get(
      `/v1/questions/topics/?language=${state.language}&specificity=${state.specificity}&level=${state.level}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting topics:", error);
    throw error;
  }
};

export const createExamJourney = async (token, examData) => {
  try {
    const response = await axiosInstance.post(
      "/v1/questions/create-exam-journey/",
      examData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error create exam:", error);
    throw error;
  }
};

export const updateExamJourney = async (token, examId, examData) => {
  try {
    const response = await axiosInstance.patch(
      `/v1/questions/update-exam-journey/${examId}/`,
      {
        examData,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error update exam:", error);
    throw error;
  }
};

export const getExamJourney = async (token, examId) => {
  try {
    const response = await axiosInstance.get(
      `/v1/questions/exam-journeys/${examId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log("exam journy :", response.data);

    return response.data;
  } catch (error) {
    console.error("Error getting exam:", error);
    throw error;
  }
};

export const getUserHistoryExams = async (token) => {
  try {
    const response = await axiosInstance.get(`/v1/questions/exam-journeys/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting exam:", error);
    throw error;
  }
};

export const deleteExamJourney = async (token, examId) => {
  try {
    const response = await axiosInstance.delete(
      `/v1/questions/exam-journeys/${examId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting topics:", error);
    throw error;
  }
};

export const getFavouritesLists = async (token) => {
  try {
    const response = await axiosInstance.get("/v1/questions/favorites/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error create exam:", error);
    throw error;
  }
};

export const deleteFavouritesList = async (token, listId) => {
  try {
    const response = await axiosInstance.delete(
      `/v1/questions/favorites/${listId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error create exam:", error);
    throw error;
  }
};

// export const getSingleFavouritesListDetails = async (token, listId) => {
//     try {
//         const response = await axiosInstance.get(`/v1/questions/favorites/${listId}/`, {
//             headers: {
//                 Authorization: `Token ${token}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error create exam:', error);
//         throw error;
//     }
// };

export const createFavoriteList = async (token, listData) => {
  try {
    const response = await axiosInstance.post(
      "/v1/questions/favorites/",
      listData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error create exam:", error);
    throw error;
  }
};

export const addQuestionToFavoritesList = async (token, listId, questionId) => {
  try {
    const response = await axiosInstance.post(
      `/v1/questions/favorites/${listId}/add_question/`,
      { question_id: questionId },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const getNotes = async (token) => {
  try {
    const response = await axiosInstance.get(`/v1/questions/notes/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const getUniversities = async (token) => {
  try {
    const response = await axiosInstance.get(`/v1/questions/university/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const deleteNote = async (token, noteId) => {
  try {
    const response = await axiosInstance.delete(
      `/v1/questions/notes/${noteId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const createNewNote = async (token, note, question) => {
  try {
    const response = await axiosInstance.post(
      `/v1/questions/notes/`,
      { question, note_text: note },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const createNewReport = async (token, report, question) => {
  try {
    const response = await axiosInstance.post(
      `/v1/questions/reports/`,
      { question, reason: report },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const updateProfile = async (token, profileData) => {
  try {
    const response = await axiosInstance.patch(
      `/v1/profiles/me/update/`,
      profileData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const getQuestionsCount = async (token, questionData) => {
  try {
    const queryString = new URLSearchParams(questionData).toString();
    const response = await axiosInstance.get(
      `/v1/questions/count/?${queryString}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding question to list:", error);
    throw error;
  }
};

export const searchForquestions = async (token, query) => {
  try {
    console.log("step-1");

    const response = await axiosInstance.get(
      `/v1/questions/search/?q=${query}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log("step-2");

    return response.data;
  } catch (error) {
    console.log("step-3");

    console.error("Error adding question to list:", error);
    throw error;
  }
};
