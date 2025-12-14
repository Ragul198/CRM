import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: null,
    deletedUser: [],
    onlineUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    postLogin: (state, action) => {
      state.currentUser = action.payload.data;
    },
    putUser: (state, action) => {
      const updated = action.payload.data;

      state.users = state.users.map((u) =>
        u._id === updated._id ? updated : u
      );
    },
    postUser: (state, action) => {
      const newUser = action.payload.data;
      console.log("New user to be added:", newUser);
      // check if user with same _id already exists
      const exists = state.users.some((user) => user._id === newUser._id);

      if (!exists) {
        state.users.push(newUser);
      }
    },

    deleteUser: (state, action) => {
      const deleted = action.payload.data;
      state.users = state.users.filter((u) => u._id !== deleted._id);
    },
    getLogout: (state) => {
      state.currentUser = null;
      state.users = [];
    },
    putUserProfile: (state, action) => {
      const updatedProfile = action.payload.data;
      state.currentUser = updatedProfile;
      state.users = state.users.map((u) =>
        u._id === updatedProfile._id ? updatedProfile : u
      );
    },
    getAllDeletedUser: (state, action) => {
      state.deletedUser = action.payload.data;
    },

    getonlineUsers: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        // merge array
        payload.forEach((user) => {
          const index = state.onlineUsers.findIndex(
            (u) => u.userId === user.userId
          );
          if (index !== -1) state.onlineUsers[index] = user;
          else state.onlineUsers.push(user);
        });
      } else {
        // single user
        const index = state.onlineUsers.findIndex(
          (u) => u.userId === payload.userId
        );
        if (index !== -1) state.onlineUsers[index] = payload;
        else state.onlineUsers.push(payload);
      }
    },
  },
});
export const selectUsersWithStatus = (state) => {
  return state.users.users.map((u) => ({
    ...u,
    isOnline: state.users.onlineUsers.some(
      (ou) => ou.userId === u._id && ou.socketCount > 0
    ),
  }));
};

export const {
  setUsers,
  postLogin,
  putUser,
  postUser,
  deleteUser,
  getLogout,
  putUserProfile,
  getAllDeletedUser,
  getonlineUsers,
} = userSlice.actions;

export default userSlice.reducer;
