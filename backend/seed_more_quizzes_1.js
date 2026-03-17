const mysql = require('mysql2/promise');

// 25 UNIQUE REAL QUESTIONS PER LEVEL
const pythonQuestions = {
  easy: [
    ["What is Python?", "A snake", "A high-level programming language", "A web browser", "A database", "B"],
    ["Which keyword is used to define a function in Python?", "func", "define", "def", "function", "C"],
    ["What is the output of print(2 ** 3)?", "6", "8", "9", "Error", "B"],
    ["Which data type is immutable?", "List", "Dictionary", "Set", "Tuple", "D"],
    ["What does len() do?", "Returns the length of an object", "Converts to string", "Prints to console", "Finds the max value", "A"],
    ["How do you insert an item at the end of a list?", "list.add()", "list.push()", "list.insert()", "list.append()", "D"],
    ["Which of these is a Python data type?", "real", "boolean", "bool", "character", "C"],
    ["How do you start a comment in Python?", "//", "/*", "#", "--", "C"],
    ["What is the correct file extension for Python files?", ".py", ".pyt", ".pt", ".python", "A"],
    ["How do you create a variable with the numeric value 5?", "x = 5", "int x = 5", "x = int(5)", "Both A and C are valid", "D"],
    ["What is the result of 10 % 3?", "3", "1", "0.33", "10", "B"],
    ["Which function takes input from the user?", "get()", "scan()", "input()", "read()", "C"],
    ["How do you convert a string to an integer?", "int()", "str()", "float()", "parse()", "A"],
    ["What is the result of 'a' + 'b'?", "'ab'", "Error", "1", "None", "A"],
    ["Which operator is used for exponentiation?", "^", "**", "exp()", "%", "B"],
    ["What does the break statement do?", "Skips the current iteration", "Exits the loop", "Pauses execution", "Throws an error", "B"],
    ["Which is a valid boolean value in Python?", "true", "TRUE", "True", "1", "C"],
    ["How do you access the first element of a list named 'lst'?", "lst[1]", "lst(0)", "lst[0]", "lst.first()", "C"],
    ["What is a dictionary in Python?", "A sequence of numbers", "An ordered array", "A collection of key-value pairs", "A set of unique items", "C"],
    ["Which method converts a string to lowercase?", "lower()", "toLowerCase()", "islower()", "down()", "A"],
    ["What is the output of bool(0)?", "True", "False", "None", "Error", "B"],
    ["How do you define a class in Python?", "class MyClass:", "define MyClass:", "MyClass = class()", "create class MyClass", "A"],
    ["What is the keyword to import a module?", "include", "import", "require", "using", "B"],
    ["Which of the following is an iterative loop?", "if", "for", "switch", "try", "B"],
    ["What does type() do?", "Checks if variable is empty", "Returns the type of an object", "Converts integer to string", "Prints a type string", "B"]
  ],
  medium: [
    ["What is a Python decorator?", "A UI styling library", "A function that modifies the behavior of another function", "A class inheritance method", "A built-in loop", "B"],
    ["What is the difference between a list and a tuple?", "Lists are immutable, tuples are mature", "Lists are mutable, tuples are immutable", "Lists hold numbers, tuples hold strings", "No difference", "B"],
    ["What does the map() function do?", "Creates a geographic map", "Applies a function to all items in an input list", "Locates a memory address", "Merges two lists", "B"],
    ["How do you handle exceptions in Python?", "try...catch", "do...while", "try...except", "error...resume", "C"],
    ["What is the purpose of the 'self' parameter?", "To reference the current instance of the class", "To reference the parent class", "To create a global variable", "To pass the function name", "A"],
    ["What is a lambda function?", "A multi-line block", "An anonymous single-lined function", "A database query", "An asynchronous callback", "B"],
    ["Which method removes and returns the last item in a list?", "pop()", "remove()", "delete()", "discard()", "A"],
    ["What does the zip() function do?", "Compresses files", "Aggregates elements from two or more iterables", "Encrypts strings", "Zips arrays into memory", "B"],
    ["What is list comprehension?", "A way to print lists", "A concise way to create lists", "A memory optimization", "A class method", "B"],
    ["What is the global Interpreter Lock (GIL)?", "A security feature", "A lock that prevents multiple native threads from executing Python bytecodes at once", "A database lock", "A network firewall", "B"],
    ["How do you create a generator?", "Using the yield keyword in a function", "Using generator()", "Returning a list", "With 'async def'", "A"],
    ["Which of the following creates an empty set?", "set()", "{}", "[]", "empty()", "A"],
    ["What does *args do in a function definition?", "Passes keyword arguments", "Multiplies arguments", "Allows passing a variable number of positional arguments", "Raises an error", "C"],
    ["What does **kwargs do in a function definition?", "Allows passing a variable number of keyword arguments", "Squares the values", "Creates a dictionary globally", "Ignored by interpreter", "A"],
    ["What is the output of [1, 2, 3] * 2?", "[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "Error", "[[1,2,3],[1,2,3]]", "B"],
    ["How do you deep copy an object?", "copy(obj)", "obj.copy()", "import copy; copy.deepcopy(obj)", "obj = obj", "C"],
    ["What is the __init__ method?", "The destruction method", "A built-in module", "The constructor method of a class", "An import statement", "C"],
    ["What does the enumerate() function do?", "Counts lines of code", "Adds a counter to an iterable", "Converts string to int", "Math enumeration", "B"],
    ["Which library is widely used for data manipulation?", "requests", "Flask", "Django", "pandas", "D"],
    ["What is virtualenv used for?", "Virtual Reality", "Creating isolated Python environments", "Simulating servers", "Mocking tests", "B"],
    ["How do you concatenate two dictionaries in Python 3.9+?", "dict1 + dict2", "dict1 | dict2", "dict1.add(dict2)", "concat(dict1, dict2)", "B"],
    ["What is a docstring?", "A string of documents", "A string literal used to document a module, class, or function", "A JSON file", "A variable type", "B"],
    ["What is PEP 8?", "A Python web framework", "A style guide for Python code", "A new Python version", "A standard database", "B"],
    ["What does the pass statement do?", "Returns true", "Does nothing, used as a placeholder", "Passes a variable to a function", "Exits the program", "B"],
    ["What happens if a module is imported twice?", "Error is thrown", "Python loads it both times", "Python only loads it once", "It overwrites the memory", "C"]
  ],
  hard: [
    ["What is monkey patching?", "Fixing a bug", "Dynamic modifications of a class or module at runtime", "A security exploit", "Testing framework", "B"],
    ["What is the difference between @staticmethod and @classmethod?", "@classmethod takes cls as first parameter, @staticmethod takes no implicit first argument", "They are identical", "@staticmethod is faster", "@classmethod is only for inheritance", "A"],
    ["What are metaclasses?", "Classes of classes, that define how a class behaves", "Abstract classes", "Classes written in C++", "Data structures", "A"],
    ["How is memory managed in Python?", "Manual allocation", "C++ new/delete", "Private heap space managed by the Python memory manager and garbage collector", "OS Kernel directly", "C"],
    ["What is a closure?", "A closing bracket", "A nested function that captures and remembers the state of its enclosing environment", "A network connection close", "A file end", "B"],
    ["What is the resolution order for inheritance?", "Bottom-up", "Method Resolution Order (MRO) using C3 linearization", "Top-down", "Random", "B"],
    ["How can you bypass the GIL?", "By using multithreading alone", "By using the multiprocessing module or C extensions", "By using asyncio", "You cannot bypass it", "B"],
    ["What are slots (__slots__) in Python?", "A game module", "A way to explicitly declare data members and prevent the dynamic creation of __dict__ to save memory", "Multithreading locks", "Network sockets", "B"],
    ["What is the purpose of __new__?", "To instantiate a new object before __init__ is called", "To delete an object", "To reset variables", "To override operators", "A"],
    ["Explain duck typing.", "Checking types explicitly", "\"If it walks like a duck and quacks like a duck, it must be a duck.\"", "A type hint system", "A unit test method", "B"],
    ["What is asyncio?", "A synchronous library", "A library to write concurrent code using the async/await syntax", "A database adapter", "A front-end tool", "B"],
    ["How do you profile Python code?", "cProfile module", "console.log", "time.sleep()", "print statements", "A"],
    ["What does the built-in function id() do?", "Generates a UUID", "Returns the identity (memory address) of an object", "Creates a primary key", "Returns process ID", "B"],
    ["What is a generator expression?", "A fast way to write generators without the yield keyword using parentheses ()", "A regex pattern", "A mathematical formula", "A lambda function", "A"],
    ["Why use Cython?", "To write CSS", "To give Python C-like performance by compiling it to C code", "To encrypt data", "To run Python in the browser", "B"],
    ["What is the difference between shallow and deep copy?", "A deep copy constructs a new compound object and recursively inserts copies of the objects found in the original", "There is no difference", "Shallow copy is faster for networking", "Deep copy is only for arrays", "A"],
    ["What is the purpose of the sys module?", "System styling", "Interacting with the operating system, like argv and exit()", "Running SQL", "Managing system memory hardware", "B"],
    ["What are descriptors in Python?", "Manuals for code", "Object attribute management protocols containing __get__, __set__, or __delete__", "Decorators strictly for classes", "Data types like int and str", "B"],
    ["What does the functools.wraps decorator do?", "Wraps code in a try block", "Updates the wrapper function to look like the wrapped function (retaining docstrings and names)", "Encrypts a function", "Compresses a module", "B"],
    ["What is pickling?", "Putting objects in a jar", "The process of converting a Python object hierarchy into a byte stream", "Database compression", "A list sorting algorithm", "B"],
    ["Which built-in deals with weak references?", "weakref module", "garbage.collect", "strRef", "No such thing", "A"],
    ["What is the 'async for' loop used for?", "Standard loops", "Iterating over asynchronous iterables", "Fast threading", "Multiprocessing loops", "B"],
    ["What does python -m venv do exactly under the hood?", "Copies the entire python installation", "Creates a symlink-based isolated python environment", "Installs Docker", "Downloads Anaconda", "B"],
    ["How does the 'is' operator differ from '=='?", "'is' checks identity (memory address), '==' checks value equality", "They are exactly the same", "'is' is for strings only", "'==' is for numbers only", "A"],
    ["What are context managers?", "Managers of global state", "Objects that allocate and release resources precisely, usually with the 'with' statement", "The Redux equivalent in Python", "Network state machines", "B"]
  ]
};

const nodeQuestions = {
  easy: [
    ["What is Node.js?", "A frontend library", "A server-side JavaScript runtime built on Chrome's V8 engine", "A CSS framework", "A database management system", "B"],
    ["Who created Node.js?", "Brendan Eich", "Tim Berners-Lee", "Ryan Dahl", "Guido van Rossum", "C"],
    ["Which language is Node.js programmed in?", "Python & Java", "C, C++, and JavaScript", "Ruby & PHP", "Go & Rust", "B"],
    ["What is npm?", "Node Package Manager", "New Project Module", "Node Process Monitoring", "No Problem Maker", "A"],
    ["Which module is used to create an HTTP server in Node.js?", "http", "fs", "path", "url", "A"],
    ["How do you import a module in CommonJS?", "import mod from 'mod'", "require('mod')", "load('mod')", "include('mod')", "B"],
    ["What is the global object in Node.js instead of 'window'?", "document", "global", "environment", "system", "B"],
    ["What does 'fs' stand for?", "File System", "Fast Server", "Front Server", "File Script", "A"],
    ["Which command initializes a new Node.js project?", "node start", "npm init", "node init", "npm create", "B"],
    ["Which framework is most commonly used with Node.js?", "Django", "Spring", "Express.js", "Laravel", "C"],
    ["How do you execute a Node.js script named 'app.js'?", "run app.js", "execute app.js", "node app.js", "start app.js", "C"],
    ["What is a callback function?", "A function that calls back the server", "A function passed into another function as an argument, meant to be invoked later", "A recursive function", "An error handler", "B"],
    ["What is package.json?", "A file extending JSON syntax", "A file containing metadata and dependencies for a Node project", "A database file", "A script runner", "B"],
    ["Is Node.js single-threaded or multi-threaded?", "Multi-threaded", "Single-threaded (using event loop)", "No-threaded", "It depends on the OS", "B"],
    ["Which method is used to read a file synchronously?", "fs.readFile", "fs.readFileSync", "fs.read", "fs.syncRead", "B"],
    ["What is the default port for HTTP?", "80", "443", "3000", "8080", "A"],
    ["What is the purpose of module.exports?", "To import data", "To export variables or functions to be used in other files", "To restart the module", "To compile code", "B"],
    ["How do you install an npm package globally?", "npm install -g <package>", "npm global install <package>", "npm -global <package>", "npm add <package>", "A"],
    ["What does req.body contain in Express (with a parser)?", "The URL parameters", "The query string", "The parsed requested payload data", "The headers", "C"],
    ["What does res.send() do in Express?", "Sends an email", "Sends the HTTP response", "Redirects the request", "Opens a socket", "B"],
    ["Which is NOT a core Node.js module?", "http", "express", "crypto", "events", "B"],
    ["How do you access environment variables?", "process.env", "node.env", "global.env", "window.env", "A"],
    ["What is __dirname?", "The directory name of the current module", "A database name", "The parent directory", "A global variable for routing", "A"],
    ["What does 'nodemon' do?", "A demon process", "Automatically restarts the node application when file changes in the directory are detected", "Monitors database queries", "Minifies JS files", "B"],
    ["Which HTTP method is used to CREATE a new resource?", "GET", "PUT", "POST", "DELETE", "C"]
  ],
  medium: [
    ["What is the Event Loop in Node.js?", "A loop for arrays", "A mechanism that handles asynchronous callbacks, executing them when the call stack is empty", "A server router", "A database connection loop", "B"],
    ["What is REPL?", "Read Eval Print Loop", "Real Execution Pattern Layer", "Read Express Parse Limit", "Run Execute Process List", "A"],
    ["What are Streams in Node.js?", "Video playing plugins", "Objects that let you read data from a source or write data to a destination in continuous fashion", "Memory buffers only", "Network sockets", "B"],
    ["What is the difference between process.nextTick() and setImmediate()?", "nextTick runs at the start of the next phase, setImmediate runs at the end", "nextTick runs before I/O events, setImmediate runs in the check phase after I/O", "They are entirely identical", "setImmediate is faster", "B"],
    ["What is a Buffer class in Node.js?", "A class to pause execution", "A class used to handle raw binary data", "A database cacher", "A string manipulator", "B"],
    ["How does Node.js handle concurrency despite being single-threaded?", "By using an asynchronous, event-driven, non-blocking I/O model", "By spawning multiple processes automatically", "By compiling to C++", "It does not handle concurrency", "A"],
    ["What is the package-lock.json file?", "Locks the computer", "Stores exactly which versions of dependencies were installed", "Enhances security encryption", "Prevents code execution", "B"],
    ["What is middleware in Express?", "Hardware logic", "Functions that have access to the request/response objects and the next middleware function", "A database driver", "The operating system", "B"],
    ["What does EventEmitter do?", "Sends emails", "Facilitates communication between objects in Node.js via events and listeners", "Emits HTTP requests", "Calculates server load", "B"],
    ["Why is blocking I/O dangerous in Node.js?", "It causes memory leaks", "Because Node.js is single-threaded, blocking I/O stops all other parallel execution", "It crashes the database", "It encrypts the payload", "B"],
    ["What is the cluster module used for?", "Managing database clusters", "Spawning multiple child-processes that all share the same server port to handle more load", "Grouping arrays", "Structuring file directories", "B"],
    ["Which hashing library is commonly used to hash passwords in Node?", "crypto", "bcrypt", "jsonwebtoken", "fs", "B"],
    ["What is the purpose of CORS?", "Core Operating Routing System", "Cross-Origin Resource Sharing, a mechanism to allow restricted resources to be requested from another domain", "A database schema", "Secure WebSockets", "B"],
    ["How do you handle unhandled promise rejections?", "They are handled automatically", "Listening to the 'unhandledRejection' event on the process object", "Using try/catch in global scope", "Restarting the app", "B"],
    ["What does jwt.sign do?", "Signs a physical document", "Creates a JSON Web Token (JWT)", "Registers a new user", "Verifies a password", "B"],
    ["What is a Promise?", "A guaranteed callback", "An object representing the eventual completion or failure of an asynchronous operation", "A synchronous loop", "An HTTP router", "B"],
    ["How can you parallelize asynchronous operations?", "Using Promise.all()", "Using async/await in a sequence", "Using process.nextTick", "Using synchronous loops", "A"],
    ["What is the role of the 'crypto' module?", "Cryptocurrency mining", "Provides cryptographic functionality like hashing, encrypting, and decrypting", "Database encryption only", "SSL termination only", "B"],
    ["What does app.use() do in Express?", "Imports a module", "Mounts a specified middleware function at the specified path", "Starts the server", "Sends a response", "B"],
    ["Difference between PUT and PATCH methods?", "PUT creates, PATCH deletes", "PUT replaces the entire resource, PATCH applies partial modifications", "No difference", "PATCH replaces the entire resource", "B"],
    ["What is an API gateway?", "An entry point for clients to access microservices", "A payment processor", "A frontend UI", "A database index", "A"],
    ["What does the 'path' module do?", "Handles physical vehicle routing", "Provides utilities for working with file and directory paths", "Draws SVG paths", "Calculates network routes", "B"],
    ["How do you parse incoming JSON requests in modern Express?", "body-parser library or express.json()", "JSON.parse() directly on req", "express.body()", "req.json()", "A"],
    ["What is socket.io used for?", "Database connections", "Real-time, bidirectional and event-based communication between browser and server", "Sending emails", "Parsing XML", "B"],
    ["What happens if you don't call next() in an Express middleware?", "It automatically continues", "The request is left hanging and times out", "It throws an error", "It sends a 200 OK", "B"]
  ],
  hard: [
    ["Explain the phases of the Node.js Event Loop.", "Start, middle, end", "Timers, pending callbacks, idle/prepare, poll, check, close callbacks", "Init, Request, Response", "Thread allocation, Execution, Cleanup", "B"],
    ["What is libuv?", "A video library", "A multi-platform support library with a focus on asynchronous I/O that powers the Event Loop", "A UI component", "A database driver", "B"],
    ["What is the difference between spawn() and exec() in child_process?", "spawn is for Windows, exec for Linux", "spawn returns a stream (good for large data), exec buffers the output and returns the whole string", "exec is faster", "There is no difference", "B"],
    ["How do memory leaks occur in Node.js?", "Running out of hard drive space", "Keeping references to unused objects in global variables or closures, preventing Garbage Collection", "Using const instead of let", "Returning 404 errors", "B"],
    ["What is the V8 Engine built with?", "JavaScript", "C++", "Java", "Python", "B"],
    ["What is a worker thread?", "A low-wage process", "A module to execute JavaScript in parallel threads, useful for CPU-intensive tasks", "A database connection", "A callback queue", "B"],
    ["How does Node.js resolve module paths?", "Random search", "Core modules -> node_modules traversal up the directory tree -> global modules", "Only checks the current folder", "Only checks node_modules", "B"],
    ["What is a memory heap profiling used for?", "Measuring hard drive size", "Taking snapshots to find memory leaks and inspect the V8 heap usage", "Testing network latency", "Benchmarking CPU speed", "B"],
    ["How do you mitigate extremely heavy CPU tasks holding up the Event loop?", "Use worker_threads, child processes, or offload to a separate microservice", "Use setImmediate", "Use synchronous code instead", "Increase RAM", "A"],
    ["What is Backpressure in streams?", "A networking error", "When the readable stream produces data faster than the writable stream can handle it, requiring buffering management", "A database timeout", "An HTTP 500 error", "B"],
    ["What is the purpose of N-API?", "A routing API", "An API for building native Addons for Node.js using C/C++ without breaking changes across Node versions", "A React library", "A database API", "B"],
    ["How do you safely store sensitive tokens in a production Node app?", "In regular variables", "In public repositories", "In environment variables injected at runtime, avoiding hardcoding them in source", "In JSON files on the client", "C"],
    ["Explain gracefully shutting down a Node.js server.", "Ctrl+C", "Listening to SIGINT/SIGTERM, stopping new requests, finishing current requests, then process.exit(0)", "process.kill()", "Pulling the power plug", "B"],
    ["What is the max memory limit heavily dependent on in Node.js by default?", "The operating system RAM", "The V8 engine limits (approx 1.4GB for 64-bit systems historically, customizable via --max-old-space-size)", "The size of node_modules", "The database size", "B"],
    ["What is a fork() in Node.js child_process?", "A dining utensil analyzer", "A special case of spawn() that opens a dedicated IPC channel to pass messages between parent and child", "A git repository tool", "An error handling method", "B"],
    ["How does garbage collection work in V8?", "It doesn't", "Generational GC using Scavenger for new space and Mark-Sweep-Compact for old space", "Manual allocation only", "Reference counting only", "B"],
    ["What is Thread Pool in Node.js?", "A place for threads to relax", "A pool of worker threads (default 4) provided by libuv to handle heavy operations like fs, crypto, dns", "A connection pool for database", "A memory cluster", "B"],
    ["How do you prevent SQL Injection in a Node.js API?", "Using parameterised queries / prepared statements via the database driver", "Removing all SQL code", "Using regex to remove spaces", "Checking if the input is a string", "A"],
    ["What is the purpose of the 'os' module?", "To reinstall the OS", "To provide operating system-related utility methods and properties (like CPU cores, memory)", "To interface with the browser", "To run bash commands directly", "B"],
    ["What is Server-Sent Events (SSE)?", "A socket.io alternative", "A standard allowing a server to push updates to a client over a single HTTP connection", "A database sync tool", "An email protocol", "B"],
    ["What does pm2 do in a Node.js ecosystem?", "A package manager like npm", "A production process manager to keep Node.js apps alive, handle clustering, and logging", "A database manager", "A testing framework", "B"],
    ["What is a distributed lock in microservices?", "A lock on a specific file", "A mechanism (e.g. via Redis) ensuring a shared resource is accessed by only one Node.js instance at a time", "A security token", "A JWT feature", "B"],
    ["What is the purpose of JSON Web Signature (JWS)?", "To format JSON perfectly", "The standard that represents content secured with digital signatures or MACs within JWTs", "An HTML markup", "A CSS processor", "B"],
    ["How are variables scoped in a Node.js CommonJS module?", "Globally to the Node process", "Locally to the file's module wrapper function, not global", "To the window object", "To the function only", "B"],
    ["Why would you use gRPC over REST in internal microservices?", "Because it is older", "gRPC uses Protocol Buffers and HTTP/2, offering lower latency, smaller payload size, and bi-directional streaming", "gRPC uses JSON", "REST is no longer supported", "B"]
  ]
};

const sqlQuestions = {
  easy: [
    ["What does SQL stand for?", "Structured Query List", "Structured Query Language", "Statement Question Language", "System Query Link", "B"],
    ["Which statement is used to extract data from a database?", "EXTRACT", "GET", "SELECT", "PULL", "C"],
    ["Which clause is used to filter records?", "FILTER", "WHERE", "HAVING", "ORDER BY", "B"],
    ["Which SQL keyword is used to sort the result-set?", "SORT BY", "ORDER BY", "GROUP BY", "ALIGN", "B"],
    ["How do you select all columns from a table named 'Persons'?", "SELECT Persons", "SELECT * FROM Persons", "SELECT *.Persons", "SELECT ALL FROM Persons", "B"],
    ["Which statement is used to update data in a database?", "SAVE", "MODIFY", "UPDATE", "CHANGE", "C"],
    ["Which statement is used to delete data from a database?", "REMOVE", "DELETE", "COLLAPSE", "DROP", "B"],
    ["Which operator is used to search for a specified pattern in a column?", "LIKE", "SEARCH", "MATCH", "GET", "A"],
    ["How do you insert new data into a database?", "ADD TO", "INSERT INTO", "PUT INTO", "INCLUDE", "B"],
    ["What does the COUNT() function do?", "Counts characters", "Returns the number of rows that match a specified criterion", "Calculates a sum", "Counts databases", "B"],
    ["Which statement is used to create a new database?", "NEW DATABASE", "GENERATE DATABASE", "CREATE DATABASE", "BUILD DATABASE", "C"],
    ["Which of these is a valid comparison operator in SQL?", "==", "!=", "<=>", "<>", "D"],
    ["What does the DISTINCT keyword do?", "Returns duplicate values", "Returns only different (unique) values", "Sorts the data", "Deletes duplicates", "B"],
    ["Which keyword is used to return only matching rows from two tables?", "INNER JOIN", "CROSS JOIN", "LEFT JOIN", "MERGE", "A"],
    ["How do you add a new column to a table?", "ADD COLUMN", "ALTER TABLE", "UPDATE TABLE", "MODIFY COLUMN", "B"],
    ["Which SQL statement is used to sum numeric values?", "TOTAL()", "SUM()", "MAX()", "CALC()", "B"],
    ["What does the AVG() function do?", "Calculates the mode", "Calculates the average value of a numeric column", "Finds the median", "Counts average users", "B"],
    ["What is a Primary Key?", "A key to encrypt data", "A column (or group of columns) that uniquely identifies each row in a table", "A password to the database", "The first column in a table", "B"],
    ["What is a Foreign Key?", "A key from an external API", "A key used to link two tables together referencing the primary key of another table", "A secondary index", "A key that generates foreign data", "B"],
    ["Which SQL keyword is used to group rows that have the same values?", "ORDER BY", "CLUSTER BY", "GROUP BY", "MERGE BY", "C"],
    ["What represents 'any number of characters' in a LIKE query string?", "?", "*", "%", "_", "C"],
    ["What does the IS NULL operator check?", "If a value is zero", "If a value is empty string", "If a value is exactly NULL", "If a value is 'NULL' text", "C"],
    ["How do you change 'name' to 'first_name' in a result set alias?", "SELECT name AS first_name", "SELECT name TO first_name", "SELECT name first_name", "SELECT first_name FROM name", "A"],
    ["What is the default sort order for ORDER BY?", "Descending", "Random", "Ascending", "No order", "C"],
    ["Which SQL clause limits the number of rows returned?", "LIMIT or TOP", "MAX", "CAP", "REDUCE", "A"]
  ],
  medium: [
    ["What is the difference between WHERE and HAVING?", "They are the same", "WHERE filters rows before aggregation, HAVING filters after aggregation", "HAVING is for text, WHERE is for numbers", "WHERE is faster", "B"],
    ["What does a LEFT JOIN do?", "Returns all records from the right table", "Returns only matching records", "Returns all records from the left table, and matched records from the right table", "Randomly joins records", "C"],
    ["What is an INDEX in SQL?", "A book index", "A database structure that improves the speed of data retrieval operations", "A foreign key", "A table type", "B"],
    ["What is a subquery?", "A failed query", "A query nested inside another query", "A query run backwards", "A fast query", "B"],
    ["What is the purpose of the UNION operator?", "To join two columns", "To combine the result sets of two or more SELECT statements (removing duplicates by default)", "To merge two databases", "To add numeric totals", "B"],
    ["Difference between UNION and UNION ALL?", "UNION is faster", "UNION ALL keeps duplicate records, UNION removes them", "UNION ALL only takes tables", "No difference", "B"],
    ["What does the COALESCE() function do?", "Combines databases", "Returns the first non-null value in a list", "Calculates the sum of all inputs", "Transforms strings", "B"],
    ["What is a View?", "A graphical interface", "A virtual table based on the result-set of an SQL statement", "A stored procedure", "An index", "B"],
    ["What is normalization?", "Making data normal", "The process of organizing data to reduce redundancy and improve data integrity", "Setting all values to 0", "Formatting dates", "B"],
    ["What is the 1st Normal Form (1NF)?", "Every table must have 1 row", "Each column must contain atomic (indivisible) values and have unique names", "No foreign keys", "Everything in one table", "B"],
    ["What is a Trigger?", "A button in the UI", "Stored program executed automatically to respond to specific events (INSERT, UPDATE, DELETE) on a table", "An error message", "A manual backup", "B"],
    ["What is an execution plan?", "A schedule for backups", "A roadmap generated by the query optimizer detailing how a query will be executed", "A project timeline", "A table definition", "B"],
    ["Which constraint ensures all values in a column are different?", "UNIQUE", "NOT NULL", "CHECK", "DEFAULT", "A"],
    ["What does the EXISTS operator do?", "Creates a table", "Tests for the existence of any record in a subquery, returning TRUE if 1 or more records exist", "Checks if database is online", "Deletes a record", "B"],
    ["What does the BETWEEN operator do?", "Selects values within a given range", "Subtracts two columns", "Joins two tables", "Calculates differences", "A"],
    ["How do you copy data from one table to another?", "INSERT INTO dest SELECT * FROM src", "COPY src TO dest", "MOVE src dest", "CLONE src dest", "A"],
    ["What is a stored procedure?", "A backup file", "A prepared SQL code that you can save and reuse over and over again", "A temporary table", "An encrypted column", "B"],
    ["What does full outer join do?", "Same as inner join", "Returns all records when there is a match in either left or right table", "Returns only non-matching records", "Creates a Cartesian product", "B"],
    ["What is a Cartesian product (CROSS JOIN)?", "A filtered join", "A join where each row of the first table is combined with each row of the second table", "A geometric calculation", "A cross-database link", "B"],
    ["What is the IN operator used for?", "Checking inside databases", "To specify multiple values in a WHERE clause (shorthand for multiple OR conditions)", "Inserting records", "Indexing", "B"],
    ["What is a sequence (or Auto Increment)?", "A loop in SQL", "A feature that automatically generates unique numeric values for primary keys", "A row numbering algorithm", "A table sequence", "B"],
    ["Difference between TRUNCATE and DELETE?", "DELETE is faster", "TRUNCATE deletes the table structure", "TRUNCATE removes all rows fast without logging individual row deletions; DELETE logs each deletion", "No difference", "C"],
    ["What is a Self Join?", "Joining a table to itself", "A solitary join", "Joining single column", "An error", "A"],
    ["What is the CHECK constraint?", "Checks for viruses", "Limits the value range that can be placed in a column", "Ensures values are NOT NULL", "Validates table schemas", "B"],
    ["What is a composite key?", "A key made of composite material", "A primary key composed of two or more columns", "A foreign key", "An encrypted key", "B"]
  ],
  hard: [
    ["Explain ACID properties.", "Atomicity, Consistency, Isolation, Durability", "Active, Cluster, Index, Data", "Array, Column, Integer, Double", "Access, Control, Identify, Database", "A"],
    ["What is an exclusive table lock?", "A lock that prevents other sessions from reading or writing to a table", "A lock that allows reading but not writing", "A password lock", "An encrypted lock", "A"],
    ["What is the difference between Clustered and Non-Clustered Indexes?", "They are the same", "Clustered index determines the physical order of rows; Non-clustered is a separate structure pointing to the data", "Non-clustered is faster for INSERTs", "Clustered is only for strings", "B"],
    ["What does the ROW_NUMBER() window function do?", "Returns the total row count", "Assigns a unique sequential integer to rows within a partition of a result set", "Returns the physical disk row number", "Checks for row validity", "B"],
    ["What is a Deadlock?", "A crashed database", "A situation where two or more transactions are waiting for each other to release locks, causing an infinite standstill", "A deleted lock", "A network ping timeout", "B"],
    ["What is a materialized view?", "A view that only shows UI material", "A view that physically stores the result of the query on disk for faster access, unlike standard logical views", "A 3D database view", "A standard cached table", "B"],
    ["What is cursor in SQL?", "The mouse pointer", "A database object used to retrieve and manipulate data row-by-row", "An index navigator", "A transaction log", "B"],
    ["What is a Common Table Expression (CTE)?", "A common error text", "A temporary named result set created with the WITH clause, used within a SELECT, INSERT, UPDATE, or DELETE", "A persistent table", "A cross join", "B"],
    ["What isolation level prevents Dirty Reads, Non-Repeatable Reads, and Phantoms?", "Read Uncommitted", "Serializable", "Repeatable Read", "Read Committed", "B"],
    ["What is an execution plan's 'Table Scan'?", "A good thing, highly optimized", "When the DB engine must scan every row in a table because it can't use an index", "A virus scan", "A schema review", "B"],
    ["How do you handle recursive queries?", "Using loops", "Using a Recursive CTE (Common Table Expression)", "Using nested IF statements", "Using stored procedures only", "B"],
    ["What does the LEAD() and LAG() window function do?", "Speeds up or slows down the query", "Accesses data from a subsequent (LEAD) or previous (LAG) row in the same result set without self-joining", "Calculates network lag", "Measures database lead time", "B"],
    ["What is a transaction?", "Sending money", "A sequence of database operations treated as a single logical unit of work (either all succeed or all fail)", "A database connection", "A table update", "B"],
    ["What is B-tree?", "A tree structure used internally by databases to efficiently store and search indexed data", "A binary table", "A business logic tree", "A backup architecture", "A"],
    ["What is query optimization / hints?", "Commenting the code", "Providing directives to the optimizer to force a specific execution plan (like forcing an index)", "Googling SQL syntax", "Deleting data", "B"],
    ["What does the COMMIT and ROLLBACK commands do?", "Starts and stops servers", "COMMIT saves transaction changes permanently; ROLLBACK reverts them to the last state", "Copies and deletes", "Indexes and De-indexes", "B"],
    ["What is data warehousing?", "Storing servers in a warehouse", "A system for reporting and data analysis, storing large amounts of historical data aggregated from various sources", "Backing up databases", "A NoSQL approach", "B"],
    ["What is the difference between inline table-valued function and multi-statement table-valued function?", "No difference", "Inline contains a single SELECT statement and no BEGIN/END; Multi-statement uses BEGIN/END and a defined return table", "Inline returns strings, multi returns arrays", "Multi is an aggregate function", "B"],
    ["What does a correlated subquery mean?", "A subquery that causes an error", "A subquery that references one or more columns from the outer query, so it executes once for every row of the outer query", "A subquery run in parallel", "A completely independent query", "B"],
    ["What is a hash join?", "A cryptographic link", "An algorithm the DB uses to join large, unsorted sets by hashing keys from one table and matching them from the other", "A hashtag tool", "A security feature", "B"],
    ["What is OLTP vs OLAP?", "Object types", "OLTP = Online Transaction Processing (fast, frequent inserts/updates). OLAP = Online Analytical Processing (complex queries, historical data)", "They are identical", "Old vs New DB schemas", "B"],
    ["What is a phantom read?", "Reading ghost data", "When a transaction reads a set of rows, then a second transaction inserts a new row that matches the criteria, so a re-read returns different results", "A crashed disk read", "A corrupted index", "B"],
    ["What does the PIVOT operator do?", "Rotates a table", "Transforms row-level data into column-level data to create cross-tabulation reports", "Deletes pivots", "Centers the data", "B"],
    ["What is Database Sharding?", "Breaking the disk", "A horizontal partitioning technique that separates large databases into smaller, faster, easily managed parts across servers", "Creating table views", "Encrypting partitions", "B"],
    ["Why is SELECT * generally considered bad practice in production applications?", "It generates a syntax error", "It is slower, transfers unnecessary data, and makes the application brittle to schema changes", "It is illegal", "It deletes data", "B"]
  ]
}

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'skilllens_db' });
  const allDb = { 'python': pythonQuestions, 'node.js': nodeQuestions, 'sql': sqlQuestions };

  for (const [skill, levelsData] of Object.entries(allDb)) {
    let skillId;
    const [sRows] = await conn.query('SELECT id FROM skills WHERE name = ?', [skill]);
    if (sRows.length > 0) skillId = sRows[0].id;
    else {
      const [insertS] = await conn.query('INSERT INTO skills (name) VALUES (?)', [skill]);
      skillId = insertS.insertId;
    }

    for (const [diff, qs] of Object.entries(levelsData)) {
      const quizTitle = `${skill.toUpperCase()} ${diff.charAt(0).toUpperCase() + diff.slice(1)} Assessment`;
      
      let quizId;
      const [qRows] = await conn.query('SELECT id FROM quizzes WHERE title = ? AND skill_id = ?', [quizTitle, skillId]);
      if (qRows.length > 0) {
        quizId = qRows[0].id;
        await conn.query('DELETE FROM questions WHERE quiz_id = ?', [quizId]); // Wipe existing
      } else {
        const [insertQ] = await conn.query('INSERT INTO quizzes (title, skill_id, difficulty) VALUES (?, ?, ?)', [quizTitle, skillId, diff]);
        quizId = insertQ.insertId;
      }

      for (let qData of qs) {
        await conn.query(
          'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [quizId, qData[0], qData[1], qData[2], qData[3], qData[4], qData[5]]
        );
      }
      console.log(`Seeded EXACTLY 25 unique ${diff} questions for ${skill}`);
    }
  }
  await conn.end();
}
run();
