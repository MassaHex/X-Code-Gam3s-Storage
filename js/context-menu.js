const html = document.querySelector('html');
let contextMenu;

html.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  
  // Check if the context menu already exists, and remove it if it does
  if (contextMenu) {
    contextMenu.remove();
  }

  contextMenu = document.createElement('div');
  contextMenu.id = 'custom-context-menu';

  const changeWallpaperOption = document.createElement('div');
  changeWallpaperOption.classList.add('context-menu-option');
  changeWallpaperOption.innerText = 'Change Wallpaper';

  changeWallpaperOption.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', function() {
        const wallpaper = this.result;
        document.getElementById('window').style.backgroundImage = `url(${wallpaper})`;
        localStorage.setItem('wallpaper', wallpaper);
      });
      reader.readAsDataURL(file);
    });
    fileInput.click();
  });

  const toggleDarkModeOption = document.createElement('div');
  toggleDarkModeOption.classList.add('context-menu-option');
  toggleDarkModeOption.innerText = 'Toggle Dark Mode';

  toggleDarkModeOption.addEventListener('click', function() {
    const html = document.querySelector('html');
    const currentBrightness = html.style.filter ? parseFloat(html.style.filter.replace('brightness(', '').replace(')', '')) : 1;
    const newBrightness = currentBrightness === 1 ? 0.5 : 1;
    html.style.filter = `brightness(${newBrightness})`;
    Cookies.set('darkMode', newBrightness === 0.5);
  });

  contextMenu.appendChild(changeWallpaperOption);
  contextMenu.appendChild(toggleDarkModeOption);

  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.style.left = `${e.clientX}px`;

  html.appendChild(contextMenu);

  document.addEventListener('click', function() {
    if (contextMenu) {
      contextMenu.remove();
      contextMenu = null;
    }
  });
});

// Load the saved wallpaper
const savedWallpaper = localStorage.getItem('wallpaper');
if (savedWallpaper) {
  document.getElementById('window').style.backgroundImage = `url(${savedWallpaper})`;
}

// Load the saved dark mode setting
const isDarkMode = Cookies.get('darkMode');
if (isDarkMode === 'true') {
  document.querySelector('html').style.filter = 'brightness(0.5)';
}
