import { create } from "zustand";

export type newStateType = {
  name: string;
  id: number;
  active: boolean;
};

export type dataType = {
  data: newStateType[];
  addData: (newState: newStateType) => void;
  removeData: (id: number) => void;
  updateName: (newState: newStateType) => void;
  toggle: (newState: newStateType) => void;
  getActiveData: () => void;
  activeAll: () => void;
};

export const useDataStore = create<dataType>((set) => ({
  data: [],
  addData: (newState: newStateType) => {
    set((state) => ({ data: [...state.data, newState] }));
  },
  removeData: (id: number) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },
  updateName: (newState: newStateType) => {
    set((state) => ({
      data: state.data.map((item) =>
        item.id === newState.id ? { ...item, name: newState.name } : item
      ),
    }));
  },
  toggle: (newState: newStateType) => {
    set((state) => {
      return {
        data: state.data.map((item) =>
          item.id === newState.id ? { ...item, active: !newState.active } : item
        ),
      };
    });
  },
  getActiveData: () => {
    set((state) => ({
      data: state.data.filter((item) => item.active),
    }));
  },
  activeAll: () => {
    set((state) => ({
      data: state.data.map(item => {
        if(state.data.findIndex(i => i.active) > -1) {
          return {...item, active: false}
        }
        return {...item, active: true}
      })
    }));
  }
}));
