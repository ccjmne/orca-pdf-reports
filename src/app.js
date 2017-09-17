import './styles/app.scss';

const myVar = (() => {
  'use strict';
  return Math.ceil(Math.random() * 10);
})();

const p = document.createElement('p');
p.innerText = 'myVar = ' + myVar;
document.body.appendChild(p);
