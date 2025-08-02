// to avoid errors when multiple instances change the storage
// errors might occur if multiple instances change the same date or a shared storage item
window.addEventListener('storage', () => {
  location.reload();
});
