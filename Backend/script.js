const check = document.querySelector('#check');
const screen = document.querySelector('.screen');

check.addEventListener('click', (e) => {
  // const esCocher = e.target.checked;
  const text = document.querySelector('#text').value;
  console.log(text);

  const newE = document.querySelector("#result").append(text);
  // const result = document.querySelector('#result').innerHTML = text;
})

const del = document.querySelector('#del');

del.addEventListener('click', (e) => {
  // const esCocher = e.target.checked;
  const text = document.querySelector('#text').value;
  console.log(text);

  const result = document.querySelector('#result').innerHTML = "";
});