import { createSlice } from "@reduxjs/toolkit";

const leadSclice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    engineer_taskCounts: [],
    deletedLeads: [],
  },
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    setEngineerTaskCounts: (state, action) => {
      state.engineer_taskCounts = action.payload;
    },
    updateLead: (state, action) => {
      const { id, changes } = action.payload;
      const index = state.leads.findIndex((lead) => lead._id === id);
      if (index !== -1) {
        state.leads[index] = { ...state.leads[index], ...changes };
      }
      
    },

    createLead: (state, action) => {
      const exists = state.leads.some(
        (lead) => lead._id === action.payload._id
      );
      if (!exists) {
        state.leads.push(action.payload);
      }
    },

    addnote: (state, action) => {
      const { id, note } = action.payload;
      const lead = state.leads.find((lead) => lead._id === id);
      if (lead) {
        lead.notes.push(note);
      }
    },
    getAllDeletedLeads: (state, action) => {
      state.deletedLeads = action.payload;
    },
  },
});

export const {
  setLeads,
  updateLead,
  createLead,
  addnote,
  setEngineerTaskCounts,
} = leadSclice.actions;

export default leadSclice.reducer;
