export const Teams = {
  saveToLocal(teams) {
    localStorage.setItem('culinary_teams', JSON.stringify(teams));
  },

  loadFromLocal() {
    const data = localStorage.getItem('culinary_teams');
    return data ? JSON.parse(data) : null;
  }
};
