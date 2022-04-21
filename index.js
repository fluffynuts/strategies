async function readUserInput() {
  process.stdout.write("what do you say? ");
  return new Promise((resolve, reject) => {
    var readline = require("readline");
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on("line", function (line) {
      resolve(line.trim().toLowerCase());
    });
  });
}

const known = {
  quit: "quit",
  hello: "hello",
  youSuck: "you suck"
};

const strategiesMap = new Map();
strategiesMap.set(known.quit, quit);
strategiesMap.set(known.youSuck, youSuck);
strategiesMap.set(known.hello, hello);

const exitPhrase = "bye!";
function quit() {
  return exitPhrase;
}

function hello() {
  return "hello to you too!";
}

function youSuck() {
  return "you're a bit rude";
}

const strategies = {
  [known.quit]: quit,
  [known.hello]: hello,
  [known.youSuck]: youSuck
};

function defaultHandler() {
  return "huh?";
}

// toggle to true if you'd like to use the map instead of the dictionary
//  honestly, I'd use the dictionary / object - it's easier to read and has
//  a one-line setup, no need for .add() calls
const useMap = false;

async function respondToUser() {
  while (true) {
    const
      input = await readUserInput(),
      handler = findHandlerFor(input),
      result = handler();
    if (result) {
      console.log(result);
      if (result === exitPhrase) {
        process.exit(0);
      }
    } else {
      console.error(`handler doesn't return a value for '${input}'`);
    }
  }
}

function findHandlerFor(input) {
  const handler = useMap
    ? strategiesMap.get(input)
    : strategies[input];
  return handler || defaultHandler;
}

(async function () {
  await respondToUser();
})();
