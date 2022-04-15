function parseINIString(data){
  var regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*;.*$/,
    number: /\d*\.*/
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach(function(line){
    console.log(line)
    if (regex.comment.test(line)) {
      return;
    } else if(regex.param.test(line)){
      var match = line.match(regex.param);
      if (section) {
        value[section][match[1]] = match[2];
        if (regex.number.test(match[2])){
          let numMatch = match[2];
          value[section][match[1]] = parseInt(numMatch.substring(1, numMatch.length - 1));
        }
        console.log(value[section][match[1]]);

      } else {
        value[match[1]] = match[2];
      }
    } else if(regex.section.test(line)){
      var match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    } else if(line.length == 0 && section){
      section = null;
    };
  });
  return value;
}

function sortObject(o){
  let a = []
  for (let O in o) a.push([O, o[O]]);
  console.log(a);
  return a.sort((a,b)=> b[1] - a[1]);
}

function maxValues(o, n) {
  const values = Object.values(o).sort((a, b) => b - a);
  if (values.length <= n) return sortObject(o);
  console.log(n);
  const maxN = values[n - 1];
  let reduced = Object.entries(o).reduce((o, [k, v]) => v >= maxN ? { ...o, [k]: v } : o, {})
  return sortObject(reduced);
}

function iniLoaded(data) {
  console.log(data);
  let leaderboardData = parseINIString(data).users;
  console.log(leaderboardData);
  let top10 = maxValues(leaderboardData, 9);
  let leaderboardTarget = document.getElementById('leaderboard');
  for (let value in top10){
    let block = document.createElement('div');
    block.className = 'nameBlock';
    let title = document.createElement('span');
    title.innerText = top10[value][0];
    block.appendChild(title);
    let number = document.createElement('span');
    number.className = 'number';
    number.innerText = top10[value][1];
    block.appendChild(number);
    leaderboardTarget.appendChild(block)
  }
}

const openFile = (event) => {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = (input) =>{
    iniLoaded(reader.result, input);
  }
  reader.readAsText(input.files[0]);
};