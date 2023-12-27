import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';
import Joi from 'joi';

export const useListStore = defineStore('ListStore', {
  state: () => {
    return {
      isLoading: false,
      selectedList: [],
      lists: [],
    };
  },
  actions: {
    async populateListStoreFromQuery(query) {
      console.log('Populating ListStore state from query');

      if (!query.page) {
        console.log("No 'page' query param, using default page");
      } else {
        this.currentPage = parseInt(query.page);
      }

      if (!query.sortOrder) {
        console.log("No 'sortOrder' query param, using default sort order");
      } else {
        this.sortOrder = query.sortOrder;
      }

      if (!query.sortType) {
        console.log("No 'sortType' query param, using default sort type");
      } else {
        this.sortType = query.sortType;
      }
    },
    //  --- LISTS---
    async getAllLists() {
      this.isLoading = true;

      try {
        // GET ALL LISTS 
        const url = `/api/lists`;
        console.log(`GET ${url}`);
        const res = await this.$axios.get(url);
        console.log(res.data);
        this.lists = res.data.lists;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async createList({ title, description }) {
      this.isLoading = true;

      console.log('Creating List!');

      try {
        // CREATE MOVIE LIST 
        const data = {
          title,
          description,
        };

        const res = await this.$axios.post(`/api/lists`, data);
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async updateList({ title, description}) {
      this.isLoading = true;

      try {
        // CREATE LIST 
        const res = await this.$axios.put(`/api/lists/${this.selectedList.id}`, {
          title,
          description,
        });
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async deleteList() {
      this.isLoading = true;
      try {
        // DELETE LIST 
        const res = await this.$axios.delete(`/api/lists/${this.selectedList.id}`);
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListStore, import.meta.hot));
}
