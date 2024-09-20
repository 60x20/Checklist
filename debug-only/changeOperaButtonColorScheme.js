// to solve a rendering error, buttons will use light-theme on Opera
const isOpera = navigator.userAgent.indexOf(' OPR/') >= 0;
if (isOpera) {
  const style = document.createElement('style');
  style.innerText = 'button:not(#theme-toggler) { color-scheme: light; }';
  document.head.append(style);
}
