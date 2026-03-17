const mysql = require('mysql2/promise');

const javascriptQuestions = {
    easy: [
        { q: "Which symbol is used for comments in JS?", a: "//", b: "/*", c: "<!--", d: "#", ans: "A" },
        { q: "How do you declare a variable that cannot be reassigned?", a: "var", b: "let", c: "const", d: "static", ans: "C" },
        { q: "What does `typeof []` return?", a: "array", b: "object", c: "list", d: "undefined", ans: "B" },
        { q: "Which company developed JavaScript?", a: "Netscape", b: "Microsoft", c: "Oracle", d: "Sun Microsystems", ans: "A" },
        { q: "How do you write 'Hello World' in an alert box?", a: "msg('Hello World');", b: "alert('Hello World');", c: "msgBox('Hello World');", d: "console('Hello World');", ans: "B" },
        { q: "Which keyword is used to declare a function in JavaScript?", a: "def", b: "func", c: "function", d: "method", ans: "C" },
        { q: "Is JavaScript case-sensitive?", a: "Yes", b: "No", c: "Only for variables", d: "Only for functions", ans: "A" },
        { q: "How to call a function named `myFunction`?", a: "call function myFunction()", b: "myFunction()", c: "call myFunction", d: "execute myFunction()", ans: "B" },
        { q: "How to write an IF statement in JavaScript?", a: "if i = 5 then", b: "if i == 5 then", c: "if (i == 5)", d: "if i = 5", ans: "C" },
        { q: "How does a WHILE loop start?", a: "while (i <= 10)", b: "while i = 1 to 10", c: "while (i <= 10; i++)", d: "loop while i < 10", ans: "A" },
        { q: "How can you add a comment that has more than one line?", a: "//This comment has more than one line//", b: "/*This comment has more than one line*/", c: "<!--This comment has more than one line-->", d: "``This comment has more than one line``", ans: "B" },
        { q: "What is the correct way to write a JavaScript array?", a: "var colors = 1 = ('red'), 2 = ('green')", b: "var colors = (1:'red', 2:'green')", c: "var colors = ['red', 'green']", d: "var colors = 'red', 'green'", ans: "C" },
        { q: "How do you round the number 7.25, to the nearest integer?", a: "Math.round(7.25)", b: "Math.rnd(7.25)", c: "round(7.25)", d: "rnd(7.25)", ans: "A" },
        { q: "How do you find the number with the highest value of x and y?", a: "Math.max(x, y)", b: "Math.ceil(x, y)", c: "ceil(x, y)", d: "top(x, y)", ans: "A" },
        { q: "What is the correct JavaScript syntax for opening a new window?", a: "window.open('http://url');", b: "open('http://url'); window();", c: "new Window('http://url');", d: "window.new('http://url');", ans: "A" },
        { q: "Which event occurs when the user clicks on an HTML element?", a: "onmouseclick", b: "onchange", c: "onclick", d: "onmouseover", ans: "C" },
        { q: "How do you declare a JavaScript variable?", a: "v carName;", b: "variable carName;", c: "var carName;", d: "string carName;", ans: "C" },
        { q: "Which operator is used to assign a value to a variable?", a: "*", b: "x", c: "-", d: "=", ans: "D" },
        { q: "What will the following code return: Boolean(10 > 9)", a: "NaN", b: "false", c: "true", d: "undefined", ans: "C" },
        { q: "Is JavaScript the same as Java?", a: "Yes", b: "No", c: "Only in OOP principles", d: "Yes, they run on the JVM", ans: "B" },
        { q: "How do you declare an array in JS?", a: "let arr = [];", b: "let arr = {};", c: "let arr = ();", d: "let arr = <>;", ans: "A" },
        { q: "Which of the following is not a reserved word in JS?", a: "interface", b: "throws", c: "program", d: "short", ans: "C" },
        { q: "What is the index of the first element in an array?", a: "1", b: "0", c: "-1", d: "Depends on array", ans: "B" },
        { q: "What does NaN stand for?", a: "Not a Negative", b: "No absolute Null", c: "Not a Number", d: "Null and None", ans: "C" },
        { q: "What does DOM stand for?", a: "Data Object Model", b: "Document Object Model", c: "Database Object Management", d: "Dynamic Object Maker", ans: "B" }
    ],
    medium: [
        { q: "Which method is used to serialize an object into a JSON string?", a: "JSON.parse()", b: "JSON.serialize()", c: "JSON.toString()", d: "JSON.stringify()", ans: "D" },
        { q: "What is the output of `typeof null`?", a: '"null"', b: '"undefined"', c: '"object"', d: '"NaN"', ans: "C" },
        { q: "What is a closure in JavaScript?", a: "A function having access to the parent scope", b: "A way to trap errors", c: "A method to close browser tabs", d: "An IIFE", ans: "A" },
        { q: "What will `console.log(1 + '1')` output?", a: "'2'", b: "2", c: "'11'", d: "NaN", ans: "C" },
        { q: "What is the difference between `==` and `===`?", a: "They are the same", b: "`==` compares value, `===` compares value and type", c: "`===` compares value, `==` compares type", d: "Both compare type only", ans: "B" },
        { q: "What will `console.log([] == false)` evaluate to?", a: "false", b: "true", c: "undefined", d: "TypeError", ans: "B" },
        { q: "How do you check if a property exists in an object?", a: "obj.has('prop')", b: "'prop' in obj", c: "obj.prop != null", d: "propertyExists(obj, 'prop')", ans: "B" },
        { q: "What method removes the last element from an array and returns it?", a: "shift()", b: "pop()", c: "push()", d: "splice()", ans: "B" },
        { q: "What does `Array.prototype.map()` return?", a: "A single value", b: "A boolean", c: "A new array", d: "Undefined", ans: "C" },
        { q: "What is the purpose of the `bind()` method?", a: "Immediately invoke a function", b: "Attach event listeners", c: "Create a new function with a bound `this`", d: "Merge two objects", ans: "C" },
        { q: "Which keyword is used to access the parent class's constructor?", a: "parent()", b: "super()", c: "this()", d: "extends()", ans: "B" },
        { q: "What is event delegation?", a: "Attaching an event listener to a parent element", b: "Delegating an event to another function", c: "Preventing default behavior", d: "Stopping event propagation", ans: "A" },
        { q: "What does `Object.keys()` return?", a: "An array of object values", b: "An array of object properties", c: "A new object", d: "An iterator", ans: "B" },
        { q: "What is the value of `this` in an arrow function?", a: "The global object", b: "The object that called the function", c: "The lexical context", d: "Undefined", ans: "C" },
        { q: "How can you empty an array `arr`?", a: "arr.empty()", b: "arr.clear()", c: "arr.length = 0", d: "arr = [] only", ans: "C" },
        { q: "What is a Promise in JavaScript?", a: "An object representing eventual completion of async operation", b: "A strict mode feature", c: "A loop mechanism", d: "A variable type", ans: "A" },
        { q: "What does `JSON.parse()` do?", a: "Converts JSON to string", b: "Converts string to JSON object", c: "Parses an HTML document", d: "Extends a class", ans: "B" },
        { q: "Which method selects the first element that matches a CSS selector?", a: "getElementById()", b: "querySelector()", c: "querySelectorAll()", d: "match()", ans: "B" },
        { q: "What is Hoisting?", a: "Calling APIs", b: "Moving declarations to the top", c: "Lifting element z-index", d: "Asynchronous fetching", ans: "B" },
        { q: "What is the default return value of a function?", a: "null", b: "0", c: "undefined", d: "false", ans: "C" },
        { q: "How do you deep clone an object? (Simplest generic way)", a: "Object.assign()", b: "Spread operator {...obj}", c: "JSON.parse(JSON.stringify(obj))", d: "Object.clone()", ans: "C" },
        { q: "What does `Array.prototype.filter()` do?", a: "Mutates the original array", b: "Returns a single boolean", c: "Creates a new array with elements passing the test", d: "Finds the first match", ans: "C" },
        { q: "What does `String.prototype.includes()` return?", a: "A new string", b: "The matched index", c: "A boolean", d: "-1 or index", ans: "C" },
        { q: "What is the result of `0.1 + 0.2 === 0.3`?", a: "true", b: "false", c: "undefined", d: "SyntaxError", ans: "B" },
        { q: "Which feature prevents modifying an object entirely?", a: "Object.seal()", b: "Object.freeze()", c: "Object.lock()", d: "Object.preventExtensions()", ans: "B" }
    ],
    hard: [
        { q: "What does `typeof NaN` return?", a: '"number"', b: '"NaN"', c: '"undefined"', d: '"object"', ans: "A" },
        { q: "What is the V8 Engine?", a: "A CSS parser", b: "JavaScript engine created by Google", c: "A DOM rendering algorithm", d: "A node module", ans: "B" },
        { q: "How does the event loop work in JavaScript?", a: "It runs asynchronously in multiple threads", b: "It blocks the main thread", c: "It pushes sync code to the call stack and async to message queue", d: "It uses web workers automatically", ans: "C" },
        { q: "What is the output of `console.log(typeof arguments)` inside a regular function?", a: '"array"', b: '"list"', c: '"object"', d: '"undefined"', ans: "C" },
        { q: "What is Temporal Dead Zone (TDZ)?", a: "Time between async requests", b: "State of unreachable server", c: "Period where `let`/`const` are inaccessible before init", d: "Garbage collection phase", ans: "C" },
        { q: "What will `console.log(1 < 2 < 3)` and `console.log(3 > 2 > 1)` output?", a: "true, true", b: "true, false", c: "false, false", d: "false, true", ans: "B" },
        { q: "Explain the `Reflect` API.", a: "It provides interceptable methods for objects", b: "It creates a DOM shadow", c: "It handles WebRTC connections", d: "It parses JSON", ans: "A" },
        { q: "What does `Object.create(null)` do?", a: "Throws a TypeError", b: "Creates an empty object without a prototype", c: "Creates an empty array", d: "Creates a function", ans: "B" },
        { q: "What is a Proxy in ES6?", a: "A network router", b: "An object that wraps another to intercept fundamental operations", c: "A design pattern for singletons", d: "A tool for CORS requests", ans: "B" },
        { q: "What is the primary difference between WeakMap and Map?", a: "WeakMap keys can only be strings", b: "WeakMap is slower", c: "WeakMap keys must be objects and are weakly held", d: "Map has no size property", ans: "C" },
        { q: "What is the output of `[1, 2, 3].map(parseInt)`?", a: "[1, 2, 3]", b: "[1, NaN, NaN]", c: "[1, undefined, undefined]", d: "[undefined, NaN, NaN]", ans: "B" },
        { q: "What is Currying in JavaScript?", a: "Frying the main thread", b: "A styling technique", c: "Converting a function of N arguments to N functions of 1 argument", d: "Chaining array methods", ans: "C" },
        { q: "Explain the `yield` keyword.", a: "It pauses and resumes a generator function", b: "It stops a native browser event", c: "It returns a promise", d: "It stops script execution globally", ans: "A" },
        { q: "What does `document.createDocumentFragment()` achieve?", a: "Creates a shadow DOM", b: "Creates an invisible text node", c: "Creates an off-DOM container to minimize reflows", d: "Renders an iframe", ans: "C" },
        { q: "How to prevent caching in a fetch request?", a: "cache: 'force-cache'", b: "cache: 'no-store'", c: "cache: 'false'", d: "cache: 'prevent'", ans: "B" },
        { q: "What happens when you invoke a function using `new`?", a: "It returns an integer", b: "It creates a new empty object and binds `this` to it", c: "It throws a syntax error", d: "It destroys the old object", ans: "B" },
        { q: "Is `typeof null` a language bug?", a: "Yes, it should evaluate to 'null'", b: "No, it's an object mathematically", c: "Yes, it should evaluate to 'undefined'", d: "No, it returns 'number'", ans: "A" },
        { q: "What is tail call optimization?", a: "Optimizing the end of an array", b: "Clearing DOM elements", c: "A compiler optimization for preventing stack overflow in recursion", d: "CSS rendering trick", ans: "C" },
        { q: "What does the `setImmediate` function do in Node.js?", a: "Executes after current event loop turn", b: "Executes immediately bypassing queue", c: "Creates a Web Worker", d: "Kills the script", ans: "A" },
        { q: "What is the difference between `__proto__` and `prototype`?", a: "They are perfectly identical", b: "`__proto__` is an object instance's link, `prototype` is the class property", c: "`prototype` is obsolete", d: "`__proto__` is for arrays only", ans: "B" },
        { q: "How do you detect memory leaks in DevTools?", a: "Network tab", b: "CSS Performance panel", c: "Memory tab using Heap Snapshots", d: "Lighthouse", ans: "C" },
        { q: "What is structural typing (or Duck Typing)?", a: "Typing fast", b: "Object suitability is determined by presence of methods/properties", c: "Using TypeScript interfaces", d: "Inheriting from classes", ans: "B" },
        { q: "What does `Promise.race()` do?", a: "Waits for all promises", b: "Returns the first resolved OR rejected promise", c: "Returns only the first resolved promise", d: "Ignores rejected promises", ans: "B" },
        { q: "What is a Symbol?", a: "A unique and immutable primitive value", b: "An SVG component", c: "An object property modifier", d: "A DOM element tag", ans: "A" },
        { q: "What is the output of `typeof (function(){})`?", a: '"object"', b: '"function"', c: '"undefined"', d: '"closure"', ans: "B" }
    ]
};

