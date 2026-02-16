export function initSidebar(onToggle) {
  const sidebar = document.getElementById('sidebar');
  const hideBtn = document.getElementById('toggleSidebar');
  const showBtn = document.getElementById('showFiltersBtn');

  let visible = true;

  const update = () => {
    sidebar.classList.toggle('d-none', !visible);
    showBtn.classList.toggle('d-none', visible);
    onToggle(visible);
  };

  hideBtn?.addEventListener('click', () => {
    visible = false;
    update();
  });

  showBtn?.addEventListener('click', () => {
    visible = true;
    update();
  });

  update();
}
