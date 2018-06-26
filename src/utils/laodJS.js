export default function loadJS(src) {
  let ref = window.document.getElementsByTagName('body')[0];
  let script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
}