async function seedRealJavascript() {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'skilllens_db' });
    console.log("Connected to DB to fix Javascript Questions...");

    // 1. Get Javascript Skill ID
    const [skills] = await conn.query("SELECT id FROM skills WHERE name = 'javascript'");
    if (skills.length === 0) { console.log("JS not found."); return; }
    const skillId = skills[0].id;

    // 2. Clear all existing quizzes for javascript 
    // Wait, first we find the exact IDs of the JS quizzes
    const [quizzes] = await conn.query("SELECT id FROM quizzes WHERE skill_id = ?", [skillId]);
    const quizIds = quizzes.map(q => q.id);

    if (quizIds.length > 0) {
        // Delete all old questions associated with those JS quizzes
        await conn.query("DELETE FROM questions WHERE quiz_id IN (?)", [quizIds]);
        console.log(`Deleted all old JavaScript questions attached to ${quizIds.length} quizzes.`);
    }

    // 3. Keep exactly 3 standard quizzes for (easy, medium, hard) avoiding duplicate quiz rows
    await conn.query("DELETE FROM quizzes WHERE skill_id = ?", [skillId]);
    
    // Create new fresh quizzes
    const difficultyLevels = ['easy', 'medium', 'hard'];
    for (const diff of difficultyLevels) {
        const title = `JAVASCRIPT ${diff.charAt(0).toUpperCase() + diff.slice(1)} Assessment`;
        const [insertQ] = await conn.query("INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)", [skillId, title, diff]);
        const newQuizId = insertQ.insertId;

        console.log(`Created JS Quiz: ${title} (ID: ${newQuizId})`);

        // 4. Insert exactly 25 fresh questions into the newly created quiz
        const qArray = javascriptQuestions[diff];
        for (const item of qArray) {
            await conn.query(
                "INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [newQuizId, item.q, item.a, item.b, item.c, item.d, item.ans]
            );
        }
        console.log(`Seeded EXACTLY 25 real ${diff} questions for javascript`);
    }

    await conn.end();
    console.log("Javascript cleanup complete!");
}

seedRealJavascript().catch(console.error);
